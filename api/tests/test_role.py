import pytest

def test_create_update_delete_role(test_client, role_id):
    # Step 1: Update the Role
    update_data = {
        'name': 'Super Admin',
        'permission': 'all_access',
        'description': 'Super Admin role with all access'
    }
    update_response = test_client.put(f'/roles/{role_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Role updated successfully' in update_response.data

    # Step 2: Get and Verify the Updated Role
    get_response = test_client.get(f'/roles/{role_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['name'] == 'Super Admin'
    assert json_data['permission'] == 'all_access'
    assert json_data['description'] == 'Super Admin role with all access'

    # Step 3: Delete the Role
    delete_response = test_client.delete(f'/roles/{role_id}')
    assert delete_response.status_code == 200
    assert b'Role deleted successfully' in delete_response.data

    # Step 4: Verify the Role Deletion
    verified_delete_response = test_client.get(f'/roles/{role_id}')
    assert verified_delete_response.status_code == 404
