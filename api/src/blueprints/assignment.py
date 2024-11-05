from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
from src.util.db import db, Assignment

assignment_bp = Blueprint('assignment', __name__)

# Create a new assignment (POST)
@assignment_bp.route('/assignments', methods=['POST'])
def create_assignment():
    data = request.get_json()

    if not data or not data.get('title') or not data.get('course_id'):
        return jsonify({'error': 'Title and course ID are required'}), 400

    # Validate UUID format for course_id
    try:
        uuid.UUID(data['course_id'])
    except ValueError:
        return jsonify({'error': 'Invalid UUID format for course_id'}), 400

    new_assignment = Assignment(
        course_id=data['course_id'],
        title=data['title'],
        description=data.get('description'),
        due_at=data.get('due_at')
    )

    try:
        db.session.add(new_assignment)
        db.session.commit()
        return jsonify({'message': 'Assignment created successfully', 'assignment_id': str(new_assignment.assignment_id)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all assignments (GET)
@assignment_bp.route('/assignments', methods=['GET'])
def get_assignments():
    assignments = db.session.scalars(db.select(Assignment)).all()
    assignments_list = [{
        'assignment_id': str(assignment.assignment_id),
        'course_id': str(assignment.course_id),
        'title': assignment.title,
        'description': assignment.description,
        'due_at': assignment.due_at
    } for assignment in assignments]

    return jsonify(assignments_list), 200

# Get a specific assignment (GET)
@assignment_bp.route('/assignments/<uuid:assignment_id>', methods=['GET'])
def get_assignment(assignment_id):
    assignment = db.session.get(Assignment, assignment_id)
    if assignment is None:
        return jsonify({'error': 'Assignment not found'}), 404

    return jsonify({
        'assignment_id': str(assignment.assignment_id),
        'course_id': str(assignment.course_id),
        'title': assignment.title,
        'description': assignment.description,
        'due_at': assignment.due_at
    }), 200

# Update an assignment (PUT)
@assignment_bp.route('/assignments/<uuid:assignment_id>', methods=['PUT'])
def update_assignment(assignment_id):
    assignment = db.session.get(Assignment, assignment_id)
    if assignment is None:
        return jsonify({'error': 'Assignment not found'}), 404

    data = request.get_json()
    assignment.title = data.get('title', assignment.title)
    assignment.description = data.get('description', assignment.description)
    assignment.due_at = data.get('due_at', assignment.due_at)

    try:
        db.session.commit()
        return jsonify({'message': 'Assignment updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete an assignment (DELETE)
@assignment_bp.route('/assignments/<uuid:assignment_id>', methods=['DELETE'])
def delete_assignment(assignment_id):
    assignment = db.session.get(Assignment, assignment_id)
    if assignment is None:
        return jsonify({'error': 'Assignment not found'}), 404

    try:
        db.session.delete(assignment)
        db.session.commit()
        return jsonify({'message': 'Assignment deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
