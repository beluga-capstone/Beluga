from flask import Blueprint, request, jsonify
from src.util.db import db, Term
from datetime import datetime
import uuid
from src.util.auth import *

term_bp = Blueprint('term', __name__)

# Create a new term (POST)
@term_bp.route('/terms', methods=['POST'])
@admin_required
def create_term():
    data = request.get_json()

    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    
    new_term = Term(name=data['name'])

    try:
        db.session.add(new_term)
        db.session.commit()
        return jsonify({'message': 'Term created successfully', 'term_id': str(new_term.term_id)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all terms (GET)
@term_bp.route('/terms', methods=['GET'])
@login_required
def get_terms():
    terms = db.session.scalars(db.select(Term)).all()
    terms_list = [{
        'term_id': str(term.term_id),
        'name': term.name
    } for term in terms]

    return jsonify(terms_list), 200

# Get a specific term (GET)
@term_bp.route('/terms/<uuid:term_id>', methods=['GET'])
@login_required
def get_term(term_id):
    term = db.session.get(Term, term_id)
    if term is None:
        return jsonify({'error': 'Term not found'}), 404

    return jsonify({
        'term_id': str(term.term_id),
        'name': term.name
    }), 200

# Update a term (PUT)
@term_bp.route('/terms/<uuid:term_id>', methods=['PUT'])
@admin_required
def update_term(term_id):
    term = db.session.get(Term, term_id)
    if term is None:
        return jsonify({'error': 'Term not found'}), 404

    data = request.get_json()
    term.name = data.get('name', term.name)

    try:
        db.session.commit()
        return jsonify({'message': 'Term updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a term (DELETE)
@term_bp.route('/terms/<uuid:term_id>', methods=['DELETE'])
@admin_required
def delete_term(term_id):
    term = db.session.get(Term, term_id)
    if term is None:
        return jsonify({'error': 'Term not found'}), 404

    try:
        db.session.delete(term)
        db.session.commit()
        return jsonify({'message': 'Term deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
