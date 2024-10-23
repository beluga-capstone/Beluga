def test_create_update_delete_course(test_client):
    # Create Course
    create_data = {
        'name': 'Introduction to Python',
        'user_id': 1,
        'description': 'This is a beginner course for Python programming.',
        'publish': True,
        'start_at': '2024-10-25T10:00:00',
        'term_id': 3
    }
    response = test_client.post('/courses', json=create_data)
    assert response.status_code == 201
    assert b'Course created successfully' in response.data

    course_id = response.get_json()['course_id']

    # Update Course
    update_data = {
        'name': 'Advanced Python',
        'description': 'This course covers advanced Python topics.',
        'publish': False
    }
    update_response = test_client.put(f'/courses/{course_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Course updated successfully' in update_response.data

    # Get the updated course
    get_response = test_client.get(f'/courses/{course_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['name'] == 'Advanced Python'
    assert json_data['description'] == 'This course covers advanced Python topics.'
    assert json_data['publish'] == False

    # Delete Course
    delete_response = test_client.delete(f'/courses/{course_id}')
    assert delete_response.status_code == 200
    assert b'Course deleted successfully' in delete_response.data

    # Verified deleted
    verfified_delete_response = test_client.get(f'/courses/{course_id}')
    assert verfified_delete_response.status_code == 404
