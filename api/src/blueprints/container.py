from src import socketio
from src.util.db import db, Container
from datetime import datetime
from src import socketio
from flask_socketio import emit
from flask import Blueprint, current_app, request, jsonify
import docker
import io
import re
import socket
from src.util.auth import *
import os
import subprocess

from src.util.query_utils import apply_filters
from src.util.policies import *
from src.util.permissions import *

docker_client = docker.from_env()

container_bp = Blueprint('container', __name__)


def normalize_container_name(name: str) -> str:
    """
    Normalizes the container name by:
    - Allowing only lowercase letters, numbers, dashes, underscores, and periods.
    - Removing any invalid characters and trimming leading/trailing special characters.
    """
    # Remove any character that is not alphanumeric, dash, underscore, or period
    name = re.sub(r'[^a-z0-9_.-]', '_', name.lower())
    
    # Remove leading/trailing dashes, underscores, and periods
    name = re.sub(r'^[_.-]+|[_.-]+$', '', name)
    
    return name


@container_bp.route('/containers', methods=['GET'])
def get_containers():
    try:
        # Get all containers from Docker including stopped ones
        docker_containers = docker_client.containers.list(all=True)
        
        containers_list = []
        for docker_container in docker_containers:
            # Get container from database
            container = Container.query.filter_by(
                docker_container_id=docker_container.id
            ).first()

            if container:
                containers_list.append({
                    'docker_container_id': container.docker_container_id,
                    'docker_container_name': container.docker_container_name,
                    'description': container.description,
                    'user_id': container.user_id,
                })

        return jsonify(containers_list), 200

    except Exception as e:
        current_app.logger.error(f"Error getting containers: {str(e)}")
        return jsonify({'error': str(e)}), 500

