import pytest

@pytest.fixture
def enrollment_id(test_client):
    # Create Enrollment
    create_data = {
        'course_id': 1,
        'user_id': 10,
        'enrollment_date': '2024-10-22T12:00:00'
    }
    response = test_client.post('/enrollments', json=create_data)
    assert response.status_code == 201
    assert b'Enrollment created successfully' in response.data
    return response.get_json()['enrollment_id']

def test_update_enrollment(test_client, enrollment_id):
    update_data = {
        'course_id': 2  
    }
    update_response = test_client.put(f'/enrollments/{enrollment_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Enrollment updated successfully' in update_response.data

def test_get_enrollment(test_client, enrollment_id):
    get_response = test_client.get(f'/enrollments/{enrollment_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['course_id'] == 2

def test_delete_enrollment(test_client, enrollment_id):
    delete_response = test_client.delete(f'/enrollments/{enrollment_id}')
    assert delete_response.status_code == 200
    assert b'Enrollment deleted successfully' in delete_response.data

    verified_delete_response = test_client.get(f'/enrollments/{enrollment_id}')
    assert verified_delete_response.status_code == 404

def test_create_update_delete_enrollment(test_client):
    enrollment_id_value = enrollment_id(test_client)
    test_update_enrollment(test_client, enrollment_id_value)
    test_get_enrollment(test_client, enrollment_id_value)
    test_delete_enrollment(test_client, enrollment_id_value)
