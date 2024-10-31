import pytest
from uuid import UUID

def test_create_update_delete_course(test_client, course_id):
    # Verify that course_id is a valid UUID
    assert UUID(course_id)

    # Step 1: Update the Course
    update_data = {
        'name': 'Advanced Python',
        'description': 'This course covers advanced Python topics.',
        'publish': False
    }
    update_response = test_client.put(f'/courses/{course_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Course updated successfully' in update_response.data

    # Step 2: Get and Verify the Updated Course
    get_response = test_client.get(f'/courses/{course_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['name'] == 'Advanced Python'
    assert json_data['description'] == 'This course covers advanced Python topics.'
    assert json_data['publish'] is False

    # Step 3: Delete the Course
    delete_response = test_client.delete(f'/courses/{course_id}')
    assert delete_response.status_code == 200
    assert b'Course deleted successfully' in delete_response.data

    # Step 4: Verify the Course Deletion
    verified_delete_response = test_client.get(f'/courses/{course_id}')
    assert verified_delete_response.status_code == 404