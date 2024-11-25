from flask import Blueprint, request, jsonify
from src import socketio
from src.util.db import db, Image
from src.util.query_utils import apply_filters
from flask_socketio import emit
from datetime import datetime
from src.util.policies import filter_images
import docker
import io

from src.util.auth import *

docker_client = docker.from_env()

image_bp = Blueprint('image', __name__)


@image_bp.route('/images', methods=['POST'])
@professor_required
def build_image():
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({'error': 'Invalid JSON data'}), 400
    if not data.get('user_id'):
        return jsonify({'error':'invalid user id'}),400

    user_id = data['user_id']
    description = data.get('description', '')
    additional_packages = data.get('additional_packages', '')
    dockerfile_content = data.get('dockerfile_content', '')
    image_tag = data.get('image_tag', f'image_{datetime.utcnow().isoformat()}')

    # Construct base Dockerfile content
    base_dockerfile = (
        "FROM beluga_base_ubuntu\n"
        "RUN apt update && apt install -y git curl wget build-essential {}\n".format(additional_packages)
    )

    # Append custom Dockerfile content if provided
    if dockerfile_content:
        dockerfile_content = base_dockerfile + dockerfile_content
    else:
        dockerfile_content = base_dockerfile

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
            packages=additional_packages
        )
        db.session.add(new_image)
        db.session.commit()

        # Notify the frontend of completion
        socketio.emit('build_complete', {'docker_image_id': image.id})

        return jsonify({'message': 'Image built successfully', 'docker_image_id': image.id}), 201

    except Exception as e:
        db.session.rollback()
        socketio.emit('build_error', {'error': str(e)})
        return jsonify({'error': str(e)}), 500


@image_bp.route('/images/search', methods=['GET'])
@login_required
def search_images():
    user = db.session.get(User, current_user.user_id)
    filters = request.args.to_dict()

    try:
        query = apply_filters(Image, filters)
        filtered_query = filter_images(user, query)
        images = filtered_query.all()

        # Format the response
        images_list = [{
            'docker_image_id': image.docker_image_id,
            'user_id': str(image.user_id),
            'description': image.description
        } for image in images]

        return jsonify(images_list), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



# Get all images (GET)
@image_bp.route('/images', methods=['GET'])
@admin_required
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
@login_required
def get_image(docker_image_id):
    image = db.session.get(Image, docker_image_id)
    if image is None:
        return jsonify({'error': 'Image not found'}), 404

    result = docker_client.images.get(docker_image_id)

    return jsonify({
        'docker_image_id': image.docker_image_id,
        'user_id': str(image.user_id),
        'description': image.description,
        'packages': image.packages,
        'tag':result.tags
    }), 200


# Update an image (PUT)
@image_bp.route('/images/<string:docker_image_id>', methods=['PUT'])
@professor_required
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
@professor_required
def delete_image(docker_image_id):
    # Check if the image exists in the database
    image = db.session.get(Image, docker_image_id)
    if image is None:
        return jsonify({'error': 'Image not found'}), 404

    try:
        # Remove the image from Docker
        docker_client.images.remove(image.docker_image_id, force=True)
        
        # Remove the image from the database
        db.session.delete(image)
        db.session.commit()

        return jsonify({'message': 'Image deleted successfully'}), 200
    except docker.errors.ImageNotFound:
        return jsonify({'error': 'Docker image not found'}), 404
    except docker.errors.APIError as e:
        return jsonify({'error': f'Docker API error: {e.explanation}'}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
