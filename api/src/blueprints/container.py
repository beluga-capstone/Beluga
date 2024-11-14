#from flask import Blueprint, request, jsonify
#from src.util.db import db, Container
#
#container_bp = Blueprint('container', __name__)
#
## Create a new container (POST)
#@container_bp.route('/containers', methods=['POST'])
#def create_container():
#    data = request.get_json()
#
#    if not data or not data.get('docker_container_id') or not data.get('user_id'):
#        return jsonify({'error': 'Docker Container ID and User ID are required'}), 400
#
#    new_container = Container(
#        docker_container_id=data['docker_container_id'],
#        user_id=data['user_id'],
#        description=data.get('description')
#    )
#
#    try:
#        db.session.add(new_container)
#        db.session.commit()
#        return jsonify({'message': 'Container created successfully', 'docker_container_id': new_container.docker_container_id}), 201
#    except Exception as e:
#        db.session.rollback()
#        return jsonify({'error': str(e)}), 500
#
## Get all containers (GET)
#@container_bp.route('/containers', methods=['GET'])
#def get_containers():
#    containers = db.session.scalars(db.select(Container)).all()
#    containers_list = [{
#        'docker_container_id': container.docker_container_id,
#        'user_id': str(container.user_id),
#        'description': container.description
#    } for container in containers]
#
#    return jsonify(containers_list), 200
#
## Get a specific container (GET)
#@container_bp.route('/containers/<string:docker_container_id>', methods=['GET'])
#def get_container(docker_container_id):
#    container = db.session.get(Container, docker_container_id)
#    if container is None:
#        return jsonify({'error': 'Container not found'}), 404
#
#    return jsonify({
#        'docker_container_id': container.docker_container_id,
#        'user_id': str(container.user_id),
#        'description': container.description
#    }), 200
#
## Update a container (PUT)
#@container_bp.route('/containers/<string:docker_container_id>', methods=['PUT'])
#def update_container(docker_container_id):
#    container = db.session.get(Container, docker_container_id)
#    if container is None:
#        return jsonify({'error': 'Container not found'}), 404
#
#    data = request.get_json()
#    container.user_id = data.get('user_id', container.user_id)
#    container.description = data.get('description', container.description)
#
#    try:
#        db.session.commit()
#        return jsonify({'message': 'Container updated successfully'}), 200
#    except Exception as e:
#        db.session.rollback()
#        return jsonify({'error': str(e)}), 500
#
## Delete a container (DELETE)
#@container_bp.route('/containers/<string:docker_container_id>', methods=['DELETE'])
#def delete_container(docker_container_id):
#    container = db.session.get(Container, docker_container_id)
#    if container is None:
#        return jsonify({'error': 'Container not found'}), 404
#
#    try:
#        db.session.delete(container)
#        db.session.commit()
#        return jsonify({'message': 'Container deleted successfully'}), 200
#    except Exception as e:
#        db.session.rollback()
#        return jsonify({'error': str(e)}), 500

from flask import Blueprint, request, jsonify
from src import socketio
from src.util.db import db, Container
from flask_socketio import emit
import docker
import io

docker_client = docker.from_env()

container_bp = Blueprint('container', __name__)

# Create and start a new container (POST)
@container_bp.route('/containers', methods=['POST'])
def create_container():
    data = request.get_json()
    
    if not data or not data.get('imageId') or not data.get('userId'):
        return jsonify({'error': 'Image ID and User ID are required'}), 400
    
    try:
        container = docker_client.containers.run(
            data['imageId'],
            detach=True,
            name=data.get('containerName', f"container_{data['imageId']}"),
            ports=data.get('ports', {})
        )

        # Save container information to the database
        new_container = Container(
            docker_container_id=container.id,
            user_id=data['userId'],
            description=data.get('description', f"Container running with image {data['imageId']}")
        )
        db.session.add(new_container)
        db.session.commit()

        return jsonify({'message': 'Container created and started successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all containers (GET)
@container_bp.route('/containers', methods=['GET'])
def get_containers():
    containers = db.session.scalars(db.select(Container)).all()
    containers_list = [{
        'docker_container_id': container.docker_container_id,
        'user_id': str(container.user_id),
        'description': container.description
    } for container in containers]
    return jsonify(containers_list), 200

# Get a specific container (GET)
@container_bp.route('/containers/<string:docker_container_id>', methods=['GET'])
def get_container(docker_container_id):
    container = db.session.get(Container, docker_container_id)
    if container is None:
        return jsonify({'error': 'Container not found'}), 404

    try:
        docker_container = docker_client.containers.get(docker_container_id)
        return jsonify({
            'docker_container_id': container.docker_container_id,
            'user_id': str(container.user_id),
            'description': container.description,
            'status': docker_container.status
        }), 200
    except docker.errors.NotFound:
        return jsonify({'error': 'Docker container not found'}), 404

# Update a container (PUT)
@container_bp.route('/containers/<string:docker_container_id>', methods=['PUT'])
def update_container(docker_container_id):
    container = db.session.get(Container, docker_container_id)
    if container is None:
        return jsonify({'error': 'Container not found'}), 404

    data = request.get_json()
    container.description = data.get('description', container.description)

    try:
        db.session.commit()
        return jsonify({'message': 'Container updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Stop and delete a container (DELETE)
@container_bp.route('/containers/<string:docker_container_id>', methods=['DELETE'])
def delete_container(docker_container_id):
    container = db.session.get(Container, docker_container_id)
    if container is None:
        return jsonify({'error': 'Container not found'}), 404

    try:
        docker_container = docker_client.containers.get(docker_container_id)
        docker_container.stop()
        docker_container.remove()
        
        db.session.delete(container)
        db.session.commit()
        return jsonify({'message': 'Container stopped and deleted successfully'}), 200
    except docker.errors.NotFound:
        db.session.rollback()
        return jsonify({'error': 'Docker container not found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

