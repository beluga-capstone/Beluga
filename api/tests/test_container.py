import pytest

def test_create_update_delete_container(test_client, container_id):
    # Step 1: Update Container
    update_data = {
        'status': 'stopped',
        'cpu_usage': 20.0,
        'memory_usage': 512
    }
    update_response = test_client.put(f'/containers/{container_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Container updated successfully' in update_response.data

    # Step 2: Get and Verify Updated Container
    get_response = test_client.get(f'/containers/{container_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['status'] == 'stopped'
    assert json_data['cpu_usage'] == 20.0
    assert json_data['memory_usage'] == 512

    # Step 3: Delete Container
    delete_response = test_client.delete(f'/containers/{container_id}')
    assert delete_response.status_code == 200
    assert b'Container deleted successfully' in delete_response.data

    # Step 4: Verify Deletion
    verified_delete_response = test_client.get(f'/containers/{container_id}')
    assert verified_delete_response.status_code == 404
