def test_create_update_delete_role(test_client):
    # Create Role
    create_data = {
        'name': 'Admin',
        'permission': 'full_access',
        'description': 'Administrator role with full access',
        'user_create': 1
    }
    response = test_client.post('/roles', json=create_data)
    assert response.status_code == 201
    assert b'Role created successfully' in response.data

    role_id = response.get_json()['role_id']

    # Update Role
    update_data = {
        'name': 'Super Admin',
        'permission': 'all_access',
        'description': 'Super Admin role with all access'
    }
    update_response = test_client.put(f'/roles/{role_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Role updated successfully' in update_response.data

    # Get the updated role
    get_response = test_client.get(f'/roles/{role_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['name'] == 'Super Admin'
    assert json_data['permission'] == 'all_access'
    assert json_data['description'] == 'Super Admin role with all access'

    # Delete Role
    delete_response = test_client.delete(f'/roles/{role_id}')
    assert delete_response.status_code == 200
    assert b'Role deleted successfully' in delete_response.data

    # Verified deleted
    verfified_delete_response = test_client.get(f'/roles/{role_id}')
    assert verfified_delete_response.status_code == 404
