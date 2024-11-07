from flask import Blueprint, request, jsonify
from flask_login import current_user
from datetime import datetime
import uuid
from src.util.db import db, CourseEnrollment, User, Course
from src.util.auth import student_required

enrollment_bp = Blueprint('enrollment', __name__)

# Create a new course enrollment (POST)
@enrollment_bp.route('/enrollments', methods=['POST'])
def create_enrollment():
    data = request.get_json()

    if not data or not data.get('course_id') or not data.get('user_id'):
        return jsonify({'error': 'Course ID and User ID are required'}), 400

    # Validate UUID format
    try:
        uuid.UUID(data['course_id'])
        uuid.UUID(data['user_id'])
    except ValueError:
        return jsonify({'error': 'Invalid UUID format for course_id or user_id'}), 400

    new_enrollment = CourseEnrollment(
        course_id=data['course_id'],
        user_id=data['user_id'],
        enrollment_date=data.get('enrollment_date', datetime.now())
    )

    try:
        db.session.add(new_enrollment)
        db.session.commit()
        return jsonify({'message': 'Enrollment created successfully', 'enrollment_id': str(new_enrollment.enrollment_id)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all enrollments (GET)
@enrollment_bp.route('/enrollments', methods=['GET'])
def get_enrollments():
    course_enrollments = db.session.scalars(db.select(CourseEnrollment)).all()
    enrollments_list = [{
        'enrollment_id': str(enrollment.enrollment_id),
        'course_id': str(enrollment.course_id),
        'user_id': str(enrollment.user_id),
        'enrollment_date': enrollment.enrollment_date  
    } for enrollment in course_enrollments]

    return jsonify(enrollments_list), 200

# Get a specific enrollment (GET)
@enrollment_bp.route('/enrollments/<uuid:enrollment_id>', methods=['GET'])
def get_enrollment(enrollment_id):
    enrollment = db.session.get(CourseEnrollment, enrollment_id)
    if enrollment is None:
        return jsonify({'error': 'Enrollment not found'}), 404

    return jsonify({
        'enrollment_id': str(enrollment.enrollment_id),
        'course_id': str(enrollment.course_id),
        'user_id': str(enrollment.user_id),
        'enrollment_date': enrollment.enrollment_date  
    }), 200

# Update an enrollment (PUT)
@enrollment_bp.route('/enrollments/<uuid:enrollment_id>', methods=['PUT'])
def update_enrollment(enrollment_id):
    enrollment = db.session.get(CourseEnrollment, enrollment_id)
    if enrollment is None:
        return jsonify({'error': 'Enrollment not found'}), 404

    data = request.get_json()
    enrollment.course_id = data.get('course_id', enrollment.course_id)
    enrollment.user_id = data.get('user_id', enrollment.user_id)
    enrollment.enrollment_date = data.get('enrollment_date', enrollment.enrollment_date)

    try:
        db.session.commit()
        return jsonify({'message': 'Enrollment updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete an enrollment (DELETE)
@enrollment_bp.route('/enrollments/<uuid:enrollment_id>', methods=['DELETE'])
def delete_enrollment(enrollment_id):
    enrollment = db.session.get(CourseEnrollment, enrollment_id)
    if enrollment is None:
        return jsonify({'error': 'Enrollment not found'}), 404

    try:
        db.session.delete(enrollment)
        db.session.commit()
        return jsonify({'message': 'Enrollment deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all enrollments for a specific user (GET)
@enrollment_bp.route('/users/enrollments', methods=['GET'])
@student_required
def get_enrollments_for_user():
    # Check if the user exists
    user_id = current_user.user_id
    user = db.session.get(User, user_id)
    
    if user is None:
        return jsonify({'error': 'User not found'}), 404

    enrollments = db.session.scalars(db.select(CourseEnrollment).filter_by(user_id=user_id)).all()
    enrollments_list = [{
        'enrollment_id': str(enrollment.enrollment_id),
        'course_id': str(enrollment.course_id),
        'enrollment_date': enrollment.enrollment_date  
    } for enrollment in enrollments]
    
    return jsonify({
        'user_id': str(user.user_id),
        'username': user.username,
        'enrollments': enrollments_list
    }), 200

# Get all users enrolled in a specific course (GET)
@enrollment_bp.route('/courses/<uuid:course_id>/users', methods=['GET'])
def get_users_for_course(course_id):
    enrollments = db.session.scalars(db.select(CourseEnrollment).filter_by(course_id=course_id)).all()
    users_list = []
    for enrollment in enrollments:
        user = db.session.get(User, enrollment.user_id)
        if user:
            users_list.append({
                'user_id': str(user.user_id),
                'username': user.username,
                'email': user.email,
                'role_id': str(user.role_id)
            })
    
    return jsonify(users_list), 200
