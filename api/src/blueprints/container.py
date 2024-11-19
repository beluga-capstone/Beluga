from flask import Blueprint, request, jsonify
from src.util.db import db, Container
from datetime import datetime
from flask_socketio import emit
from src import socketio
import docker
from flask import current_app
import io

container_bp = Blueprint('container', __name__)
registry_ip = current_app.config['REGISTRY_IP']
registry_port = current_app.config['REGISTRY_PORT']

# Create a new container (POST)
@container_bp.route('/containers', methods=['POST'])
def create_container():
    data = request.get_json()

    if not data or not data.get('docker_container_id') or not data.get('user_id'):
        return jsonify({'error': 'Docker Container ID and User ID are required'}), 400

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

# Define the Flask route to create and run a container
@container_bp.route('/containers/build_run', methods=['POST'])
def build_run_container():
    data = request.get_json()

    # Check for required parameters
    if not data or not data.get('docker_image_id') or not data.get('user_id'):
        return jsonify({'error': 'Docker Image ID and User ID are required'}), 400

    docker_image_id = data['docker_image_id']
    user_id = data['user_id']
    container_name = data.get('container_name', f'container_{docker_image_id[:12]}_{datetime.utcnow().isoformat()}')
    description = data.get('description', '')

    try:
        # Initialize Docker API client
        api_client = docker.APIClient()

        image_tag_registry = f"{registry_ip}:{registry_port}/{docker_image_id}"

        # Pull from registry -> api_client.pull(image_tag_registry)
        for log in api_client.pull(image_tag_registry):
            socketio.emit('container_pull', {'output': log})

        # Create and start the container with specified options
        container = api_client.create_container(
            #image=docker_image_id,
            image=image_tag_registry,
            name=container_name,
            detach=True,
            stdin_open=True,
            tty=True,
            # environment=data.get('environment', {}),
            # ports=data.get('ports', []),
            # host_config=api_client.create_host_config(
            #     port_bindings=data.get('port_bindings', {}),
            #     binds=data.get('binds', []),
            #     network_mode=data.get('network_mode', 'bridge')
            # )
        )

        # Start the container
        api_client.start(container=container.get('Id'))

        # Save container details to the database
        new_container = Container(
            docker_container_id=container.get('Id'),
            user_id=user_id,
            description=description,
        )
        db.session.add(new_container)
        db.session.commit()

        # Stream logs to the frontend via socket
        log_generator = api_client.logs(container=container.get('Id'), stream=True)
        for log in log_generator:
            socketio.emit('container_output', {'output': log.decode('utf-8')})

        # Notify the frontend of successful container start
        socketio.emit('container_started', {'docker_container_id': container.get('Id')})

        return jsonify({'message': 'Container started successfully', 'docker_container_id': container.get('Id')}), 201

    except Exception as e:
        db.session.rollback()
        socketio.emit('container_error', {'error': str(e)})
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

    return jsonify({
        'docker_container_id': container.docker_container_id,
        'user_id': str(container.user_id),
        'description': container.description
    }), 200

# Update a container (PUT)
@container_bp.route('/containers/<string:docker_container_id>', methods=['PUT'])
def update_container(docker_container_id):
    container = db.session.get(Container, docker_container_id)
    if container is None:
        return jsonify({'error': 'Container not found'}), 404

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
    container = db.session.get(Container, docker_container_id)
    if container is None:
        return jsonify({'error': 'Container not found'}), 404

    try:
        api_client = docker.APIClient()

        try:
            api_client.inspect_container(docker_container_id)
        except Exception as e:
            return jsonify({'error': f'Container {docker_container_id} not found, {e}'}), 404

        api_client.remove_container(docker_container_id, force=True)

        db.session.delete(container)
        db.session.commit()
        return jsonify({'message': 'Container deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Get all container and status for a user
@container_bp.route('/containers/user/<uuid:user_id>', methods=['GET'])
def get_containers_by_user(user_id):
    try:
        containers = db.session.query(Container).filter_by(user_id=user_id).all()

        if not containers:
            return jsonify({'error': 'No containers found for this user'}), 404

        api_client = docker.APIClient()

        containers_data = []
        for container in containers:
            try:
                container_info = api_client.inspect_container(container.docker_container_id)
                created = container_info.get('Created', '')
                state = container_info.get('State', '')
            except Exception:
                created = ''
                state = ''

            containers_data.append({
                'docker_container_id': container.docker_container_id,
                'description': container.description,
                'created': created,
                'state': state
            })

        return jsonify({'containers': containers_data}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run a container
@container_bp.route('/containers/run', methods=['POST'])
def run_container():
    try:
        data = request.get_json()

        if not data or not data.get('docker_container_id'):
            return jsonify({'error': 'Docker cotainer ID is required'}), 400

        docker_container_id = data['docker_container_id']

        api_client = docker.APIClient()
        try:
            container_info = api_client.inspect_container(docker_container_id)
            if not container_info['State']['Running']:
                api_client.start(docker_container_id)
                print(f"Container {docker_container_id} started.")
                return jsonify({'message': 'Container is started'}), 200
            else:
                print(f"Container {docker_container_id} is already running.")
                return jsonify({'info': 'Container is already running'}), 500
        except Exception as e:
            return jsonify({'info': 'Container cannot be located', 'error': str(e)}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Stop container
@container_bp.route('/containers/stop', methods=['POST'])
def stop_container():
    try:
        data = request.get_json()

        if not data or not data.get('docker_container_id'):
            return jsonify({'error': 'Docker cotainer ID is required'}), 400

        docker_container_id = data['docker_container_id']

        api_client = docker.APIClient()
        try:
            container_info = api_client.inspect_container(docker_container_id)
            if container_info['State']['Running']:
                api_client.stop(docker_container_id)
                print(f"Container {docker_container_id} stopped.")
                return jsonify({'message': 'Container is stopped'}), 200
            else:
                print(f"Container {docker_container_id} is not running.")
                return jsonify({'info': 'Container is not running'}), 500
        except Exception as e:
            return jsonify({'info': 'Container cannot be located', 'error': str(e)}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500
