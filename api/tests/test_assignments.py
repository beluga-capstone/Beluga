
def test_create_update_delete_assignment(test_client):
    # Create Assignment
    create_data = {
        'course_id': 1,
        'title': 'Test Assignment',
        'description': 'This is a test assignment',
        'due_at': '2024-10-31T23:59:59',
        'lock_at': '2024-10-31T23:59:59',
        'unlock_at': '2024-10-01T00:00:00',
        'user_create': 'admin',
        'image_id': 5
    }
    response = test_client.post('/assignments', json=create_data)
    assert response.status_code == 201
    assert b'Assignment created successfully' in response.data

    assignment_id = response.get_json()['assignment_id']

    # Update Assignment
    update_data = {
        'title': 'Updated Test Assignment',
        'description': 'This is an updated test assignment',
        'due_at': '2024-11-05T23:59:59'
    }
    update_response = test_client.put(f'/assignments/{assignment_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Assignment updated successfully' in update_response.data

    # Get the updated data
    get_response = test_client.get(f'/assignments/{assignment_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['title'] == 'Updated Test Assignment'
    assert json_data['description'] == 'This is an updated test assignment'
    assert json_data['due_at'] == '2024-11-05T23:59:59'

    # Delete Assignment
    delete_response = test_client.delete(f'/assignments/{assignment_id}')
    assert delete_response.status_code == 200
    assert b'Assignment deleted successfully' in delete_response.data

    # Verified deleted
    verfified_delete_response = test_client.get(f'/assignments/{assignment_id}')
    assert verfified_delete_response.status_code == 404
