import pytest

def test_create_update_delete_enrollment(test_client, enrollment_id, course_id):
    # Step 1: Update the Enrollment
    update_data = {
        'course_id': course_id
    }
    update_response = test_client.put(f'/enrollments/{enrollment_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Enrollment updated successfully' in update_response.data

    # Step 2: Get and Verify the Updated Enrollment
    get_response = test_client.get(f'/enrollments/{enrollment_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['course_id'] == course_id

    # Step 3: Delete the Enrollment
    delete_response = test_client.delete(f'/enrollments/{enrollment_id}')
    assert delete_response.status_code == 200
    assert b'Enrollment deleted successfully' in delete_response.data

    # Step 4: Verify the Enrollment Deletion
    verified_delete_response = test_client.get(f'/enrollments/{enrollment_id}')
    assert verified_delete_response.status_code == 404

def test_create_enrollment_missing_fields(test_client):
    data = {}
    response = test_client.post('/enrollments', json=data)
    assert response.status_code == 400
    assert b'Course ID and User ID are required' in response.data