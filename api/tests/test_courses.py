import pytest

@pytest.fixture
def course_id(test_client):
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
    return response.get_json()['course_id']

def test_update_course(test_client, course_id):
    update_data = {
        'name': 'Advanced Python',
        'description': 'This course covers advanced Python topics.',
        'publish': False
    }
    update_response = test_client.put(f'/courses/{course_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Course updated successfully' in update_response.data

def test_get_course(test_client, course_id):
    get_response = test_client.get(f'/courses/{course_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['name'] == 'Advanced Python'
    assert json_data['description'] == 'This course covers advanced Python topics.'
    assert json_data['publish'] == False

def test_delete_course(test_client, course_id):
    delete_response = test_client.delete(f'/courses/{course_id}')
    assert delete_response.status_code == 200
    assert b'Course deleted successfully' in delete_response.data

    verified_delete_response = test_client.get(f'/courses/{course_id}')
    assert verified_delete_response.status_code == 404

def test_create_update_delete_course(test_client):
    course_id_value = course_id(test_client)
    test_update_course(test_client, course_id_value)
    test_get_course(test_client, course_id_value)
    test_delete_course(test_client, course_id_value)