@container_bp.route('/containers', methods=['POST'])
@student_required
def create_container():
    data = request.get_json()
    
    # get a port number to give to the container    
    ports = {'5000/tcp': None, '22/tcp': None}
    if not data or not data.get('docker_image_id') or not data.get('user_id'):
        return jsonify({'error': 'Image ID and User ID are required'}), 400

    # Normalize container name
    container_name = data.get('container_name', f"container_{data['docker_image_id']}")
    container_name = normalize_container_name(container_name)
    
    # Check if the container name already exists
    existing_container = None
    try:
        existing_container = docker_client.containers.get(container_name)
    except docker.errors.NotFound:
        # No container found with that name
        pass
    
    if existing_container:
        return jsonify({'error': f'A container "{container_name}" already exists'}), 400
    
    try:
        container = docker_client.containers.run(
            data['docker_image_id'],
            detach=True,
            name=container_name,  # Use normalized container name

            # expose 5000 in the container as 'port' on the host
            ports=ports,
        )
        
        container_id = container.id
        user_id = data['user_id']



        public_key_path = os.path.join(current_app.config["BASE_KEY_PATH"], str(user_id), 'id_rsa.pub')
        if not os.path.exists(public_key_path):
            return jsonify({'error': 'Public key not found for user'}), 400
        
        # Create .ssh directory in container
        container_ssh_dir = "/root/.ssh"
        subprocess.run(["docker", "exec", container_id, "mkdir", "-p", container_ssh_dir], check=True)

        # Copy the public key into the container's authorized_keys
        subprocess.run(["docker", "cp", public_key_path, f"{container_id}:{container_ssh_dir}/authorized_keys"], check=True)

        # # Set the permissions of .ssh directory and authorized_keys file
        # subprocess.run(["docker", "exec", container_id, "chmod", "700", container_ssh_dir], check=True)
        # subprocess.run(["docker", "exec", container_id, "chmod", "600", f"{container_ssh_dir}/authorized_keys"], check=True)

        # # Start sshd in the container
        # subprocess.run(["docker", "exec", container_id, "/usr/sbin/sshd"], check=True)

        # Get the image tag
        image_tag = ""
        image = docker_client.images.get(data['docker_image_id'])
        image_tag = image.tags[0]

        # Set alt description
        alt_desc = f"Container running with image {data['docker_image_id']}"
        if image_tag != "":
            alt_desc = f"Container running with image {image_tag}"

        container_id = container.id
        ssh_keys = get_keys_path(data['user_id'])
        public_key_path = ssh_keys["public_key_path"]


        # Copy the key into Docker's authorized key file
        subprocess.run(["docker", "cp", public_key_path, f"{container_id}:{container_ssh_dir}/authorized_keys"], check=True)

        # Save container information to the database
        new_container = Container(
            docker_container_id=container.id,
            docker_container_name=container_name,  # Use normalized container name
            user_id=data['user_id'],
            description=data.get('description', alt_desc)
        )
        db.session.add(new_container)
        db.session.commit()

        container.reload()  # Refresh container attributes
        port_bindings = container.attrs['NetworkSettings']['Ports']
        assigned_ports = {}
        for container_port, bindings in port_bindings.items():
            if bindings:
                assigned_ports[container_port] = bindings[0]['HostPort']
            else:
                assigned_ports[container_port] = None

        return jsonify({'message': 'Container created and started successfully', 'ports': assigned_ports, 'docker_container_id': container.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@container_bp.route('/containers/search', methods=['GET'])
@login_required
def search_containers():
    user = db.session.get(User, current_user.user_id)
    filters = request.args.to_dict()
    try:
        query = apply_filters(Container, filters)  # Apply dynamic filters from the frontend
        filtered_query = apply_user_filters(user, 'containers', query)  # Apply ABAC filters
        containers = filtered_query.all()

        # Format the response
        containers_list = [{
            'docker_container_id': container.docker_container_id,
            'user_id': str(container.user_id),
            'docker_container_name': container.docker_container_name,
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
        # Normalize container name
        container_name = normalize_container_name(container_name)
        
        containers = docker_client.containers.list(all=True)  # Include stopped containers
        for container in containers:
            if f"/{container_name}" in container.attrs['Name'] or container_name in container.name:
                container = db.session.get(Container, container.id)
                if not container:
                    return jsonify({'error': 'Container not found'}), 404
                
                # it exists, get the port
                docker_container = docker_client.containers.get(container_name)
                port_bindings = docker_container.attrs['NetworkSettings']['Ports']
                assigned_ports = {}
                for container_port, bindings in port_bindings.items():
                    if bindings:
                        assigned_ports[container_port] = bindings[0]['HostPort']
                    else:
                        assigned_ports[container_port] = None

                status = docker_container.attrs['State']['Status']
                docker_image_id = docker_container.attrs['Config']['Image']

                port_mapping = docker_container.attrs['NetworkSettings']['Ports']
                
                return jsonify({
                    'message': 'container and port found', 
                    'ports': assigned_ports,
                    'status': status,
                    'docker_image_id': docker_image_id
                })

                return jsonify({'message': 'Container found'}), 200
    except docker.errors.NotFound:
        return jsonify({'error': 'Docker container not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete a container by ID (DELETE)
@container_bp.route('/containers/<string:container_id>', methods=['DELETE'])
@student_required
def delete_container(container_id):
    try:
        # Retrieve the container record from the database
        user = db.session.get(User, current_user.user_id)

        # Fetch the container with access control policies
        container = get_filtered_entity(
            user=user,
            entity_cls=Container,
            entity_id=container_id,
            filter_func=filter_containers,
            pk_attr='container_id'  # Specify primary key attribute if different
        )
        if container is None:
            return jsonify({'error': 'Access denied or container not found'}), 403
        # Retrieve the Docker container using its ID
        try:
            docker_container = docker_client.containers.get(container.docker_container_id)
            # Stop and remove the Docker container
            docker_container.stop()
            docker_container.remove()
        except docker.errors.NotFound:
            return jsonify({'error': 'Docker container not found'}), 404

        # Remove the container record from the database
        db.session.delete(container)
        db.session.commit()

        return jsonify({'message': 'Container deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def find_available_port(start_port: int, end_port: int) -> int:
    for port in range(start_port, end_port + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            # Check if the port is available
            if sock.connect_ex(('127.0.0.1', port)) != 0:
                return port
    raise RuntimeError(f"No available ports found in the range {start_port}-{end_port}")



@container_bp.route('/containers/<string:container_name>/start', methods=['PUT'])
@student_required
def start_container(container_name):
    try:
        # Normalize container name
        container_name = normalize_container_name(container_name)
        
        # Get the container using the Docker API
        docker_container = docker_client.containers.get(container_name)
        
        # Start the container if it's not running
        docker_container.start()

        return jsonify({'message': f'Container {container_name} started successfully'}), 200

    except docker.errors.NotFound:
        return jsonify({'error': f'Container {container_name} not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@container_bp.route('/containers/<string:container_name>/stop', methods=['PUT'])
@student_required
def stop_container(container_name):
    try:
        # Normalize container name
        container_name = normalize_container_name(container_name)
        
        # Get the container using the Docker API
        docker_container = docker_client.containers.get(container_name)
        docker_container.stop()

        return jsonify({'message': f'Container {container_name} stopped successfully'}), 200

    except docker.errors.NotFound:
        return jsonify({'error': f'Container {container_name} not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@container_bp.route('/containers/<string:container_name>/attach', methods=['GET'])
@student_required
def attach_container(container_name):
    try:
        # Normalize container name
        container_name = normalize_container_name(container_name)
        
        # Get the container using the Docker API
        docker_container = docker_client.containers.get(container_name)

        if docker_container.status != "running":
            return jsonify({'error': f'Container {container_name} is not running'}), 400

        # Attach to the container logs (real-time streaming)
        logs = docker_container.logs(stream=True, follow=True)
        log_output = ''.join([line.decode('utf-8') for line in logs])

        return jsonify({'logs': log_output}), 200

    except docker.errors.NotFound:
        return jsonify({'error': f'Container {container_name} not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_keys_path(user_id):
    key_dir = os.path.join(current_app.config["BASE_KEY_PATH"], str(user_id))
    private_key_path = os.path.join(key_dir, "id_rsa")
    public_key_path = os.path.join(key_dir, "id_rsa.pub")
    return {
        "private_key_path": private_key_path,
        "public_key_path": public_key_path
    }
