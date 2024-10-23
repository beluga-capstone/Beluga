from flask import Blueprint, request, jsonify
from src.util.db import db, Container
from datetime import datetime

container_bp = Blueprint('container', __name__)

# Create a new container (POST)
@container_bp.route('/containers', methods=['POST'])
def create_container():
    data = request.get_json()

    new_container = Container(
        docker_container_id=data['docker_container_id'],
        user_id=data['user_id'],
        description=data.get('description')
    )

    try:
        db.session.add(new_container)
        db.session.commit()
        return jsonify({'message': 'Container created successfully', 'docker_container_id': new_container.docker_container_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all containers (GET)
@container_bp.route('/containers', methods=['GET'])
def get_containers():
    containers = Container.query.all()
    containers_list = [{
        'docker_container_id': container.docker_container_id,
        'user_id': container.user_id,
        'description': container.description
    } for container in containers]

    return jsonify(containers_list), 200

# Get a specific container (GET)
@container_bp.route('/containers/<string:docker_container_id>', methods=['GET'])
def get_container(docker_container_id):
    container = Container.query.get_or_404(docker_container_id)

    return jsonify({
        'docker_container_id': container.docker_container_id,
        'user_id': container.user_id,
        'description': container.description
    }), 200

# Update a container (PUT)
@container_bp.route('/containers/<string:docker_container_id>', methods=['PUT'])
def update_container(docker_container_id):
    container = Container.query.get_or_404(docker_container_id)
    data = request.get_json()

    container.user_id = data.get('user_id', container.user_id)
    container.description = data.get('description', container.description)

    try:
        db.session.commit()
        return jsonify({'message': 'Container updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a container (DELETE)
@container_bp.route('/containers/<string:docker_container_id>', methods=['DELETE'])
def delete_container(docker_container_id):
    container = Container.query.get_or_404(docker_container_id)

    try:
        db.session.delete(container)
        db.session.commit()
        return jsonify({'message': 'Container deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
