from flask import Blueprint, request, jsonify
from src.util.db import db, Submission
from src.util.query_utils import apply_filters
from datetime import datetime
import uuid
from src.util.auth import *
from src.util.policies import filter_submissions

submission_bp = Blueprint('submission', __name__)

# Create a new submission (POST)
@submission_bp.route('/submissions', methods=['POST'])
@student_required
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

@submission_bp.route('/submissions/search', methods=['GET'])
@login_required
def search_submissions():
    user = db.session.get(User, current_user.user_id)
    filters = request.args.to_dict()  # Parse query parameters for additional filters

    try:
        query = apply_filters(Submission, filters)  # Apply dynamic filters
        filtered_query = filter_submissions(user, query)  # Apply ABAC filters
        submissions = filtered_query.all()

        # Format the response
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
@admin_required
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
@login_required
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
@student_required
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
@student_required
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

# Get route for get latest submisson for a user
@submission_bp.route('/submissions/user/<uuid:user_id>/latest', methods=['GET'])
@login_required
def get_latest_submission(user_id):
    try:
        latest_submission = (Submission.query
                             .filter_by(user_id=user_id)
                             .order_by(Submission.submission_date.desc())
                             .first())

        if not latest_submission:
            submission_data = {
                'submission_id': '',
                'user_id': user_id,
                'assignment_id': '',
                'submission_date': None,
                'grade': None,
                'status': None,
                'data': None
            }
            return jsonify(submission_data), 200

        submission_data = {
            'submission_id': str(latest_submission.submission_id),
            'user_id': str(latest_submission.user_id),
            'assignment_id': str(latest_submission.assignment_id),
            'submission_date': latest_submission.submission_date.isoformat() if latest_submission.submission_date else None,
            'grade': latest_submission.grade,
            'status': latest_submission.status,
            'data': latest_submission.data
        }

        return jsonify(submission_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get route for get latest submisson for a user for an assignemtn
@submission_bp.route('/submissions/user/<uuid:user_id>/assignment/<uuid:assignment_id>/latest', methods=['GET'])
@login_required
def get_latest_submission_by_user_and_assignment(user_id, assignment_id):
    try:
        latest_submission = (Submission.query
                             .filter_by(user_id=user_id, assignment_id=assignment_id)
                             .order_by(Submission.submission_date.desc())
                             .first())

        if not latest_submission:
            submission_data = {
                'submission_id': '',
                'user_id': user_id,
                'assignment_id': assignment_id,
                'submission_date': None,
                'grade': None,
                'status': None,
                'data': None
            }
            return jsonify(submission_data), 200

        submission_data = {
            'submission_id': str(latest_submission.submission_id),
            'user_id': str(latest_submission.user_id),
            'assignment_id': str(latest_submission.assignment_id),
            'submission_date': latest_submission.submission_date.isoformat() if latest_submission.submission_date else None,
            'grade': latest_submission.grade,
            'status': latest_submission.status,
            'data': latest_submission.data
        }

        return jsonify(submission_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@submission_bp.route('/submissions/assignment/<assignment_id>/count', methods=['GET'])
@login_required
def get_submission_count_by_assignment(assignment_id):
    try:
        submission_count = Submission.query.filter_by(assignment_id=assignment_id).count()

        return jsonify({'assignment_id': assignment_id, 'submission_count': submission_count}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@submission_bp.route('/submissions/<uuid:submission_id>/update/var', methods=['PUT'])
@student_required
def update_submission_field(submission_id):
    submission = db.session.get(Submission, submission_id)
    if submission is None:
        return jsonify({'error': 'Submission not found'}), 404

    data = request.get_json()

    if 'grade' in data:
        new_grade = data.get('grade')
        submission.grade = new_grade

    if 'status' in data:
        new_status = data.get('status')
        submission.status = new_status

    try:
        db.session.commit()
        return jsonify({'message': 'Submission updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@submission_bp.route('/submissions/user/<uuid:user_id>/assignment/<uuid:assignment_id>', methods=['GET'])
@student_required
def get_all_submissions(user_id, assignment_id):
    try:
        # Get all submissions matching the user_id and assignment_id
        all_submissions = (
            db.session.query(Submission)
            .filter_by(user_id=user_id, assignment_id=assignment_id)
            .order_by(Submission.submission_date.desc())
            .all()  # Change from `.first()` to `.all()`
        )

        if not all_submissions:
            return jsonify({'message': 'No submissions found'}), 404

        # Prepare the list of submissions to return
        submissions_data = [
            {
                'submission_id': str(submission.submission_id),
                'user_id': str(submission.user_id),
                'assignment_id': str(submission.assignment_id),
                'submission_date': submission.submission_date.isoformat(),
                'grade': submission.grade,
                'status': submission.status,
                'data': submission.data,
            }
            for submission in all_submissions
        ]

        return jsonify(submissions_data), 200
    except ValueError:
        return jsonify({'error': 'Invalid UUID format for user_id or assignment_id'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
