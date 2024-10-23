def test_create_update_delete_enrollment(test_client):
    # Create Enrollment
    create_data = {
        'course_id': 1,
        'user_id': 10,
        'enrollment_date': '2024-10-22T12:00:00'
    }
    response = test_client.post('/enrollments', json=create_data)
    assert response.status_code == 201
    assert b'Enrollment created successfully' in response.data

    enrollment_id = response.get_json()['enrollment_id']

    # Update Enrollment
    update_data = {
        'course_id': 2  # Changing to a different course
    }
    update_response = test_client.put(f'/enrollments/{enrollment_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Enrollment updated successfully' in update_response.data

    # Get the updated enrollment
    get_response = test_client.get(f'/enrollments/{enrollment_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['course_id'] == 2

    # Delete data
    delete_response = test_client.delete(f'/enrollments/{enrollment_id}')
    assert delete_response.status_code == 200
    assert b'Enrollment deleted successfully' in delete_response.data

    # Verified deleted
    verfified_delete_response = test_client.get(f'/enrollments/{enrollment_id}')
    assert verfified_delete_response.status_code == 404
