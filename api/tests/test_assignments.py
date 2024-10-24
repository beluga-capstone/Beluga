import pytest

@pytest.fixture
def assignment_id(test_client):
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
    return response.get_json()['assignment_id']

def test_update_assignment(test_client, assignment_id):
    update_data = {
        'title': 'Updated Test Assignment',
        'description': 'This is an updated test assignment',
        'due_at': '2024-11-05T23:59:59'
    }
    update_response = test_client.put(f'/assignments/{assignment_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Assignment updated successfully' in update_response.data

def test_get_assignment(test_client, assignment_id):
    get_response = test_client.get(f'/assignments/{assignment_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['title'] == 'Updated Test Assignment'
    assert json_data['description'] == 'This is an updated test assignment'
    assert json_data['due_at'] == '2024-11-05T23:59:59'

def test_delete_assignment(test_client, assignment_id):
    delete_response = test_client.delete(f'/assignments/{assignment_id}')
    assert delete_response.status_code == 200
    assert b'Assignment deleted successfully' in delete_response.data

    # Verify deletion
    verified_delete_response = test_client.get(f'/assignments/{assignment_id}')
    assert verified_delete_response.status_code == 404

def test_create_update_delete_assignment(test_client):
    assignment_id_value = assignment_id(test_client)
    test_update_assignment(test_client, assignment_id_value)
    test_get_assignment(test_client, assignment_id_value)
    test_delete_assignment(test_client, assignment_id_value)
