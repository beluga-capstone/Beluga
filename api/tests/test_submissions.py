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