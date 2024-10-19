from flask import Flask
from src.util.db import db
from config import Config

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)

    with app.app_context():
        from src.blueprints import assignment, container, course_enrollment, courses, dependencies, image, role, submissions, term, users
        app.register_blueprint(assignment.assignment_bp)
        app.register_blueprint(container.container_bp)
        app.register_blueprint(course_enrollment.enrollment_bp)
        app.register_blueprint(courses.course_bp)
        app.register_blueprint(dependencies.dependencies_bp)
        app.register_blueprint(image.image_bp)
        app.register_blueprint(role.role_bp)
        app.register_blueprint(submissions.submission_bp)
        app.register_blueprint(term.term_bp)
        app.register_blueprint(users.users_bp)

        db.create_all()

        init_roles()
        
        return app

def init_roles():
    from src.util.db import Role
    # List of default roles to be added
    default_roles = [
        {
            'name': 'Admin',
            'permission': 'view_system,manage_users,manage_courses,manage_environments',
            'description': 'Admin role with system management capabilities',
            'user_create': 1
        },
        {
            'name': 'Professor',
            'permission': 'manage_courses,view_analytics,grade_assignments',
            'description': 'Professor role with course and assignment management capabilities',
            'user_create': 1
        },
        {
            'name': 'Student',
            'permission': 'view_courses,submit_assignments,view_grades',
            'description': 'Student role with course viewing and assignment submission capabilities',
            'user_create': 1
        },
        {
            'name': 'TA',
            'permission': 'manage_submissions,manage_feedback,manage_assignments',
            'description': 'TA role with submission and assignment management capabilities',
            'user_create': 1
        }
    ]

    for role_data in default_roles:
        # Check if the role already exists
        if not Role.query.filter_by(name=role_data['name']).first():
            new_role = Role(
                name=role_data['name'],
                permission=role_data['permission'],
                description=role_data['description'],
                user_create=role_data['user_create']
            )
            db.session.add(new_role)

    db.session.commit()
