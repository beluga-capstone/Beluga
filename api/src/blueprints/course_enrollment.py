from flask import Blueprint, request, jsonify
from flask_login import current_user
from datetime import datetime
import uuid
from src.util.db import db, CourseEnrollment, User, Course
from src.util.auth import student_required
from src.util.auth import *


enrollment_bp = Blueprint('enrollment', __name__)

# Create a new course enrollment (POST)
@enrollment_bp.route('/enrollments', methods=['POST'])
@professor_required
def create_enrollment_or_enrollments():
    try:
        data = request.get_json()
        print("Received data:", data)  # Debug print
        if not data or not data.get('course_id') or not data.get('user_id'):
            return jsonify({'error': 'Course ID and User ID are required'}), 400
        # Validate request data
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        # Check if the input is a list (bulk creation)
        if isinstance(data, list):
            enrollments = []

            for enrollment_data in data:
                course_id = enrollment_data.get('course_id')
                user_id = enrollment_data.get('user_id')

                # Validate required fields
                if not course_id or not user_id:
                    return jsonify({'error': f'Missing course_id or user_id in {enrollment_data}'}), 400

                # Validate UUID format
                try:
                    uuid.UUID(course_id)
                    uuid.UUID(user_id)
                except ValueError:
                    return jsonify({'error': f'Invalid UUID format for course_id or user_id in {enrollment_data}'}), 400

                # Create enrollment object
                new_enrollment = CourseEnrollment(
                    enrollment_id=uuid.uuid4(),
                    course_id=course_id,
                    user_id=user_id,
                    enrollment_date=enrollment_data.get('enrollment_date', datetime.now())
                )
                db.session.add(new_enrollment)
                enrollments.append(new_enrollment)

            # Commit all enrollments
            db.session.commit()

            # Return enrollment details
            response_data = [{"enrollment_id": str(e.enrollment_id), "course_id": str(e.course_id), "user_id": str(e.user_id)} for e in enrollments]
            return jsonify(response_data), 201

        # Handle single enrollment creation
        elif isinstance(data, dict):
            course_id = data.get('course_id')
            user_id = data.get('user_id')

            # Validate required fields
            if not course_id or not user_id:
                return jsonify({'error': 'Course ID and User ID are required'}), 400

            # Validate UUID format
            try:
                uuid.UUID(course_id)
                uuid.UUID(user_id)
            except ValueError:
                return jsonify({'error': 'Invalid UUID format for course_id or user_id'}), 400

            # Create enrollment object
            new_enrollment = CourseEnrollment(
                enrollment_id=uuid.uuid4(),
                course_id=course_id,
                user_id=user_id,
                enrollment_date=data.get('enrollment_date', datetime.now())
            )

            db.session.add(new_enrollment)
            db.session.commit()

            return jsonify({
                'message': 'Enrollment created successfully',
                'enrollment_id': str(new_enrollment.enrollment_id),
                'course_id': str(new_enrollment.course_id),
                'user_id': str(new_enrollment.user_id)
            }), 201

        else:
            return jsonify({'error': 'Invalid input format. Expected an object or an array of objects.'}), 400

    except Exception as e:
        print("Error during enrollment creation:", str(e))
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all enrollments (GET)
@enrollment_bp.route('/enrollments', methods=['GET'])
@admin_required
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
@login_required
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
@admin_required
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
@admin_required
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
@student_required
def get_users_for_course(course_id):
    enrollments = db.session.scalars(db.select(CourseEnrollment).filter_by(course_id=course_id)).all()
    users_list = [] 
    for enrollment in enrollments:
        user = db.session.get(User, enrollment.user_id)
        if user:
            users_list.append({
                'user_id': str(user.user_id),
                'firstname': user.first_name,
                'middlename': user.middle_name,
                'lastname': user.last_name,
                'username': user.username,
                'email': user.email,
                'role_id': str(user.role_id)
            })
    
    return jsonify(users_list), 200

# Get the number of students enrolled in a specific course (GET)
@enrollment_bp.route('/courses/<uuid:course_id>/students/count', methods=['GET'])
@admin_required
def get_student_count_for_course(course_id):
    try:
        count = db.session.query(CourseEnrollment).filter_by(course_id=course_id).count()
        return jsonify({"students_count": count}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500