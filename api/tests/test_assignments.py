import pytest
from datetime import datetime

def test_create_update_delete_assignment(test_client, assignment_id):
    # Step 1: Update Assignment
    update_data = {
        'title': 'Updated Test Assignment',
        'description': 'This is an updated test assignment',
        'due_at': '2024-11-05T23:59:59'
    }
    update_response = test_client.put(f'/assignments/{assignment_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Assignment updated successfully' in update_response.data

    # Step 2: Get and Verify Updated Assignment
    get_response = test_client.get(f'/assignments/{assignment_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['title'] == 'Updated Test Assignment'
    assert json_data['description'] == 'This is an updated test assignment'

    # Parse the expected and actual 'due_at' values into datetime objects
    expected_due_at = datetime.strptime('2024-11-05T23:59:59', '%Y-%m-%dT%H:%M:%S')
    returned_due_at = datetime.strptime(json_data['due_at'], '%a, %d %b %Y %H:%M:%S GMT')

    # Compare the datetime objects
    assert expected_due_at == returned_due_at

    # Step 3: Delete Assignment
    delete_response = test_client.delete(f'/assignments/{assignment_id}')
    assert delete_response.status_code == 200
    assert b'Assignment deleted successfully' in delete_response.data

    # Step 4: Verify Deletion
    verified_delete_response = test_client.get(f'/assignments/{assignment_id}')
    assert verified_delete_response.status_code == 404
