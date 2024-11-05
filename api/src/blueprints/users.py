from flask import Blueprint, request, jsonify
from src.util.db import db, User
from datetime import datetime
import uuid

users_bp = Blueprint('users', __name__)

# Create User (POST)
@users_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('email'):
        return jsonify({'error': 'Username and email are required'}), 400
    
    new_user = User(
        username=data['username'],
        email=data['email'],
        first_name=data.get('first_name'),
        middle_name=data.get('middle_name'),
        last_name=data.get('last_name'),
        role_id=data.get('role_id')
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully', 'user_id': str(new_user.user_id)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Read All Users (GET)
@users_bp.route('/users', methods=['GET'])
def get_users():
    users = db.session.scalars(db.select(User)).all()
    users_list = []
    for user in users:
        users_list.append({
            'user_id': str(user.user_id),
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'middle_name': user.middle_name,
            'last_name': user.last_name,
            'role_id': str(user.role_id) if user.role_id else None,
            'created_at': user.created_at,
            'updated_at': user.update_at
        })
    return jsonify(users_list), 200

# Read User by ID (GET)
@users_bp.route('/users/<uuid:user_id>', methods=['GET'])
def get_user(user_id):
    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404

    user_data = {
        'user_id': str(user.user_id),
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'middle_name': user.middle_name,
        'last_name': user.last_name,
        'role_id': str(user.role_id) if user.role_id else None,
        'created_at': user.created_at,
        'updated_at': user.update_at
    }
    return jsonify(user_data), 200

# Update User (PUT)
@users_bp.route('/users/<uuid:user_id>', methods=['PUT'])
def update_user(user_id):
    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    # Update user fields
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.first_name = data.get('first_name', user.first_name)
    user.middle_name = data.get('middle_name', user.middle_name)
    user.last_name = data.get('last_name', user.last_name)
    user.role_id = data.get('role_id', user.role_id)
    user.update_at = datetime.now()

    try:
        db.session.commit()
        return jsonify({'message': 'User updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete User (DELETE)
@users_bp.route('/users/<uuid:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
