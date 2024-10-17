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

    return app