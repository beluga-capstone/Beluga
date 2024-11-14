from flask import Blueprint, request, jsonify
from src.util.db import db, Submission
from src.util.query_utils import apply_filters
from datetime import datetime
import uuid

submission_bp = Blueprint('submission', __name__)

# Create a new submission (POST)
@submission_bp.route('/submissions', methods=['POST'])
def create_submission():
    data = request.get_json()

    if not data or not data.get('user_id') or not data.get('assignment_id'):
        return jsonify({'error': 'User ID and Assignment ID are required'}), 400
    
    new_submission = Submission(
        user_id=data['user_id'],
        assignment_id=data['assignment_id'],
        submission_date=data.get('submission_date', datetime.now()),
        grade=data.get('grade'),
        status=data.get('status'),
        data=data.get('data')
    )

    try:
        db.session.add(new_submission)
        db.session.commit()
        return jsonify({'message': 'Submission created successfully', 'submission_id': str(new_submission.submission_id)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Dynamic submission search (GET)
@submission_bp.route('/submissions/search', methods=['GET'])
def search_submissions():
    filters = request.args.to_dict()
    try:
        query = apply_filters(Submission, filters)
        submissions = query.all()
        submissions_list = [{
            'submission_id': str(submission.submission_id),
            'user_id': str(submission.user_id),
            'assignment_id': str(submission.assignment_id),
            'submission_date': submission.submission_date.isoformat() if submission.submission_date else None,
            'grade': submission.grade,
            'status': submission.status,
            'data': submission.data
        } for submission in submissions]

        return jsonify(submissions_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get all submissions (GET)
@submission_bp.route('/submissions', methods=['GET'])
def get_submissions():
    submissions = db.session.scalars(db.select(Submission)).all()
    submissions_list = [{
        'submission_id': str(submission.submission_id),
        'user_id': submission.user_id,
        'assignment_id': submission.assignment_id,
        'submission_date': submission.submission_date,
        'grade': submission.grade,
        'status': submission.status,
        'data': submission.data
    } for submission in submissions]

    return jsonify(submissions_list), 200

# Get a specific submission (GET)
@submission_bp.route('/submissions/<uuid:submission_id>', methods=['GET'])
def get_submission(submission_id):
    submission = db.session.get(Submission, submission_id)
    if submission is None:
        return jsonify({'error': 'Submission not found'}), 404

    return jsonify({
        'submission_id': str(submission.submission_id),
        'user_id': submission.user_id,
        'assignment_id': submission.assignment_id,
        'submission_date': submission.submission_date,
        'grade': submission.grade,
        'status': submission.status,
        'data': submission.data
    }), 200

# Update a submission (PUT)
@submission_bp.route('/submissions/<uuid:submission_id>', methods=['PUT'])
def update_submission(submission_id):
    submission = db.session.get(Submission, submission_id)
    if submission is None:
        return jsonify({'error': 'Submission not found'}), 404

    data = request.get_json()
    submission.user_id = data.get('user_id', submission.user_id)
    submission.assignment_id = data.get('assignment_id', submission.assignment_id)
    submission.submission_date = data.get('submission_date', submission.submission_date)
    submission.grade = data.get('grade', submission.grade)
    submission.status = data.get('status', submission.status)
    submission.data = data.get('data', submission.data)

    try:
        db.session.commit()
        return jsonify({'message': 'Submission updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a submission (DELETE)
@submission_bp.route('/submissions/<uuid:submission_id>', methods=['DELETE'])
def delete_submission(submission_id):
    submission = db.session.get(Submission, submission_id)
    if submission is None:
        return jsonify({'error': 'Submission not found'}), 404

    try:
        db.session.delete(submission)
        db.session.commit()
        return jsonify({'message': 'Submission deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
