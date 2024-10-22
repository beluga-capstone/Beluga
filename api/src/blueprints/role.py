from flask import Blueprint, request, jsonify
from src.util.db import db, Role
from datetime import datetime

role_bp = Blueprint('role', __name__)

# Create a new role (POST)
@role_bp.route('/roles', methods=['POST'])
def create_role():
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Role name is required'}), 400
    
    new_role = Role(
        name=data['name'],
        permission=data.get('permission', ''),
        description=data.get('description', ''),
        user_create=data.get('user_create')
    )
    
    try:
        db.session.add(new_role)
        db.session.commit()
        return jsonify({'message': 'Role created successfully', 'role_id': new_role.role_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Read all roles (GET)
@role_bp.route('/roles', methods=['GET'])
def get_roles():
    roles = Role.query.all()
    roles_list = [{
        'role_id': role.role_id,
        'name': role.name,
        'permission': role.permission,
        'description': role.description,
        'user_create': role.user_create,
        'created_at': role.created_at,
        'updated_at': role.updated_at
    } for role in roles]
    
    return jsonify(roles_list), 200

# Read a single role by ID (GET)
@role_bp.route('/roles/<int:role_id>', methods=['GET'])
def get_role(role_id):
    role = Role.query.get_or_404(role_id)
    
    return jsonify({
        'role_id': role.role_id,
        'name': role.name,
        'permission': role.permission,
        'description': role.description,
        'user_create': role.user_create,
        'created_at': role.created_at,
        'updated_at': role.updated_at
    }), 200

# Update a role (PUT)
@role_bp.route('/roles/<int:role_id>', methods=['PUT'])
def update_role(role_id):
    role = Role.query.get_or_404(role_id)
    data = request.get_json()
    
    role.name = data.get('name', role.name)
    role.permission = data.get('permission', role.permission)
    role.description = data.get('description', role.description)
    role.updated_at = datetime.now()
    
    try:
        db.session.commit()
        return jsonify({'message': 'Role updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a role (DELETE)
@role_bp.route('/roles/<int:role_id>', methods=['DELETE'])
def delete_role(role_id):
    role = Role.query.get_or_404(role_id)
    
    try:
        db.session.delete(role)
        db.session.commit()
        return jsonify({'message': 'Role deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
