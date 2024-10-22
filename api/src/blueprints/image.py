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
        user_id=data['user_id'],
        name=data.get('name'),
        description=data.get('description'),
        created_at=data.get('created_at', datetime.now()),
        updated_at=data.get('updated_at', datetime.now())
    )
    try:
        db.session.add(new_image)
        db.session.commit()
        return jsonify({'message': 'Image created successfully', 'image_id': new_image.image_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all images (GET)
@image_bp.route('/images', methods=['GET'])
def get_images():
    images = Image.query.all()
    images_list = [{
        'image_id': image.image_id,
        'user_id': image.user_id,
        'name': image.name,
        'description': image.description,
        'created_at': image.created_at,
        'updated_at': image.updated_at
    } for image in images]
    return jsonify(images_list), 200

# Get a specific image (GET)
@image_bp.route('/images/<int:image_id>', methods=['GET'])
def get_image(image_id):
    image = Image.query.get_or_404(image_id)
    return jsonify({
        'image_id': image.image_id,
        'user_id': image.user_id,
        'name': image.name,
        'description': image.description,
        'created_at': image.created_at,
        'updated_at': image.updated_at
    }), 200

# Update an image (PUT)
@image_bp.route('/images/<int:image_id>', methods=['PUT'])
def update_image(image_id):
    image = Image.query.get_or_404(image_id)
    data = request.get_json()
    image.user_id = data.get('user_id', image.user_id)
    image.name = data.get('name', image.name)
    image.description = data.get('description', image.description)
    image.updated_at = datetime.now()
    try:
        db.session.commit()
        return jsonify({'message': 'Image updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete an image (DELETE)
@image_bp.route('/images/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):
    image = Image.query.get_or_404(image_id)
    try:
        db.session.delete(image)
        db.session.commit()
        return jsonify({'message': 'Image deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
