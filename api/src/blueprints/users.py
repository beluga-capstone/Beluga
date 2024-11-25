import os
import shutil

from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from datetime import datetime
import uuid

from src.util.util import create_user_helper
from src.util.db import db, User
from src.util.auth import *


users_bp = Blueprint('users', __name__)

# Create User (POST)
@users_bp.route('/users', methods=['POST'])
@login_required
def create_user_or_users():
    try:
        # Parse incoming JSON data
        data = request.get_json()
        
        # Log incoming data for debugging
        print("Received data for user creation:", data)

        # Check if the input is a list (bulk creation)
        if isinstance(data, list):
            new_users = []
            for user_data in data:
                # Validate required fields for each user
                if not user_data.get('email') or not user_data.get('firstName'):
                    raise ValueError(f"Missing required fields for user: {user_data}")

                # Handle role_id correctly
                role = user_data.get('role', "student")  # Default to "student"
                if role == "admin":
                    role_id = 1  # Adjust this mapping based on your database schema
                elif role == "professor":
                    role_id = 2
                elif role == "ta":
                    role_id = 4
                elif role == "student":
                    role_id = 8
                else:
                    raise ValueError(f"Invalid role: {role}")

                new_user = User(
                    username=user_data.get('email').split("@")[0],  # Generate username
                    email=user_data.get('email'),
                    first_name=user_data.get('firstName'),
                    middle_name=user_data.get('middleName', ""),
                    last_name=user_data.get('lastName', ""),
                    role_id=role_id  # Use mapped integer role_id
                )

                result, status_code = create_user_helper(new_user)
                # TODO: double check this works
                new_users.append(new_user)
    
                return jsonify(result), status_code
                
            # Return created users' details
            response_data = [{"user_id": str(user.user_id), "email": user.email} for user in new_users]
            return jsonify(response_data), 201

        # Single user creation if input is not a list
        elif isinstance(data, dict):
            # Validate required fields
            if not data.get('email'):
                return jsonify({'error': 'Username and email are required'}), 400

            # Handle role_id correctly
            role = data.get('role', "student")  # Default to "student"
            if role == "admin":
                role_id = 1  # Adjust this mapping based on your database schema
            elif role == "professor":
                role_id = 2
            elif role == "ta":
                role_id = 4
            elif role == "student":
                role_id = 8
            else:
                raise ValueError(f"Invalid role: {role}")

            # Create a single user object
            new_user = User(
                username=data.get('email').split("@")[0],  # Generate username
                email=data.get('email'),
                first_name=data.get('firstName'),
                middle_name=data.get('middleName', ""),
                last_name=data.get('lastName', ""),
                role_id=role_id  # Use mapped integer role_id
            )

            result, status_code = create_user_helper(new_user)

            return jsonify(result), status_code

        else:
            return jsonify({'error': 'Invalid input format. Expected an object or an array of objects.'}), 400

    except Exception as e:
        print("Error during user creation:", str(e))
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
        # Delete related records in course_enrollment
        print(f"Deleting related enrollments for user {user_id}")
        db.session.execute(
            db.text("DELETE FROM course_enrollment WHERE user_id = :user_id"),
            {"user_id": str(user_id)}
        )

        # Delete the user
        print(f"Deleting user {user_id}")
        db.session.delete(user)
        db.session.commit()

        # Remove associated SSH keys
        try:
            shutil.rmtree(os.path.join(BASE_KEY_PATH, str(user_id)), ignore_errors=True)
            print(f"Deleted SSH keys for user {user_id}.")
        except Exception as e:
            print(f"Error deleting SSH keys: {e}")

        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting user: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@users_bp.route('/users/profile', methods=['GET'])
@login_required
def get_current_user():
    user = db.session.get(User, current_user.user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404

    private_key_path = os.path.join(current_app.config["BASE_KEY_PATH"], str(user.user_id), 'id_rsa')

    try:
        with open(private_key_path, 'r') as f:
            private_key = f.read() + '\n'
    except FileNotFoundError:
        private_key = None 

    user_data = {
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'middle_name': user.middle_name,
        'last_name': user.last_name,
        'role_id': user.role_id,
        'created_at': user.created_at,  
        'updated_at': user.update_at,
        'private_key': private_key
    }
    return jsonify(user_data), 200
