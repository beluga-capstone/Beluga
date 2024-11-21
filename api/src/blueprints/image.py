from flask import Blueprint, request, jsonify
from src import socketio
from src.util.db import db, Image
from flask_socketio import emit
from datetime import datetime
import docker
import io
from flask import current_app
import requests

docker_client = docker.from_env()

image_bp = Blueprint('image', __name__)


# Create a new image (POST)
@image_bp.route('/images', methods=['POST'])
def create_image():
    data = request.get_json()
    
    if not data or not data.get('docker_image_id') or not data.get('user_id'):
        return jsonify({'error': 'Docker Image ID and User ID are required'}), 400
    
    new_image = Image(
        docker_image_id=data['docker_image_id'],
        user_id=data['user_id'],
        description=data.get('description')
    )

    try:
        db.session.add(new_image)
        db.session.commit()
        return jsonify({'message': 'Image created successfully', 'docker_image_id': new_image.docker_image_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@image_bp.route('/images/build', methods=['POST'])
def build_image():
    data = request.get_json()
    dockerfile_content = data['dockerfile_content']
    user_id = data['user_id']
    description = data.get('description', '')
    image_tag = data.get('image_tag', f'image_{datetime.utcnow().isoformat()}')

    registry_ip = current_app.config['REGISTRY_IP']
    registry_port = current_app.config['REGISTRY_PORT']

    try:

        # Use the low-level API client for more granular log handling
        api_client = docker.APIClient()
        
        # Start building the image and stream logs
        logs = api_client.build(
            fileobj=io.BytesIO(dockerfile_content.encode('utf-8')),
            tag=image_tag,
            rm=True,
            decode=True  # Ensures each log entry is JSON-decoded
        )

        for log in logs:
            # Emit each line of the build log to the frontend
            message = log.get('stream') or log.get('status', '').strip()
            if message:
                socketio.emit('build_status', {'status': message})

        # After successful build, retrieve the image by tag
        image = docker_client.images.get(image_tag)

        # Check if an image with the same tag already exists in the database
        existing_image = Image.query.filter_by(docker_image_id=image.id).first()

        if existing_image:
            # If an image already exists, return it
            return jsonify({
                'message': 'Image already exists',
                'docker_image_id': existing_image.docker_image_id
            }), 200

        # Save image information to the database
        new_image = Image(
            docker_image_id=image.id,
            description=description,
            user_id=user_id,
        )
        db.session.add(new_image)
        db.session.commit()

        # Push to registry
        image_tag_registry = f"{registry_ip}:{registry_port}/{image_tag}"
        api_client.tag(image=image.id, repository=image_tag_registry)

        push_logs = api_client.push(f"{registry_ip}:{registry_port}/{image_tag}", stream=True, decode=True)

        # print("image_id:", image_id)
        for push_log in push_logs:
            push_message = push_log.get('status') or push_log.get('error', '').strip()
            if push_message:
                socketio.emit('push_status', {'status': push_message})
                # print(push_message)

        # Remove image locally
        try:
            api_client.remove_image(image=image_tag, force=True)
            socketio.emit('cleanup_status', {'status': f"Image {image_tag} removed locally"})
            # print("done deleted locally")
        except Exception as e:
            socketio.emit('cleanup_status', {'status': f"Failed to remove image {image.id}: {str(e)}"})

        # Notify the frontend of completion
        socketio.emit('build_complete', {'docker_image_id': image.id})

        return jsonify({'message': 'Image built successfully', 'docker_image_id': image.id}), 201

    except Exception as e:
        db.session.rollback()
        socketio.emit('build_error', {'error': str(e)})
        return jsonify({'error': str(e)}), 500


# Get all images (GET)
@image_bp.route('/images', methods=['GET'])
def get_images():
    images = db.session.scalars(db.select(Image)).all()
    images_list = [{
        'docker_image_id': image.docker_image_id,
        'user_id': str(image.user_id),
        'description': image.description
    } for image in images]
    return jsonify(images_list), 200


# Get a specific image (GET)
@image_bp.route('/images/<string:docker_image_id>', methods=['GET'])
def get_image(docker_image_id):
    image = db.session.get(Image, docker_image_id)
    if image is None:
        return jsonify({'error': 'Image not found'}), 404

    result = docker_client.images.get(docker_image_id)

    image_tap = find_image_tag_from_registry(docker_image_id)

    return jsonify({
        'docker_image_id': image.docker_image_id,
        'user_id': str(image.user_id),
        'description': image.description,
        'tag':result.tags
    }), 200


# Update an image (PUT)
@image_bp.route('/images/<string:docker_image_id>', methods=['PUT'])
def update_image(docker_image_id):
    image = db.session.get(Image, docker_image_id)
    if image is None:
        return jsonify({'error': 'Image not found'}), 404

    data = request.get_json()
    image.description = data.get('description', image.description)

    try:
        db.session.commit()
        return jsonify({'message': 'Image updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete an image (DELETE)
@image_bp.route('/images/<string:docker_image_id>', methods=['DELETE'])
def delete_image(docker_image_id):
    image = db.session.get(Image, docker_image_id)
    if image is None:
        return jsonify({'error': 'Image not found'}), 404

    try:
        db.session.delete(image)
        db.session.commit()

        # TO DO: add delete image from the registry
        # 1. Make sure configure the docker registry to delete image
        # 2. Get the manifest tag through http request
        # 3. Delete through http request

        return jsonify({'message': 'Image deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


def find_image_tag_from_registry(image_id):
    registry_ip = current_app.config['REGISTRY_IP']
    registry_port = current_app.config['REGISTRY_PORT']

    registry_url = f"http://{registry_ip}:{registry_port}/v2"
    headers = {"Accept": "application/vnd.docker.distribution.manifest.v2+json"}

    try:
        repos_url = f"{registry_url}/_catalog"
        res = requests.get(repos_url)
        res.raise_for_status()
        repositories = res.json().get("repositories", [])

        for repo in repositories:
            tags_url = f"{registry_url}/{repo}/tags/list"
            tags_res = requests.get(tags_url)
            tags_res.raise_for_status()
            tags = tags_res.json().get("tags", [])

            for tag in tags:
                manifest_url = f"{registry_url}/{repo}/manifests/{tag}"
                manifest_response = requests.get(manifest_url, headers=headers)
                manifest_response.raise_for_status()
                manifest = manifest_response.json()

                if "config" in manifest and manifest["config"]["digest"].endswith(image_id):
                    return f"{registry_ip}:{registry_port}/{repo}:{tag}"

        return "Image tag not found from ID on registry"

    except Exception as e:
        return f"Error tag from id in registry: {str(e)}"