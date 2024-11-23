import os
import subprocess

from flask import current_app
from src.util.db import db, User

def create_ssh_key_pair(user_id):
    key_dir = os.path.join(current_app.config["BASE_KEY_PATH"], str(user_id))
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

def create_user_helper(username, email, first_name=None, middle_name=None, last_name=None, role_id=None):
    new_user = User(
        username=username,
        email=email,
        first_name=first_name,
        middle_name=middle_name,
        last_name=last_name,
        role_id=role_id
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()

        key_paths = create_ssh_key_pair(new_user.user_id)
        if key_paths is None:
            return {
                'message': 'User created, but SSH key generation failed',
                'user_id': str(new_user.user_id),
                'private_key': None
            }, 201

        return {
            'message': 'User created successfully',
            'user_id': str(new_user.user_id)
        }, 201
    except Exception as e:
        db.session.rollback()
        return {'error': str(e)}, 500