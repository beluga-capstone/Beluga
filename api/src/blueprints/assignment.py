from flask import Blueprint, request, jsonify
from datetime import datetime
from src.util.db import db, Assignment

assignment_bp = Blueprint('assignment', __name__)

# Create a new assignment (POST)
@assignment_bp.route('/assignments', methods=['POST'])
def create_assignment():
    data = request.get_json()

    if not data or not data.get('title') or not data.get('course_id'):
        return jsonify({'error': 'Title and course ID are required'}), 400
    
    new_assignment = Assignment(
        course_id=data['course_id'],
        title=data['title'],
        description=data.get('description'),
        due_at=data.get('due_at'),
        lock_at=data.get('lock_at'),
        unlock_at=data.get('unlock_at'),
        user_id=data.get('user_id'),
        docker_image_id=data.get('docker_image_id')
    )

    try:
        db.session.add(new_assignment)
        db.session.commit()
        return jsonify({'message': 'Assignment created successfully', 'assignment_id': new_assignment.assignment_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all assignments (GET)
@assignment_bp.route('/assignments', methods=['GET'])
def get_assignments():
    assignments = Assignment.query.all()
    assignments_list = [{
        'assignment_id': assignment.assignment_id,
        'course_id': assignment.course_id,
        'title': assignment.title,
        'description': assignment.description,
        'due_at': assignment.due_at,
        'lock_at': assignment.lock_at,
        'unlock_at': assignment.unlock_at,
        'user_id': assignment.user_id,
        'docker_image_id': assignment.docker_image_id
    } for assignment in assignments]

    return jsonify(assignments_list), 200

# Get a specific assignment (GET)
@assignment_bp.route('/assignments/<int:assignment_id>', methods=['GET'])
def get_assignment(assignment_id):
    assignment = Assignment.query.get_or_404(assignment_id)

    return jsonify({
        'assignment_id': assignment.assignment_id,
        'course_id': assignment.course_id,
        'title': assignment.title,
        'description': assignment.description,
        'due_at': assignment.due_at,
        'lock_at': assignment.lock_at,
        'unlock_at': assignment.unlock_at,
        'user_id': assignment.user_id,
        'docker_image_id': assignment.docker_image_id
    }), 200

# Update an assignment (PUT)
@assignment_bp.route('/assignments/<int:assignment_id>', methods=['PUT'])
def update_assignment(assignment_id):
    assignment = Assignment.query.get_or_404(assignment_id)
    data = request.get_json()

    assignment.title = data.get('title', assignment.title)
    assignment.description = data.get('description', assignment.description)
    assignment.due_at = data.get('due_at', assignment.due_at)
    assignment.lock_at = data.get('lock_at', assignment.lock_at)
    assignment.unlock_at = data.get('unlock_at', assignment.unlock_at)
    assignment.user_id = data.get('user_id', assignment.user_id)
    assignment.docker_image_id = data.get('docker_image_id', assignment.docker_image_id)

    try:
        db.session.commit()
        return jsonify({'message': 'Assignment updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete an assignment (DELETE)
@assignment_bp.route('/assignments/<int:assignment_id>', methods=['DELETE'])
def delete_assignment(assignment_id):
    assignment = Assignment.query.get_or_404(assignment_id)

    try:
        db.session.delete(assignment)
        db.session.commit()
        return jsonify({'message': 'Assignment deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
