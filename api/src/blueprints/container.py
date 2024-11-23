from src import socketio
from src.util.db import db, Container
from datetime import datetime
from src import socketio
from src.util.query_utils import apply_filters
from flask_socketio import emit
from flask import Blueprint, current_app, request, jsonify
import docker
import io
import socket
from src.util.auth import *


docker_client = docker.from_env()

container_bp = Blueprint('container', __name__)

# Create and start a new container (POST)
@container_bp.route('/containers', methods=['POST'])
@student_required
def create_container():
    data = request.get_json()
    
    # get a port number to give to the container
    port = find_available_port(current_app.config["CONTAINER_START_PORT"], current_app.config["CONTAINER_END_PORT"])
    
    if not data or not data.get('docker_image_id') or not data.get('user_id'):
        return jsonify({'error': 'Image ID and User ID are required'}), 400
    
    try:
        container = docker_client.containers.run(
            data['docker_image_id'],
            detach=True,
            name=data.get('container_name', f"container_{data['docker_image_id']}"),

            # expose 5000 in the container as 'port' on the host
            ports={'5000/tcp':port},
        )

        # Save container information to the database
        new_container = Container(
            docker_container_id=container.id,
            user_id=data['user_id'],
            description=data.get('description', f"Container running with image {data['docker_image_id']}")

        )
        db.session.add(new_container)
        db.session.commit()

        return jsonify({'message': 'Container created and started successfully', 'port':port}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all containers (GET)
@container_bp.route('/containers', methods=['GET'])
@admin_required
def get_containers():
    containers = db.session.scalars(db.select(Container)).all()
    containers_list = [{
        'docker_container_id': container.docker_container_id,
        'user_id': str(container.user_id),
        'description': container.description
    } for container in containers]

    return jsonify(containers_list), 200

# Dynamic search for containers (GET)
@container_bp.route('/containers/search', methods=['GET'])
@login_required
def search_containers():
    filters = request.args.to_dict()  # Get all query parameters as filters

    try:
        # Dynamically apply filters using the helper function `apply_filters`
        query = apply_filters(Container, filters)
        containers = query.all()

        # Format the response
        containers_list = [{
            'docker_container_id': container.docker_container_id,
            'user_id': str(container.user_id),
            'description': container.description
        } for container in containers]

        return jsonify(containers_list), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Update a container (PUT)
@container_bp.route('/containers/<string:docker_container_id>', methods=['PUT'])
@admin_required
def update_container(docker_container_id):
    container = db.session.get(Container, docker_container_id)
    if container is None:
        return jsonify({'error': 'Container not found'}), 404

    data = request.get_json()
    container.user_id = data.get('user_id', container.user_id)
    container.description = data.get('description', container.description)
    
    try:
        db.session.commit()  # Persist changes
        return jsonify({'message': 'Container updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Get a container
@container_bp.route('/containers/<string:container_name>', methods=['GET'])
@student_required
def get_container(container_name):
    try:
        # get the container id from the name
        containers = docker_client.containers.list(all=True)  # Include stopped containers
        for container in containers:
            if f"/{container_name}" in container.attrs['Name'] or container_name in container.name:
                container = db.session.get(Container, container.id)
                if not container:
                    return jsonify({'error': 'Container not found'}), 404
                
                # it exists, get the port 
                docker_container = docker_client.containers.get(container_name)
                port_mapping = docker_container.attrs['NetworkSettings']['Ports']
                for container_port, host_ports in port_mapping.items():
                    if host_ports: 
                        return jsonify({
                            'message': 'container and port found', 
                            'port':f"{host_ports[0]['HostPort']}"
                        })
                    else:
                        return jsonify({
                            'message': "container found but not port"
                        })

                return jsonify({'message': 'Container found'}), 200
    except docker.errors.NotFound:
        return jsonify({'error': 'Docker container not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Delete a container (DELETE)
@container_bp.route('/containers/<string:container_name>', methods=['DELETE'])
@student_required
def delete_container(container_name):
    try:
        # get the container id from the name
        containers = docker_client.containers.list(all=True)  # Include stopped containers
        for container in containers:
            if f"/{container_name}" in container.attrs['Name'] or container_name in container.name:
                container = db.session.get(Container, container.id)
                if not container:
                    return jsonify({'error': 'Container not found'}), 404

                # Stop and remove the Docker container
                docker_container = docker_client.containers.get(container.docker_container_id)
                docker_container.stop()
                docker_container.remove()

                # Remove from the database
                db.session.delete(container)
                db.session.commit()

                return jsonify({'message': 'Container deleted successfully'}), 200
    except docker.errors.NotFound:
        return jsonify({'error': 'Docker container not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def find_available_port(start_port: int, end_port: int) -> int:
    for port in range(start_port, end_port + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            # Check if the port is available
            if sock.connect_ex(('127.0.0.1', port)) != 0:
                return port
    raise RuntimeError(f"No available ports found in the range {start_port}-{end_port}")

