import pytest
from uuid import UUID

def test_create_update_delete_submission(test_client, submission_id):
    # Verify that submission_id is a valid UUID
    assert UUID(submission_id)

    # Step 1: Update the Submission
    update_data = {
        'grade': 95,
        'status': 'graded',
        'data': 'Updated submission data'
    }
    update_response = test_client.put(f'/submissions/{submission_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Submission updated successfully' in update_response.data

    # Step 2: Get and Verify the Updated Submission
    get_response = test_client.get(f'/submissions/{submission_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['grade'] == 95
    assert json_data['status'] == 'graded'
    assert json_data['data'] == 'Updated submission data'

    # Step 3: Delete the Submission
    delete_response = test_client.delete(f'/submissions/{submission_id}')
    assert delete_response.status_code == 200
    assert b'Submission deleted successfully' in delete_response.data

    # Step 4: Verify the Submission Deletion
    verify_delete_response = test_client.get(f'/submissions/{submission_id}')
    assert verify_delete_response.status_code == 404

def test_create_submission_missing_fields(test_client):
    data = {}
    response = test_client.post('/submissions', json=data)
    assert response.status_code == 400
    assert b'User ID and Assignment ID are required' in response.data

def test_search_submissions(test_client, user_id, assignment_id, submission_id):
    # Search by user_id
    response = test_client.get(f'/submissions/search?user_id={user_id}')
    assert response.status_code == 200
    json_data = response.get_json()
    assert any(submission['user_id'] == str(user_id) for submission in json_data)

    # Search by assignment_id
    response = test_client.get(f'/submissions/search?assignment_id={assignment_id}')
    assert response.status_code == 200
    json_data = response.get_json()
    assert any(submission['assignment_id'] == str(assignment_id) for submission in json_data)

    # Search by submission_id
    response = test_client.get(f'/submissions/search?submission_id={submission_id}')
    assert response.status_code == 200
    json_data = response.get_json()
    assert any(submission['submission_id'] == str(submission_id) for submission in json_data)

    # Search with non-matching criteria
    response = test_client.get('/submissions/search?status=NonExistentStatus')
    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data) == 0
