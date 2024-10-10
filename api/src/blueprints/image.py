from flask import Blueprint, request, jsonify
from src.util.db import db, Image, PackageDependency
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
    image.updated_at = data.get('updated_at', image.updated_at)

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

# Add a dependency to an image (POST)
@image_bp.route('/images/<int:image_id>/dependencies', methods=['POST'])
def add_dependency(image_id):
    data = request.get_json()
    
    image = Image.query.get_or_404(image_id)
    
    new_dependency = PackageDependency(
        name=data.get('name'),
        version=data.get('version'),
        image_id=image_id
    )
    
    try:
        db.session.add(new_dependency)
        db.session.commit()
        return jsonify({'message': 'Dependency added successfully', 'dependency_id': new_dependency.dependency_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Remove a dependency from an image (DELETE)
@image_bp.route('/images/<int:image_id>/dependencies/<int:dependency_id>', methods=['DELETE'])
def remove_dependency(image_id, dependency_id):
    dependency = PackageDependency.query.get_or_404(dependency_id)
    
    if dependency.image_id != image_id:
        return jsonify({'error': 'Dependency does not belong to this image'}), 400
    
    try:
        db.session.delete(dependency)
        db.session.commit()
        return jsonify({'message': 'Dependency removed successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all dependencies for an image (GET)
@image_bp.route('/images/<int:image_id>/dependencies', methods=['GET'])
def get_dependencies(image_id):
    image = Image.query.get_or_404(image_id)
    dependencies = PackageDependency.query.filter_by(image_id=image_id).all()
    
    dependencies_list = [{
        'dependency_id': dep.dependency_id,
        'name': dep.name,
        'version': dep.version,
        'installed_at': dep.installed_at
    } for dep in dependencies]
    
    return jsonify(dependencies_list), 200
