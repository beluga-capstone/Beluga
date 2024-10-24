import pytest

@pytest.fixture
def role_id(test_client):
    create_data = {
        'name': 'Admin2',
        'permission': 'full_access',
        'description': 'Administrator role with full access',
        'user_create': 1
    }
    response = test_client.post('/roles', json=create_data)
    assert response.status_code == 201
    assert b'Role created successfully' in response.data
    return response.get_json()['role_id']

def test_update_role(test_client, role_id):
    update_data = {
        'name': 'Super Admin',
        'permission': 'all_access',
        'description': 'Super Admin role with all access'
    }
    update_response = test_client.put(f'/roles/{role_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Role updated successfully' in update_response.data

def test_get_role(test_client, role_id):
    get_response = test_client.get(f'/roles/{role_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['name'] == 'Super Admin'
    assert json_data['permission'] == 'all_access'
    assert json_data['description'] == 'Super Admin role with all access'

def test_delete_role(test_client, role_id):
    delete_response = test_client.delete(f'/roles/{role_id}')
    assert delete_response.status_code == 200
    assert b'Role deleted successfully' in delete_response.data

    verified_delete_response = test_client.get(f'/roles/{role_id}')
    assert verified_delete_response.status_code == 404

def test_create_update_delete_role(test_client):
    role_id_value = role_id(test_client)
    test_update_role(test_client, role_id_value)
    test_get_role(test_client, role_id_value)
    test_delete_role(test_client, role_id_value)
