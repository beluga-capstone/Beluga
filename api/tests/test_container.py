import pytest

@pytest.fixture
def container_id(test_client):
    create_data = {
        'user_id': 1,
        'status': 'running',
        'cpu_usage': 30.5,
        'memory_usage': 1024,
        'create_date': '2024-10-20T10:00:00',
        'last_modify': '2024-10-20T12:00:00',
        'image_id': 2
    }
    response = test_client.post('/containers', json=create_data)
    assert response.status_code == 201
    assert b'Container created successfully' in response.data
    return response.get_json()['container_id']

def test_update_container(test_client, container_id):
    update_data = {
        'status': 'stopped',
        'cpu_usage': 20.0,
        'memory_usage': 512
    }
    update_response = test_client.put(f'/containers/{container_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Container updated successfully' in update_response.data

def test_get_container(test_client, container_id):
    get_response = test_client.get(f'/containers/{container_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['status'] == 'stopped'
    assert json_data['cpu_usage'] == 20.0
    assert json_data['memory_usage'] == 512

def test_delete_container(test_client, container_id):
    delete_response = test_client.delete(f'/containers/{container_id}')
    assert delete_response.status_code == 200
    assert b'Container deleted successfully' in delete_response.data

    verified_delete_response = test_client.get(f'/containers/{container_id}')
    assert verified_delete_response.status_code == 404

def test_create_update_delete_container(test_client):
    container_id_value = container_id(test_client)
    test_update_container(test_client, container_id_value)
    test_get_container(test_client, container_id_value)
    test_delete_container(test_client, container_id_value)
