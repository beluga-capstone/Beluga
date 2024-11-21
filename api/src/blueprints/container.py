from src import socketio
from src.util.db import db, Container
from flask_socketio import emit
from flask import Blueprint, current_app, request, jsonify
import docker
import io
import socket
from flask import current_app
import requests

docker_client = docker.from_env()

container_bp = Blueprint('container', __name__)

# Create and start a new container (POST)
@container_bp.route('/containers', methods=['POST'])
def create_container():
    data = request.get_json()
    
    # get a port number to give to the container
    port = find_available_port(current_app.config["CONTAINER_START_PORT"], current_app.config["CONTAINER_END_PORT"])

    registry_ip = current_app.config['REGISTRY_IP']
    registry_port = current_app.config['REGISTRY_PORT']

    if not data or not data.get('docker_image_id') or not data.get('user_id'):
        return jsonify({'error': 'Image ID and User ID are required'}), 400
    
    try:
        api_client = docker.APIClient()
        # # Get the tag
        image_id = data['docker_image_id']
        image_tag = find_image_tag_from_registry(image_id)
        # image_tag_registry = f"{registry_ip}:{registry_port}/{image_tag}"
        image_tag_registry = image_tag
        #print('image_tag_registry:', image_tag_registry)
        container = docker_client.containers.run(
            #data['docker_image_id'],
            image_tag_registry,
            detach=True,
            name=data.get('container_name', f"container_{data['docker_image_id']}"),

            # expose 5000 in the container as 'port' on the host
            ports={'5000/tcp':port},
        )

        # Create the container
        # container = api_client.create_container(
        #     image=image_tag_registry,
        #     name=data.get('container_name', f"container_{data['docker_image_id']}"),
        #     ports=[5000],
        #     host_config=api_client.create_host_config(
        #         port_bindings={5000: port}
        #     ),
        # )
        # api_client.start(container=container['Id'])

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


# Get a container
@container_bp.route('/containers/<string:container_name>', methods=['GET'])
def get_container(container_name):
    try:
        # get the container id from the name
        containers = docker_client.containers.list(all=True)  # Include stopped containers
        for container in containers:
            if f"/{container_name}" in container.attrs['Name'] or container_name in container.name:
                container = Container.query.get(container.id)
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
def delete_container(container_name):
    try:
        # get the container id from the name
        containers = docker_client.containers.list(all=True)  # Include stopped containers
        for container in containers:
            if f"/{container_name}" in container.attrs['Name'] or container_name in container.name:
                container = Container.query.get(container.id)
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


def find_image_tag_from_registry(image_id):
    #print('find_image_tag_from_registry')
    registry_ip = current_app.config['REGISTRY_IP']
    registry_port = current_app.config['REGISTRY_PORT']

    registry_url = f"http://{registry_ip}:{registry_port}/v2"
    headers = {"Accept": "application/vnd.docker.distribution.manifest.v2+json"}

    try:
        repos_url = f"{registry_url}/_catalog"
        res = requests.get(repos_url)
        res.raise_for_status()
        repositories = res.json().get("repositories", [])

        for repo in repositories:
            #print('repo:', repo)
            tags_url = f"{registry_url}/{repo}/tags/list"
            tags_res = requests.get(tags_url)
            tags_res.raise_for_status()
            tags = tags_res.json().get("tags", [])

            for tag in tags:
                manifest_url = f"{registry_url}/{repo}/manifests/{tag}"
                manifest_response = requests.get(manifest_url, headers=headers)
                manifest_response.raise_for_status()
                manifest = manifest_response.json()

                if "config" in manifest and manifest["config"]["digest"].endswith(image_id):
                    return f"{registry_ip}:{registry_port}/{repo}:{tag}"

        return "Image tag not found from ID on registry"

    except Exception as e:
        return f"Error tag from id in registry: {str(e)}"