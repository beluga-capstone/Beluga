from flask import Blueprint, request, jsonify
from src.util.db import db, Course, User
from datetime import datetime
import uuid
from src.util.auth import *
from src.util.query_utils import apply_filters
from src.util.policies import *
from src.util.permissions import *

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
        start_at=data.get('start_at'),
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

# Search Courses (GET)
@course_bp.route('/courses/search', methods=['GET'])
@login_required
def search_courses():
    """
    Search for courses based on query parameters.
    Applies dynamic filters and enforces access control policies.
    """
    user = db.session.get(User, current_user.user_id)
    filters = request.args.to_dict()
    
    try:
        # Apply dynamic filters from the frontend
        query = apply_filters(Course, filters)
        
        # Apply ABAC filters based on user permissions
        filtered_query = apply_user_filters(user, 'courses', query)
        
        courses = filtered_query.all()
        
        # Format the response
        courses_list = [{
            'course_id': str(course.course_id),
            'name': course.name,
            'user_id': str(course.user_id) if course.user_id else None,
            'description': course.description,
            'publish': course.publish,
            'start_at': course.start_at,
            'term_id': str(course.term_id) if course.term_id else None,
            'create_at': course.create_at,
            'update_at': course.update_at
        } for course in courses]
        
        return jsonify(courses_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update a course (PUT)
@course_bp.route('/courses/<uuid:course_id>', methods=['PUT'])
@professor_required
def update_course(course_id):
    user = db.session.get(User, current_user.user_id)

    # Fetch the course with access control policies
    course = get_filtered_entity(
        user=user,
        entity_cls=Course,
        entity_id=str(course_id),
        filter_func=filter_courses,
        pk_attr='course_id'
    )
    if course is None:
        return jsonify({'error': 'Access denied or course not found'}), 403


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
    user = db.session.get(User, current_user.user_id)

    # Fetch the course with access control policies
    course = get_filtered_entity(
        user=user,
        entity_cls=Course,
        entity_id=str(course_id),
        filter_func=filter_courses,
        pk_attr='course_id'
    )
    if course is None:
        return jsonify({'error': 'Access denied or course not found'}), 403

    try:
        db.session.delete(course)
        db.session.commit()
        return jsonify({'message': 'Course deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
