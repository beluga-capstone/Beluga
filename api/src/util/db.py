
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Role(db.Model):
    __tablename__ = 'role'
    role_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    permission = db.Column(db.String(200))
    description = db.Column(db.String(200))
    user_create = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

class User(db.Model):
    __tablename__ = 'user'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(100))
    middle_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    role_id = db.Column(db.Integer, db.ForeignKey('role.role_id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    update_at = db.Column(db.DateTime, default=datetime.utcnow)

class Course(db.Model):
    __tablename__ = 'course'
    course_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    description = db.Column(db.String(255))
    publish = db.Column(db.Boolean, default=False)
    create_at = db.Column(db.DateTime, default=datetime.utcnow)
    update_at = db.Column(db.DateTime, default=datetime.utcnow)
    start_at = db.Column(db.DateTime)
    term_id = db.Column(db.Integer, db.ForeignKey('term.term_id'))

class CourseEnrollment(db.Model):
    __tablename__ = 'course_enrollment'
    enrollment_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'))
    student_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))

class Assignment(db.Model):
    __tablename__ = 'assignment'
    assignment_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'))
    title = db.Column(db.String(200))
    description = db.Column(db.String(255))
    due_at = db.Column(db.DateTime)
    lock_at = db.Column(db.DateTime)
    unlock_at = db.Column(db.DateTime)
    user_create = db.Column(db.Integer, db.ForeignKey('user.user_id'))

class Submission(db.Model):
    __tablename__ = 'submission'
    submission_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.assignment_id'))
    submission_date = db.Column(db.DateTime, default=datetime.utcnow)
    grade = db.Column(db.Integer)
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.comment_id'))
    status = db.Column(db.String(50))
    container_id = db.Column(db.Integer, db.ForeignKey('container.container_id'))
    data = db.Column(db.Text)

class Comment(db.Model):
    __tablename__ = 'comment'
    comment_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    submission_id = db.Column(db.Integer, db.ForeignKey('submission.submission_id'))
    create_at = db.Column(db.DateTime, default=datetime.utcnow)
    update_at = db.Column(db.DateTime, default=datetime.utcnow)
    text = db.Column(db.Text)
    reply_id = db.Column(db.Integer, db.ForeignKey('reply.reply_id'))
    publish = db.Column(db.Boolean, default=False)

class Reply(db.Model):
    __tablename__ = 'reply'
    reply_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.comment_id'))
    text = db.Column(db.Text)

class Container(db.Model):
    __tablename__ = 'container'
    container_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    status = db.Column(db.String(50))
    cpu_usage = db.Column(db.Float)
    memory_usage = db.Column(db.Float)
    create_date = db.Column(db.DateTime, default=datetime.utcnow)
    last_modify = db.Column(db.DateTime)
    image_id = db.Column(db.Integer)