from flask import Blueprint, request, jsonify
from src import socketio
from src.util.db import db, Image
from flask_socketio import emit
from datetime import datetime
import docker
import io

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

        # Save image information to the database
        new_image = Image(
            docker_image_id=image.id,
            description=description,
            user_id=user_id,
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
        return jsonify({'message': 'Image deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500