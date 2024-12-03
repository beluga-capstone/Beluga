import pytest
from datetime import datetime

import pytest
from datetime import datetime

def test_create_update_delete_assignment(test_client, assignment_id, docker_image_id):
    # Step 1: Update Assignment
    update_data = {
        'title': 'Updated Test Assignment',
        'description': 'This is an updated test assignment',
        'due_at': '2024-11-05T23:59:59.000Z'  # Ensure correct date format
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
    expected_due_at = datetime.fromisoformat('2024-11-05T23:59:59')
    returned_due_at = datetime.fromisoformat(json_data['due_at'].replace('Z', ''))  # Strip 'Z' for parsing

    # Compare the datetime objects
    assert expected_due_at == returned_due_at

    # Step 3: Delete Assignment
    delete_response = test_client.delete(f'/assignments/{assignment_id}')
    assert delete_response.status_code == 200
    assert b'Assignment deleted successfully' in delete_response.data

    # Step 4: Verify Deletion
    verified_delete_response = test_client.get(f'/assignments/{assignment_id}')
    assert verified_delete_response.status_code == 404


def test_search_assignments(test_client, course_id, assignment_id, docker_image_id):
    # Search by course_id
    response = test_client.get(f'/assignments/search?course_id={course_id}')
    assert response.status_code == 200
    json_data = response.get_json()
    assert any(assignment['course_id'] == str(course_id) for assignment in json_data)

    # Search by assignment_id
    response = test_client.get(f'/assignments/search?assignment_id={assignment_id}')
    assert response.status_code == 200
    json_data = response.get_json()
    assert any(assignment['assignment_id'] == str(assignment_id) for assignment in json_data)

    # Search by docker_image_id
    response = test_client.get(f'/assignments/search?docker_image_id={docker_image_id}')
    assert response.status_code == 200
    json_data = response.get_json()
    assert any(assignment['docker_image_id'] == docker_image_id for assignment in json_data)

    # Search with non-matching criteria
    response = test_client.get('/assignments/search?title=NonExistentAssignment')
    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data) == 0
