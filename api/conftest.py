import os
import sys

os.chdir(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))


import pytest
from src import create_app 
from src.util.db import db  


@pytest.fixture(scope='module')
def test_client():
    #app = create_app('testing')
    app = create_app()  
    with app.test_client() as testing_client:
        with app.app_context():
            db.create_all()  
        yield testing_client  
        # db.drop_all()  

@pytest.fixture
def user_id(test_client):
    # Create User
    create_data = {
        'username': 'testuser',
        'email': 'testuser@tamu.edu'
    }
    response = test_client.post('/users', json=create_data)
    assert response.status_code == 201
    assert b'User created successfully' in response.data

    # Return the user ID for use in tests
    return response.get_json()['user']

@pytest.fixture
def assignment_id(test_client, course_id, image_id, user_id):
    # Create Assignment
    create_data = {
        'course_id': course_id,
        'title': 'Test Assignment',
        'description': 'This is a test assignment',
        'due_at': '2024-10-31T23:59:59',
        'lock_at': '2024-10-31T23:59:59',
        'unlock_at': '2024-10-01T00:00:00',
        'user_create': user_id,
        'image_id': image_id
    }
    response = test_client.post('/assignments', json=create_data)
    assert response.status_code == 201
    assert b'Assignment created successfully' in response.data
    return response.get_json()['assignment_id']

@pytest.fixture
def container_id(test_client, image_id, user_id):
    create_data = {
        'user_id': user_id,
        'status': 'running',
        'cpu_usage': 30.5,
        'memory_usage': 1024,
        'create_date': '2024-10-20T10:00:00',
        'last_modify': '2024-10-20T12:00:00',
        'image_id': image_id
    }
    response = test_client.post('/containers', json=create_data)
    assert response.status_code == 201
    assert b'Container created successfully' in response.data
    return response.get_json()['container_id']

@pytest.fixture
def course_id(test_client, term_id, user_id):
    create_data = {
        'name': 'Introduction to Python',
        'user_id': user_id,
        'description': 'This is a beginner course for Python programming.',
        'publish': True,
        'start_at': '2024-10-25T10:00:00',
        'term_id': term_id
    }
    response = test_client.post('/courses', json=create_data)
    assert response.status_code == 201
    assert b'Course created successfully' in response.data
    return response.get_json()['course_id']

@pytest.fixture
def enrollment_id(test_client, user_id, course_id):
    # Create Enrollment
    create_data = {
        'course_id': course_id,
        'user_id': user_id,
        'enrollment_date': '2024-10-22T12:00:00'
    }
    response = test_client.post('/enrollments', json=create_data)
    assert response.status_code == 201
    assert b'Enrollment created successfully' in response.data
    return response.get_json()['enrollment_id']

@pytest.fixture
def image_id(test_client, user_id):
    create_data = {
        'user_id': user_id,
        'name': 'Test Image',
        'description': 'This is a test image',
        'created_at': '2024-10-22T12:00:00',
        'updated_at': '2024-10-22T12:00:00'
    }
    response = test_client.post('/images', json=create_data)
    assert response.status_code == 201
    assert b'Image created successfully' in response.data
    return response.get_json()['image_id']
    
@pytest.fixture
def role_id(test_client):
    create_data = {
        'name': 'Admin2',
        'permission': 'full_access',
        'description': 'Administrator role with full access',
        'user_create': 1
    }
    response = test_client.post('/roles', json=create_data)
    assert response.status_code == 201
    assert b'Role created successfully' in response.data
    return response.get_json()['role_id']

@pytest.fixture
def term_id(test_client):
    create_data = {
        'name': 'Fall 2024'
    }
    response = test_client.post('/terms', json=create_data)
    assert response.status_code == 201
    assert b'Term created successfully' in response.data
    return response.get_json()['term_id']