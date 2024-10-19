from flask import Blueprint, request, jsonify
from src.util.db import db, Term, Course

term_bp = Blueprint('term', __name__)

# Create a new term (POST)
@term_bp.route('/terms', methods=['POST'])
def create_term():
    data = request.get_json()

    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    
    new_term = Term(name=data['name'])

    try:
        db.session.add(new_term)
        db.session.commit()
        return jsonify({'message': 'Term created successfully', 'term_id': new_term.term_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all terms (GET)
@term_bp.route('/terms', methods=['GET'])
def get_terms():
    terms = Term.query.all()
    terms_list = [{
        'term_id': term.term_id,
        'name': term.name
    } for term in terms]

    return jsonify(terms_list), 200

# Get a specific term (GET)
@term_bp.route('/terms/<int:term_id>', methods=['GET'])
def get_term(term_id):
    term = Term.query.get_or_404(term_id)

    return jsonify({
        'term_id': term.term_id,
        'name': term.name
    }), 200

# Update a term (PUT)
@term_bp.route('/terms/<int:term_id>', methods=['PUT'])
def update_term(term_id):
    term = Term.query.get_or_404(term_id)
    data = request.get_json()

    term.name = data.get('name', term.name)

    try:
        db.session.commit()
        return jsonify({'message': 'Term updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a term (DELETE)
@term_bp.route('/terms/<int:term_id>', methods=['DELETE'])
def delete_term(term_id):
    term = Term.query.get_or_404(term_id)

    try:
        db.session.delete(term)
        db.session.commit()
        return jsonify({'message': 'Term deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
