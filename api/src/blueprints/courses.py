from flask import Blueprint, request, jsonify
from src.util.db import db, Course, CourseEnrollment
from datetime import datetime
import uuid
from src.util.auth import *

course_bp = Blueprint('course', __name__)

# Create a new course (POST)
@course_bp.route('/courses', methods=['POST'])
@professor_required
def create_course():
    data = request.get_json()

    if not data or not data.get('name'):
        return jsonify({'error': 'Course name is required'}), 400
    
    new_course = Course(
        name=data['name'],
        user_id=data.get('user_id'),
        description=data.get('description'),
        publish=data.get('publish', False),
        start_at=data.get('start_at') or datetime.now(),
        term_id=data.get('term_id')
    )

    try:
        db.session.add(new_course)
        db.session.commit()
        return jsonify({'message': 'Course created successfully', 'course_id': str(new_course.course_id)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all courses (GET)
@course_bp.route('/courses', methods=['GET'])
@admin_required
def get_courses():
    courses = db.session.scalars(db.select(Course)).all()
    courses_list = [{
        'course_id': str(course.course_id),
        'name': course.name,
        'user_id': course.user_id,
        'description': course.description,
        'publish': course.publish,
        'start_at': course.start_at,
        'term_id': course.term_id
    } for course in courses]

    return jsonify(courses_list), 200

# Get a specific course (GET)
@course_bp.route('/courses/<uuid:course_id>', methods=['GET'])
@login_required
def get_course(course_id):
    course = db.session.get(Course, course_id)
    if course is None:
        return jsonify({'error': 'Course not found'}), 404
    
    return jsonify({
        'course_id': str(course.course_id),
        'name': course.name,
        'user_id': course.user_id,
        'description': course.description,
        'publish': course.publish,
        'start_at': course.start_at,
        'term_id': course.term_id
    }), 200

# Update a course (PUT)
@course_bp.route('/courses/<uuid:course_id>', methods=['PUT'])
@professor_required
def update_course(course_id):
    course = db.session.get(Course, course_id)
    if course is None:
        return jsonify({'error': 'Course not found'}), 404

    data = request.get_json()
    course.name = data.get('name', course.name)
    course.user_id = data.get('user_id', course.user_id)
    course.description = data.get('description', course.description)
    course.publish = data.get('publish', course.publish)
    course.start_at = data.get('start_at', course.start_at)
    course.term_id = data.get('term_id', course.term_id)
    course.update_at = datetime.now()

    try:
        db.session.commit()
        return jsonify({'message': 'Course updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a course (DELETE)
@course_bp.route('/courses/<uuid:course_id>', methods=['DELETE'])
@professor_required
def delete_course(course_id):
    course = db.session.get(Course, course_id)
    if course is None:
        return jsonify({'error': 'Course not found'}), 404
    try:
        db.session.query(CourseEnrollment).filter_by(course_id=course_id).delete(synchronize_session=False)
        db.session.delete(course)
        db.session.commit()
        return jsonify({'message': 'Course and related enrollments deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting course {course_id}: {str(e)}") 
        return jsonify({'error': str(e)}), 500
