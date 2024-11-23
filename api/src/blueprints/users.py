import os
import subprocess
import shutil

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from datetime import datetime
import uuid

from src.util.auth import admin_required
from src.util.db import db, User
from src.util.auth import *


users_bp = Blueprint('users', __name__)

BASE_KEY_PATH = os.path.join(os.path.expanduser("~"), "beluga_data", "keys")

def create_ssh_key_pair(user_id):
    key_dir = os.path.join(BASE_KEY_PATH, str(user_id))
    private_key_path = os.path.join(key_dir, "id_rsa")
    public_key_path = os.path.join(key_dir, "id_rsa.pub")
    
    try:
        os.makedirs(key_dir, exist_ok=True)
        
        subprocess.run(
            ["ssh-keygen", "-t", "ed25519", "-f", private_key_path, "-q", "-N", ""],
            check=True
        )
        
        return {
            "private_key_path": private_key_path,
            "public_key_path": public_key_path
        }
    except Exception as e:
        print(f"Error generating SSH keys: {e}")
        return None


# Create User (POST)
@users_bp.route('/users', methods=['POST'])
@login_required
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

        key_paths = create_ssh_key_pair(new_user.user_id)
        if key_paths is None:
            return jsonify({'message': 'User created, but SSH key generation failed'}), 201
        
        with open(key_paths['private_key_path'], 'r') as f:
            private_key = f.read().strip()
        
        os.remove(key_paths['private_key_path'])

        return jsonify({
            'message': 'User created successfully',
            'user_id': str(new_user.user_id),
            'private_key': private_key
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Read All Users (GET)
@users_bp.route('/users', methods=['GET'])
@admin_required
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
@admin_required
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
@login_required
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
@professor_required
def delete_user(user_id):
    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    
    try:
        db.session.delete(user)
        db.session.commit()

        shutil.rmtree(os.path.join(BASE_KEY_PATH, str(user_id)))

        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@users_bp.route('/users/profile', methods=['GET'])
@login_required
def get_current_user():
    user = db.session.get(User, current_user.user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    
    user_data = {
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'middle_name': user.middle_name,
        'last_name': user.last_name,
        'role_id': user.role_id,
        'created_at': user.created_at,  
        'updated_at': user.update_at
    }
    return jsonify(user_data), 200
