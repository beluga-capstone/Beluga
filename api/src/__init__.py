from sqlalchemy_utils import database_exists, create_database
from flask_login import LoginManager
from flask import Flask
from datetime import datetime

from src.util.util import create_ssh_key_pair
from src.util.db import db, User
from config import config_options
from flask_socketio import SocketIO
from flask_cors import CORS 
import logging
import requests
from flask import current_app

socketio = SocketIO()

login_manager = LoginManager()
ADMIN_ID='dd85014a-edad-4298-b9c6-808268b3d15e'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

@login_manager.request_loader
def load_user_from_request(request): return User.query.get(ADMIN_ID)


def create_app(config_name="default"):
    app = Flask(__name__)
    # app.logger.setLevel(logging.INFO)
    app.config.from_object(config_options[config_name])

    db.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")

    # WARNING: supports credentials may be insecure
    CORS(app, origins="http://localhost:3000", supports_credentials=True)
    login_manager.init_app(app)
    login_manager.login_view = '/auth/login'

    if not database_exists(app.config['SQLALCHEMY_DATABASE_URI']):
        create_database(app.config['SQLALCHEMY_DATABASE_URI'])

    with app.app_context():
        from src.blueprints import assignment, auth, container, course_enrollment, courses, image, role, submissions, term, users
        app.register_blueprint(assignment.assignment_bp)
        app.register_blueprint(auth.auth_bp)
        app.register_blueprint(container.container_bp)
        app.register_blueprint(course_enrollment.enrollment_bp)
        app.register_blueprint(courses.course_bp)
        app.register_blueprint(image.image_bp)
        app.register_blueprint(role.role_bp)
        app.register_blueprint(submissions.submission_bp)
        app.register_blueprint(term.term_bp)
        app.register_blueprint(users.users_bp)

        db.create_all()
    
        # init the database
        init_roles()
        init_admin_user()
        init_default_images()
        create_example_course()
        
        return app

def init_admin_user():
    from src.util.db import User
    # Check if the admin user already exists
    admin_user = User.query.filter_by(username='admin').first()
    if not admin_user:
        # Create a new admin user
        admin_user = User(
            username='admin',
            email='admin@example.com',
            first_name='Admin',
            last_name='User',
            role_id=1,
            user_id=ADMIN_ID,
        )
        db.session.add(admin_user)
        db.session.commit()

        # Generate SSH key pair for the admin user
        key_paths = create_ssh_key_pair(ADMIN_ID)
        if key_paths:
            print(f"SSH keys created for admin user: {key_paths}")
        else:
            print("Failed to create SSH keys for admin user.")

def init_roles():
    from src.util.db import Role
    # List of default roles to be added
    default_roles = [
        {
            'role_id': 1,
            'name': 'Admin',
            'permission': 'view_system,manage_users,manage_courses,manage_environments',
            'description': 'Admin role with system management capabilities',
        },
        {
            'role_id': 2,
            'name': 'Professor',
            'permission': 'manage_courses,view_analytics,grade_assignments',
            'description': 'Professor role with course and assignment management capabilities',
        },
        {
            'role_id': 4,
            'name': 'TA',
            'permission': 'manage_submissions,manage_feedback,manage_assignments',
            'description': 'TA role with submission and assignment management capabilities',
        },
        {
            'role_id': 8,
            'name': 'Student',
            'permission': 'view_courses,submit_assignments,view_grades',
            'description': 'Student role with course viewing and assignment submission capabilities',
        },
    ]

    for role_data in default_roles:
        # Check if the role already exists
        if not Role.query.filter_by(name=role_data['name']).first():
            new_role = Role(
                role_id=role_data['role_id'],
                name=role_data['name'],
                permission=role_data['permission'],
                description=role_data['description'],
            )
            db.session.add(new_role)

    db.session.commit()

def create_example_course():
    from src.util.db import Term, Course, User
    # Create a term if it doesn't already exist
    term = Term.query.filter_by(name="Fall 2024").first()
    if not term:
        term = Term(name="Fall 2024")
        db.session.add(term)
        db.session.commit()
    
    # Create an instructor user if it doesn't already exist
    instructor = User.query.filter_by(username="instructor").first()
    if not instructor:
        instructor = User(
            username="instructor",
            email="instructor@example.com",
            first_name="John",
            last_name="Doe",
            role_id=2  # Assuming '2' is the Professor role
        )
        db.session.add(instructor)
        db.session.commit()

    # Create a course if it doesn't already exist
    course = Course.query.filter_by(name="Introduction to Programming").first()
    if not course:
        course = Course(
            course_id="1f3999da-09c1-4e6b-898b-139d417cddac",
            name="Introduction to Programming",
            user_id=instructor.user_id,
            description="An introductory course on programming concepts and Python.",
            publish=True,
            start_at=datetime.now(),
            term_id=term.term_id
        )
        db.session.add(course)
        db.session.commit()


