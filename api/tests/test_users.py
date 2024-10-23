def test_create_update_delete_user(test_client):
    # Create User
    create_data = {
        'username': 'testuser',
        'email': 'testuser@tamu.edu'
    }
    response = test_client.post('/users', json=create_data)
    assert response.status_code == 201
    assert b'User created successfully' in response.data

    user_id = response.get_json()['id']

    # Update User
    update_data = {
        'username': 'updateduser',
        'email': 'updateduser@tamu.edu',
        'first_name': 'Joe',
        'last_name': 'Mama'
    }
    update_response = test_client.put(f'/users/{user_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'User updated successfully' in update_response.data

    # Get the updated data
    get_response = test_client.get(f'/users/{user_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['username'] == 'updateduser'
    assert json_data['email'] == 'updateduser@tamu.edu'
    assert json_data['first_name'] == 'Joe'
    assert json_data['last_name'] == 'Mama'

    # Delete User
    delete_response = test_client.delete(f'/users/{user_id}')
    assert delete_response.status_code == 200
    assert b'User deleted successfully' in delete_response.data

    # Verified deleted
    verfified_delete_response = test_client.get(f'/users/{user_id}')
    assert verfified_delete_response.status_code == 404





'''
def test_create_user_missing_fields(test_client):
    data = {}
    response = test_client.post('/users', json=data)
    assert response.status_code == 400
    assert b'Username and email are required' in response.data
'''