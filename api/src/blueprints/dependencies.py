# src/blueprints/dependencies.py
from flask import Blueprint, request, jsonify
from src.util.db import db, Image, PackageDependency
from datetime import datetime

dependencies_bp = Blueprint('dependencies', __name__)

# Add a dependency to an image (POST)
@dependencies_bp.route('/images/<int:image_id>/dependencies', methods=['POST'])
def add_dependency(image_id):
    data = request.get_json()
    image = Image.query.get_or_404(image_id)
    if not data or not data.get('name') or not data.get('version'):
        return jsonify({'error': 'Name and version are required for a dependency'}), 400

    new_dependency = PackageDependency(
        name=data['name'],
        version=data['version'],
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
@dependencies_bp.route('/images/<int:image_id>/dependencies/<int:dependency_id>', methods=['DELETE'])
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

# Update a dependency (PUT)
@dependencies_bp.route('/images/<int:image_id>/dependencies/<int:dependency_id>', methods=['PUT'])
def update_dependency(image_id, dependency_id):
    data = request.get_json()
    dependency = PackageDependency.query.get_or_404(dependency_id)
    if dependency.image_id != image_id:
        return jsonify({'error': 'Dependency does not belong to this image'}), 400
    dependency.name = data.get('name', dependency.name)
    dependency.version = data.get('version', dependency.version)
    dependency.installed_at = datetime.now()
    try:
        db.session.commit()
        return jsonify({'message': 'Dependency updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all dependencies for a specific image (GET)
@dependencies_bp.route('/images/<int:image_id>/dependencies', methods=['GET'])
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
