from flask import Blueprint, request, jsonify
from src.util.db import db, Comment
from datetime import datetime

comment_bp = Blueprint('comment', __name__)

# Create a new comment (POST)
@comment_bp.route('/comments', methods=['POST'])
def create_comment():
    data = request.get_json()

    if not data or not data.get('user_id') or not data.get('submission_id'):
        return jsonify({'error': 'User ID and Submission ID are required'}), 400

    new_comment = Comment(
        user_id=data['user_id'],
        submission_id=data['submission_id'],
        create_at=data.get('create_at', datetime.now()),
        update_at=data.get('update_at', datetime.now()),
        text=data.get('text'),
        reply_id=data.get('reply_id'),
        publish=data.get('publish', False)
    )

    try:
        db.session.add(new_comment)
        db.session.commit()
        return jsonify({'message': 'Comment created successfully', 'comment_id': new_comment.comment_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all comments (GET)
@comment_bp.route('/comments', methods=['GET'])
def get_comments():
    comments = Comment.query.all()
    comments_list = [{
        'comment_id': comment.comment_id,
        'user_id': comment.user_id,
        'submission_id': comment.submission_id,
        'create_at': comment.create_at,
        'update_at': comment.update_at,
        'text': comment.text,
        'publish': comment.publish
    } for comment in comments]

    return jsonify(comments_list), 200

# Get a specific comment (GET)
@comment_bp.route('/comments/<int:comment_id>', methods=['GET'])
def get_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)

    return jsonify({
        'comment_id': comment.comment_id,
        'user_id': comment.user_id,
        'submission_id': comment.submission_id,
        'create_at': comment.create_at,
        'update_at': comment.update_at,
        'text': comment.text,
        'publish': comment.publish
    }), 200

# Update a comment (PUT)
@comment_bp.route('/comments/<int:comment_id>', methods=['PUT'])
def update_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    data = request.get_json()

    comment.user_id = data.get('user_id', comment.user_id)
    comment.submission_id = data.get('submission_id', comment.submission_id)
    comment.create_at = data.get('create_at', comment.create_at)
    comment.update_at = data.get('update_at', comment.update_at)
    comment.text = data.get('text', comment.text)
    comment.publish = data.get('publish', comment.publish)

    try:
        db.session.commit()
        return jsonify({'message': 'Comment updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a comment (DELETE)
@comment_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)

    try:
        db.session.delete(comment)
        db.session.commit()
        return jsonify({'message': 'Comment deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
