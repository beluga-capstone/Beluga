from sqlalchemy_utils import database_exists, create_database
from flask_login import LoginManager
from flask import Flask

from src.util.db import db, User
from config import config_options
from flask_socketio import SocketIO
from flask_cors import CORS 

socketio = SocketIO()

login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


def create_app(config_name="default"):
    app = Flask(__name__)
    app.config.from_object(config_options[config_name])

    print(config_name)

    db.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")

    CORS(app)
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

        admin_user_id = init_admin_user()
        init_roles(admin_user_id)
        
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
            role_id=None
        )
        db.session.add(admin_user)
        db.session.commit()
    
    return admin_user.user_id

def init_roles(admin_user_id):
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
