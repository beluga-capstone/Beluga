import pytest
from uuid import uuid4
from unittest.mock import patch, Mock
from src.util.db import db

@patch('src.blueprints.container.find_available_port')
@patch('src.blueprints.container.docker_client')
def test_create_update_delete_container(mock_docker_client, mock_find_available_port, test_client, user_id):
    # Mock find_available_port to return a specific port
    mock_find_available_port.return_value = 12345

    # Setup mock Docker container
    mock_container = Mock()
    mock_container.id = 'mock_container_id'
    mock_container.name = 'mock_container_name'
    mock_container.attrs = {
        'Name': '/mock_container_name',
        'NetworkSettings': {
            'Ports': {
                '5000/tcp': [{'HostPort': '12345'}]
            }
        }
    }

    # Mock Docker client methods
    mock_docker_client.containers.run.return_value = mock_container
    mock_docker_client.containers.list.return_value = [mock_container]
    mock_docker_client.containers.get.return_value = mock_container

    # Step 1: Create Container
    create_data = {
        'docker_image_id': 'mock_image_id',
        'user_id': str(user_id),
        'container_name': 'mock_container_name',
        'description': 'This is a test container'
    }
    create_response = test_client.post('/containers', json=create_data)
    assert create_response.status_code == 201, f"Error: {create_response.get_json().get('error')}"
    assert b'Container created and started successfully' in create_response.data
    json_data = create_response.get_json()
    assert json_data['port'] == 12345

    # Step 2: Update Container
    update_data = {
        'description': 'Updated test container description'
    }
    update_response = test_client.put(f'/containers/{mock_container.id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Container updated successfully' in update_response.data

    # Step 3: Get and Verify Updated Container
    get_response = test_client.get(f'/containers/{mock_container.name}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['port'] == '12345'

    # Verify the description was updated in the database
    with test_client.application.app_context():
        from src.util.db import Container
        container_in_db = db.session.get(Container, mock_container.id)  
        assert container_in_db.description == 'Updated test container description'

    # Step 4: Delete Container
    delete_response = test_client.delete(f'/containers/{mock_container.name}')
    assert delete_response.status_code == 200
    assert b'Container deleted successfully' in delete_response.data

    # Step 5: Verify Deletion
    verified_delete_response = test_client.get(f'/containers/{mock_container.name}')
    assert verified_delete_response.status_code == 404

    # Ensure the container is removed from the database
    with test_client.application.app_context():
        container_in_db = db.session.get(Container, mock_container.id)
        assert container_in_db is None

def test_create_container_missing_fields(test_client):
    data = {}
    response = test_client.post('/containers', json=data)
    assert response.status_code == 400
    assert b'Image ID and User ID are required' in response.data

@patch('src.blueprints.container.find_available_port')
@patch('src.blueprints.container.docker_client')
def test_search_containers(mock_docker_client, mock_find_available_port, test_client, user_id):
    # Mock find_available_port to return a specific port
    mock_find_available_port.return_value = 12345

    # Setup mock Docker container
    mock_container = Mock()
    mock_container.id = 'mock_container_id'
    mock_container.name = 'mock_container_name'
    mock_container.attrs = {
        'Name': '/mock_container_name',
        'NetworkSettings': {
            'Ports': {
                '5000/tcp': [{'HostPort': '12345'}]
            }
        }
    }

    # Mock Docker client methods
    mock_docker_client.containers.run.return_value = mock_container
    mock_docker_client.containers.list.return_value = [mock_container]
    mock_docker_client.containers.get.return_value = mock_container

    # Create a container to search for
    create_data = {
        'docker_image_id': 'mock_image_id',
        'user_id': str(user_id),
        'container_name': 'mock_container_name',
        'description': 'This is a test container'
    }
    create_response = test_client.post('/containers', json=create_data)
    assert create_response.status_code == 201

    # Search by user_id
    response = test_client.get(f'/containers/search?user_id={user_id}')
    assert response.status_code == 200
    json_data = response.get_json()
    assert any(container['user_id'] == str(user_id) for container in json_data)

    # Search by docker_container_id
    response = test_client.get(f'/containers/search?docker_container_id={mock_container.id}')
    assert response.status_code == 200
    json_data = response.get_json()
    assert any(container['docker_container_id'] == mock_container.id for container in json_data)

    # Search with non-matching criteria
    response = test_client.get('/containers/search?description=NonExistentContainer')
    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data) == 0