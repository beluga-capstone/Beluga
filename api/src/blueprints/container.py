from flask import Blueprint, request, jsonify
from src.util.db import db, Container
from datetime import datetime

container_bp = Blueprint('container', __name__)

# Create a new container (POST)
@container_bp.route('/containers', methods=['POST'])
def create_container():
    data = request.get_json()

    new_container = Container(
        user_id=data['user_id'],
        status=data.get('status'),
        cpu_usage=data.get('cpu_usage'),
        memory_usage=data.get('memory_usage'),
        create_date=data.get('create_date', datetime.now()),
        last_modify=data.get('last_modify'),
        image_id=data.get('image_id')
    )

    try:
        db.session.add(new_container)
        db.session.commit()
        return jsonify({'message': 'Container created successfully', 'container_id': new_container.container_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all containers (GET)
@container_bp.route('/containers', methods=['GET'])
def get_containers():
    containers = Container.query.all()
    containers_list = [{
        'container_id': container.container_id,
        'user_id': container.user_id,
        'status': container.status,
        'cpu_usage': container.cpu_usage,
        'memory_usage': container.memory_usage,
        'create_date': container.create_date,
        'last_modify': container.last_modify,
        'image_id': container.image_id
    } for container in containers]

    return jsonify(containers_list), 200

# Get a specific container (GET)
@container_bp.route('/containers/<int:container_id>', methods=['GET'])
def get_container(container_id):
    container = Container.query.get_or_404(container_id)

    return jsonify({
        'container_id': container.container_id,
        'user_id': container.user_id,
        'status': container.status,
        'cpu_usage': container.cpu_usage,
        'memory_usage': container.memory_usage,
        'create_date': container.create_date,
        'last_modify': container.last_modify,
        'image_id': container.image_id
    }), 200

# Update a container (PUT)
@container_bp.route('/containers/<int:container_id>', methods=['PUT'])
def update_container(container_id):
    container = Container.query.get_or_404(container_id)
    data = request.get_json()

    container.user_id = data.get('user_id', container.user_id)
    container.status = data.get('status', container.status)
    container.cpu_usage = data.get('cpu_usage', container.cpu_usage)
    container.memory_usage = data.get('memory_usage', container.memory_usage)
    container.last_modify = data.get('last_modify', container.last_modify)
    container.image_id = data.get('image_id', container.image_id)

    try:
        db.session.commit()
        return jsonify({'message': 'Container updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a container (DELETE)
@container_bp.route('/containers/<int:container_id>', methods=['DELETE'])
def delete_container(container_id):
    container = Container.query.get_or_404(container_id)

    try:
        db.session.delete(container)
        db.session.commit()
        return jsonify({'message': 'Container deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