from src.blueprints.image import Image
import docker
import os
def init_default_images():
    """Initialize default Docker images in the database if they do not exist."""
    docker_client = docker.from_env()
    default_images = [
        {
            'context_path': '../deployment/containers/beluga_ubuntu/',
            'dockerfile': 'Dockerfile',
            'image_tag': 'beluga_base_ubuntu',
            'description': 'Base image for ubuntu machines',
            'packages':"",
            'user_id': ADMIN_ID
        },
        {
            'context_path': '../deployment/containers/beluga_fedora/',
            'dockerfile': 'Dockerfile',
            'image_tag': 'beluga_base_fedora',
            'description': 'Base image for fedora machines',
            'packages':"",
            'user_id': ADMIN_ID
        },
    ]
    registry_ip = current_app.config['REGISTRY_IP']
    registry_port = current_app.config['REGISTRY_PORT']

    for image_info in default_images:
        image_tag = image_info['image_tag']

        # Check if the image tag exists in the registry
        docker_image_id = get_docker_image_id_from_registry(image_tag)

        if docker_image_id:
            if check_image_in_database(docker_image_id):
                continue
            else:
                new_image = Image(
                    docker_image_id=docker_image_id,
                    description=image_info['description'],
                    user_id=image_info['user_id'],
                    packages=image_info['packages'],
                )
                db.session.add(new_image)
                db.session.commit()
                print(f"Imaege in registry but not db , added image {image_tag} to the db u.")
        else:
            # If the image tag doesn't exist in the registry, we need to build the image
            registry_tag = f"{registry_ip}:{registry_port}/{image_tag}"

            # Check if context_path exists
            context_path = image_info['context_path']
            if not os.path.isdir(context_path):
                print(f"Error: The directory '{context_path}' does not exist.")
                continue

            try:
                # Set build context to the specified directory
                image, logs = docker_client.images.build(
                    path=image_info['context_path'],
                    dockerfile=image_info['dockerfile'],
                    tag=image_info['image_tag']
                )

                # Push to registry
                image.tag(registry_tag)
                docker_client.images.push(registry_tag)

                # Save image to database
                new_image = Image(
                    docker_image_id=image.id,
                    description=image_info['description'],
                    user_id=image_info['user_id'],
                    packages=image_info['packages'],
                )
                db.session.add(new_image)
                db.session.commit()
                print(f"Initialized default image: {image_info['image_tag']}")

                # Remove locally
                docker_client.images.remove(image_tag)
                docker_client.images.remove(registry_tag)

            except Exception as e:
                db.session.rollback()
                print(f"Failed to initialize default image {image_info['image_tag']}: {e}")


def check_image_in_registry(image_tag):
    try:
        registry_ip = current_app.config['REGISTRY_IP']
        registry_port = current_app.config['REGISTRY_PORT']

        if ":" in image_tag:
            repository, tag = image_tag.rsplit(":", 1)
        else:
            repository = image_tag
            tag = "latest"

        registry_url = f"http://{registry_ip}:{registry_port}/v2/{repository}/manifests/{tag}"

        headers = {
            "Accept": "application/vnd.docker.distribution.manifest.v2+json"
        }

        response = requests.get(registry_url, headers=headers)

        if response.status_code == 200:
            return True
        elif response.status_code == 404:
            return False
        else:
            response.raise_for_status()
    except Exception as e:
        print(f"Error checking image in registry: {e}")
        return False

def get_docker_image_id_from_registry(image_tag):
    try:
        registry_ip = current_app.config['REGISTRY_IP']
        registry_port = current_app.config['REGISTRY_PORT']

        if ":" in image_tag:
            repository, tag = image_tag.rsplit(":", 1)
        else:
            repository = image_tag
            tag = "latest"

        registry_url = f"http://{registry_ip}:{registry_port}/v2/{repository}/manifests/{tag}"

        headers = {
            "Accept": "application/vnd.docker.distribution.manifest.v2+json"
        }

        response = requests.get(registry_url, headers=headers)

        if response.status_code == 200:
            manifest = response.json()
            docker_image_id = manifest['config']['digest']  # This is the docker image ID
            return docker_image_id
        elif response.status_code == 404:
            return None
        else:
            response.raise_for_status()
    except Exception as e:
        print(f"Error retrieving image ID from registry: {e}")
        return None

def check_image_in_database(docker_image_id):
    image = Image.query.filter_by(docker_image_id=docker_image_id).first()
    return image is not None