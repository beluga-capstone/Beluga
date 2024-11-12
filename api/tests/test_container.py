import pytest
from uuid import uuid4

def test_create_update_delete_container(test_client, container_id):
    # Step 1: Update Container
    update_data = {
        'description': 'Updated test container description'
    }
    update_response = test_client.put(f'/containers/{container_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Container updated successfully' in update_response.data

    # Step 2: Get and Verify Updated Container
    get_response = test_client.get(f'/containers/{container_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['description'] == 'Updated test container description'

    # Step 3: Delete Container
    delete_response = test_client.delete(f'/containers/{container_id}')
    assert delete_response.status_code == 200
    assert b'Container deleted successfully' in delete_response.data

    # Step 4: Verify Deletion
    verified_delete_response = test_client.get(f'/containers/{container_id}')
    assert verified_delete_response.status_code == 404

def test_create_container_missing_fields(test_client):
    data = {}
    response = test_client.post('/containers', json=data)
    assert response.status_code == 400
    assert b'Docker Container ID and User ID are required' in response.data