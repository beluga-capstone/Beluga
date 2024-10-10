from flask import Blueprint, request, jsonify
from datetime import datetime
from src.util.db import db, Reply

reply_bp = Blueprint('reply', __name__)

# Create a new reply (POST)
@reply_bp.route('/replies', methods=['POST'])
def create_reply():
    data = request.get_json()

    if not data or not data.get('user_id') or not data.get('comment_id'):
        return jsonify({'error': 'User ID and Comment ID are required'}), 400

    new_reply = Reply(
        user_id=data['user_id'],
        comment_id=data['comment_id'],
        text=data.get('text'),
        create_at=datetime.now(),
        update_at=datetime.now()
    )

    try:
        db.session.add(new_reply)
        db.session.commit()
        return jsonify({'message': 'Reply created successfully', 'reply_id': new_reply.reply_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all replies (GET)
@reply_bp.route('/replies', methods=['GET'])
def get_replies():
    replies = Reply.query.all()
    replies_list = [{
        'reply_id': reply.reply_id,
        'user_id': reply.user_id,
        'comment_id': reply.comment_id,
        'text': reply.text,
        'create_at': reply.create_at,
        'update_at': reply.update_at
    } for reply in replies]

    return jsonify(replies_list), 200

# Get a specific reply (GET)
@reply_bp.route('/replies/<int:reply_id>', methods=['GET'])
def get_reply(reply_id):
    reply = Reply.query.get_or_404(reply_id)

    return jsonify({
        'reply_id': reply.reply_id,
        'user_id': reply.user_id,
        'comment_id': reply.comment_id,
        'text': reply.text,
        'create_at': reply.create_at,
        'update_at': reply.update_at
    }), 200

# Update a reply (PUT)
@reply_bp.route('/replies/<int:reply_id>', methods=['PUT'])
def update_reply(reply_id):
    reply = Reply.query.get_or_404(reply_id)
    data = request.get_json()

    reply.user_id = data.get('user_id', reply.user_id)
    reply.comment_id = data.get('comment_id', reply.comment_id)
    reply.text = data.get('text', reply.text)
    reply.update_at = datetime.now()

    try:
        db.session.commit()
        return jsonify({'message': 'Reply updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a reply (DELETE)
@reply_bp.route('/replies/<int:reply_id>', methods=['DELETE'])
def delete_reply(reply_id):
    reply = Reply.query.get_or_404(reply_id)

    try:
        db.session.delete(reply)
        db.session.commit()
        return jsonify({'message': 'Reply deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Reply Model
class Reply(db.Model):
    __tablename__ = 'reply'
    reply_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.comment_id'))
    text = db.Column(db.Text)
    create_at = db.Column(db.DateTime, default=datetime.now)
    update_at = db.Column(db.DateTime, default=datetime.now)
