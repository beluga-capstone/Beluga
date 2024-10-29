# src/blueprints/image.py
from flask import Blueprint, request, jsonify
from src.util.db import db, Image
from datetime import datetime

image_bp = Blueprint('image', __name__)

# Create a new image (POST)
@image_bp.route('/images', methods=['POST'])
def create_image():
    data = request.get_json()
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

# Get all images (GET)
@image_bp.route('/images', methods=['GET'])
def get_images():
    images = Image.query.all()
    images_list = [{
        'docker_image_id': image.docker_image_id,
        'user_id': image.user_id,
        'description': image.description
    } for image in images]
    return jsonify(images_list), 200

# Get a specific image (GET)
@image_bp.route('/images/<string:docker_image_id>', methods=['GET'])
def get_image(docker_image_id):
    image = Image.query.get_or_404(docker_image_id)
    return jsonify({
        'docker_image_id': image.docker_image_id,
        'user_id': image.user_id,
        'description': image.description
    }), 200

# Update an image (PUT)
@image_bp.route('/images/<string:docker_image_id>', methods=['PUT'])
def update_image(docker_image_id):
    image = Image.query.get_or_404(docker_image_id)
    data = request.get_json()
    image.user_id = data.get('user_id', image.user_id)
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
    image = Image.query.get_or_404(docker_image_id)
    try:
        db.session.delete(image)
        db.session.commit()
        return jsonify({'message': 'Image deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
