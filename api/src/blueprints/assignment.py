from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
from src.util.db import db, Assignment

assignment_bp = Blueprint('assignment', __name__)

# Helper function to validate UUIDs
def validate_uuid(id_str):
    try:
        uuid.UUID(id_str)
        return True
    except ValueError:
        return False

def parse_date(date_str):
    if not date_str:
        return None
        
    try:
        date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
        # Optional: Add validation for reasonable date range
        if date.year > 9999 or date.year < 1900:
            raise ValueError("Date must be between years 1900 and 9999")
        return date.isoformat() + "Z"
    except ValueError as e:
        raise ValueError(f"Invalid date format or range: {str(e)}")

# Create a new assignment (POST)
@assignment_bp.route('/assignments', methods=['POST'])
def create_assignment():
    data = request.get_json()

    # Validate required fields
    if not data or not data.get('title') or not data.get('course_id'):
        return jsonify({'error': 'Title and course ID are required'}), 400

    # Validate UUID format for course_id and user_id if provided
    if not validate_uuid(data['course_id']):
        return jsonify({'error': 'Invalid UUID format for courseId'}), 400
    if 'user_id' in data and not validate_uuid(data['user_id']):
        return jsonify({'error': 'Invalid UUID format for userId'}), 400

    # Convert date fields if provided
    due_at = parse_date(data.get('due_at'))
    lock_at = parse_date(data.get('lock_at'))
    unlock_at = parse_date(data.get('unlock_at'))

    try:
        new_assignment = Assignment(
            course_id=data['course_id'],
            title=data['title'],
            description=data.get('description'),
            due_at=due_at,
            lock_at=lock_at,
            unlock_at=unlock_at,
            user_id=data.get('user_id'),
            docker_image_id=data.get('docker_image_id')
        )

        db.session.add(new_assignment)
        db.session.commit()
        return jsonify({
            'message': 'Assignment created successfully',
            'assignment_id': str(new_assignment.assignment_id)
        }), 201
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
        'due_at': assignment.due_at.isoformat() if assignment.due_at else None,
        'lock_at': assignment.lock_at.isoformat() if assignment.lock_at else None,
        'unlock_at': assignment.unlock_at.isoformat() if assignment.unlock_at else None,
        'user_id': str(assignment.user_id) if assignment.user_id else None,
        'docker_image_id': assignment.docker_image_id
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
        'due_at': assignment.due_at.isoformat() if assignment.due_at else None,
        'lock_at': assignment.lock_at.isoformat() if assignment.lock_at else None,
        'unlock_at': assignment.unlock_at.isoformat() if assignment.unlock_at else None,
        'user_id': str(assignment.user_id) if assignment.user_id else None,
        'docker_image_id': assignment.docker_image_id
    }), 200

@assignment_bp.route('/assignments/<uuid:assignment_id>', methods=['PUT'])
def update_assignment(assignment_id):
    assignment = db.session.get(Assignment, assignment_id)
    if assignment is None:
        return jsonify({'error': 'Assignment not found'}), 404

    data = request.get_json()

    try:
        # Update assignment fields
        assignment.title = data.get('title')
        assignment.description = data.get('description')

        # Update date fields
        if 'due_at' in data:
            assignment.due_at = parse_date(data.get('due_at'))
        if 'lock_at' in data:
            assignment.lock_at = parse_date(data.get('lock_at'))
        if 'unlock_at' in data:
            assignment.unlock_at = parse_date(data.get('unlock_at'))

        if 'user_id' in data:
            assignment.user_id = data.get('userId')

        assignment.docker_image_id = data.get('docker_image_id')

        # Commit changes to the database
        db.session.commit()

        # Prepare updated assignment data to return
        updated_assignment = {
            'assignment_id': str(assignment.assignment_id),
            'course_id': str(assignment.course_id),
            'title': assignment.title,
            'description': assignment.description,
            'due_at': assignment.due_at.isoformat() if assignment.due_at else None,
            'lock_at': assignment.lock_at.isoformat() if assignment.lock_at else None,
            'unlock_at': assignment.unlock_at.isoformat() if assignment.unlock_at else None,
            'user_id': assignment.user_id,
            'docker_image_id': assignment.docker_image_id,
            'isUnlocked': datetime.now() >= assignment.unlock_at if assignment.unlock_at else False,
            'isPublished': datetime.now() >= assignment.due_at if assignment.due_at else False,
            'publishAt': assignment.due_at.isoformat() if assignment.lock_at else None,
        }

        return jsonify({
            'message': 'Assignment updated successfully',
            'updatedAssignment': updated_assignment
        }), 200

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
