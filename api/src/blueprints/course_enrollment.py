from flask import Blueprint, request, jsonify
from datetime import datetime
from src.util.db import db, CourseEnrollment, User, Course

enrollment_bp = Blueprint('enrollment', __name__)

# Create a new course enrollment (POST)
@enrollment_bp.route('/enrollments', methods=['POST'])
def create_enrollment():
    data = request.get_json()

    if not data or not data.get('course_id') or not data.get('user_id'):
        return jsonify({'error': 'Course ID and Student ID are required'}), 400

    enrollment_date = data.get('enrollment_date', datetime.now())

    new_enrollment = CourseEnrollment(
        course_id=data['course_id'],
        user_id=data['user_id'],
        enrollment_date=enrollment_date
    )

    try:
        db.session.add(new_enrollment)
        db.session.commit()
        return jsonify({'message': 'Enrollment created successfully', 'enrollment_id': new_enrollment.enrollment_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all enrollments (GET)
@enrollment_bp.route('/enrollments', methods=['GET'])
def get_enrollments():
    enrollments = CourseEnrollment.query.all()
    enrollments_list = [{
        'enrollment_id': enrollment.enrollment_id,
        'course_id': enrollment.course_id,
        'user_id': enrollment.user_id,
        'enrollment_date': enrollment.enrollment_date  
    } for enrollment in enrollments]

    return jsonify(enrollments_list), 200

# Get a specific enrollment (GET)
@enrollment_bp.route('/enrollments/<int:enrollment_id>', methods=['GET'])
def get_enrollment(enrollment_id):
    enrollment = CourseEnrollment.query.get_or_404(enrollment_id)

    return jsonify({
        'enrollment_id': enrollment.enrollment_id,
        'course_id': enrollment.course_id,
        'user_id': enrollment.user_id,
        'enrollment_date': enrollment.enrollment_date  
    }), 200

# Update an enrollment (PUT)
@enrollment_bp.route('/enrollments/<int:enrollment_id>', methods=['PUT'])
def update_enrollment(enrollment_id):
    enrollment = CourseEnrollment.query.get_or_404(enrollment_id)
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
@enrollment_bp.route('/enrollments/<int:enrollment_id>', methods=['DELETE'])
def delete_enrollment(enrollment_id):
    enrollment = CourseEnrollment.query.get_or_404(enrollment_id)

    try:
        db.session.delete(enrollment)
        db.session.commit()
        return jsonify({'message': 'Enrollment deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all enrollments for a specific user (GET)
@enrollment_bp.route('/users/<int:user_id>/enrollments', methods=['GET'])
def get_enrollments_for_user(user_id):
    # Check if the user exists
    user = User.query.get_or_404(user_id)

    # Query all enrollments for the user
    enrollments = CourseEnrollment.query.filter_by(user_id=user_id).all()
    
    # Format the response
    enrollments_list = []
    for enrollment in enrollments:
        course = Course.query.get(enrollment.course_id)
        enrollments_list.append({
            'enrollment_id': enrollment.enrollment_id,
            'course_id': enrollment.course_id,
            'course_name': course.name if course else None,
            'enrollment_date': enrollment.enrollment_date  
        })
    
    return jsonify({
        'user_id': user.user_id,
        'username': user.username,
        'enrollments': enrollments_list
    }), 200

@enrollment_bp.route('/courses/<int:course_id>/users', methods=['GET'])
def get_users_for_course(course_id):
    # Query all enrollments for the given course
    enrollments = CourseEnrollment.query.filter_by(course_id=course_id).all()
    
    # Format the response
    users_list = []
    for enrollment in enrollments:
        user = User.query.get(enrollment.user_id)
        if user:
            users_list.append({
                'user_id': user.user_id,
                'username': user.username,
                'email': user.email,
                'role_id': user.role_id
            })
    
    return jsonify(users_list), 200
