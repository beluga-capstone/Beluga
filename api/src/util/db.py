import uuid
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID


db = SQLAlchemy()


class Role(db.Model):
    __tablename__ = 'role'
    role_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    permission = db.Column(db.String(200))
    description = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(100))
    middle_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    role_id = db.Column(db.Integer, db.ForeignKey('role.role_id'))
    created_at = db.Column(db.DateTime, default=datetime.now)
    update_at = db.Column(db.DateTime, default=datetime.now)

    def get_id(self):
        return (self.user_id)

    def parse_role(self):
        roles = ['student', 'ta', 'prof', 'admin']
        r = {}

        for k, v in zip(roles, map(int, bin(self.role_id)[2:])):
            r[k] = bool(v)

        return r

    def is_student(self):
        roles = self.parse_role()
        if roles['student'] or roles['ta'] or roles['prof'] or roles['admin']:
            return True
        return False

    def is_ta(self):
        roles = self.parse_role()
        if roles['ta'] or roles['prof'] or roles['admin']:
            return True
        return False

    def is_prof(self):
        roles = self.parse_role()
        if roles['prof'] or roles['admin']:
            return True
        return False

    def is_admin(self):
        roles = self.parse_role()
        if roles['admin']:
            return True
        return False

class Term(db.Model):
    __tablename__ = 'term'
    term_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False)

class Course(db.Model):
    __tablename__ = 'course'
    course_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.user_id'))
    description = db.Column(db.String(255))
    publish = db.Column(db.Boolean, default=False)
    create_at = db.Column(db.DateTime, default=datetime.now)
    update_at = db.Column(db.DateTime, default=datetime.now)
    start_at = db.Column(db.DateTime)
    term_id = db.Column(UUID(as_uuid=True), db.ForeignKey('term.term_id'))

class CourseEnrollment(db.Model):
    __tablename__ = 'course_enrollment'
    enrollment_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = db.Column(UUID(as_uuid=True), db.ForeignKey('course.course_id'))
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.user_id'))
    enrollment_date = db.Column(db.DateTime, default=datetime.now)

class Assignment(db.Model):
    __tablename__ = 'assignment'
    assignment_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = db.Column(UUID(as_uuid=True), db.ForeignKey('course.course_id'))
    title = db.Column(db.String(200))
    description = db.Column(db.String(255))
    due_at = db.Column(db.DateTime)
    lock_at = db.Column(db.DateTime)
    unlock_at = db.Column(db.DateTime)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.user_id'))
    docker_image_id = db.Column(db.String(80), db.ForeignKey('image.docker_image_id'), nullable=True)

class Submission(db.Model):
    __tablename__ = 'submission'
    submission_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.user_id'))
    assignment_id = db.Column(UUID(as_uuid=True), db.ForeignKey('assignment.assignment_id'))
    submission_date = db.Column(db.DateTime, default=datetime.now)
    grade = db.Column(db.Integer)
    status = db.Column(db.String(50))
    data = db.Column(db.Text)

class Container(db.Model):
    __tablename__ = 'container'
    docker_container_id = db.Column(db.String(64), primary_key=True)
    docker_container_name = db.Column(db.String(255))
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.user_id'))
    description = db.Column(db.String(255))

class Image(db.Model):
    __tablename__ = 'image'
    docker_image_id = db.Column(db.String(80), primary_key=True)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('user.user_id'))
    description = db.Column(db.String(255))
