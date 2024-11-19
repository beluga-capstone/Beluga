import os
import sys
import pytest
from unittest.mock import patch, MagicMock
from flask_login import current_user
from uuid import uuid4
from src.util import auth
os.chdir(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))


from src import create_app 
from src.util.db import db  


@pytest.fixture(scope='module')
def test_client():
    app = create_app('default')
    with app.test_client() as testing_client:
        with app.app_context():
            db.create_all()  
        yield testing_client  

@pytest.fixture(autouse=True)
def mock_admin_auth(request, admin_id):
    if 'disable_auth_mock' in request.keywords:
        yield
    else:
        """Mocks an authenticated user for Flask-Login."""
        mock_user = MagicMock()
        mock_user.user_id = admin_id
        mock_user.email = 'mockadminuser@tamu.edu'
        mock_user.role_id = '1'

        with patch('flask_login.utils._get_user', return_value=mock_user):
            yield mock_user

@pytest.fixture
def admin_id(test_client):
    create_data = {
        'username': 'testadminuser',
        'email': 'testadminuser@tamu.edu',
        'role_id': '1'
    }
    response = test_client.post('/users', json=create_data)
    assert response.status_code == 201
    assert b'User created successfully' in response.data

    # Return the user ID for use in tests
    return response.get_json()['user_id']

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
    return response.get_json()['user_id']

@pytest.fixture
def assignment_id(test_client, course_id, docker_image_id, user_id):
    # Create Assignment
    create_data = {
        'course_id': course_id,
        'title': 'Test Assignment',
        'description': 'This is a test assignment',
        'due_at': '2024-10-31T23:59:59',
        'lock_at': '2024-10-31T23:59:59',
        'unlock_at': '2024-10-01T00:00:00',
        'user_id': user_id,
        'docker_image_id': docker_image_id
    }
    response = test_client.post('/assignments', json=create_data)
    assert response.status_code == 201
    assert b'Assignment created successfully' in response.data
    return response.get_json()['assignment_id']

@pytest.fixture
def container_id(test_client, user_id):
    create_data = {
        'docker_container_id': str(uuid4()),  # Unique ID for each test
        'user_id': user_id,
        'description': 'This is a test container'
    }
    response = test_client.post('/containers', json=create_data)
    assert response.status_code == 201, f"Error: {response.get_json().get('error')}"
    return response.get_json()['docker_container_id']

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
    create_data = {
        'course_id': course_id,
        'user_id': user_id,
        'enrollment_date': '2024-10-22T12:00:00'
    }
    response = test_client.post('/enrollments', json=create_data)
    assert response.status_code == 201, f"Error: {response.get_json().get('error')}"
    return response.get_json()['enrollment_id']


# @pytest.fixture
# def docker_image_id(test_client, user_id):
#     create_data = {
#         'docker_image_id': str(uuid4()),  # Generate a unique ID for each test
#         'user_id': user_id,
#         'description': 'This is a test image'
#     }
#     response = test_client.post('/images', json=create_data)
#     assert response.status_code == 201, f"Error: {response.get_json().get('error')}"
#     return response.get_json()['docker_image_id']


@pytest.fixture
def docker_image_id(test_client, user_id):
    fake_docker_image_id = str(uuid4())  # Generate a unique ID
    create_data = {
        'docker_image_id': fake_docker_image_id,
        'user_id': user_id,
        'description': 'This is a test image'
    }
    response = test_client.post('/images', json=create_data)
    assert response.status_code == 201, f"Error: {response.get_json().get('error')}"
    return fake_docker_image_id

ROLE_ID_COUNTER = 9 

@pytest.fixture
def role_id(test_client):
    global ROLE_ID_COUNTER
    unique_role_id = ROLE_ID_COUNTER
    ROLE_ID_COUNTER += 1 

    create_data = {
        'role_id': unique_role_id,
        'name': 'Admin2',
        'permission': 'full_access',
        'description': 'Administrator role with full access',
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

@pytest.fixture
def submission_id(test_client, user_id, assignment_id):
    create_data = {
        'user_id': user_id,  # Replace with a valid user UUID
        'assignment_id': assignment_id # Replace with a valid assignment UUID
    }
    response = test_client.post('/submissions', json=create_data)
    assert response.status_code == 201
    assert b'Submission created successfully' in response.data
    return response.get_json()['submission_id']