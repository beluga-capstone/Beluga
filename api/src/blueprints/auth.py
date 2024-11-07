#"""Flask blueprint for Authentication endpoint definitions"""
from src.__init__ import db, login_manager
from src.util.db import User

from flask import Blueprint, flash, redirect, render_template, request, session, url_for, current_app, abort
from flask_sqlalchemy import SQLAlchemy
from flask_login import login_required, current_user, login_user, logout_user
from urllib.parse import urlencode

import functools
import secrets
import requests


auth_bp = Blueprint('auth', __name__, url_prefix='/auth') 


@auth_bp.route('/login', methods=['GET'])
def login():
    return redirect(url_for('auth.oauth_authorize', provider='google'))

@auth_bp.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    flash('You have been logged out.')
    return redirect('/auth/login')


@auth_bp.route('/authorize/<provider>')
def oauth_authorize(provider):
    if not current_user.is_anonymous:
        return redirect('/')

    provider_config = current_app.config['OAUTH2_PROVIDERS'].get(provider)
    if provider_config is None:
        abort(404)

    session['oauth_state'] = secrets.token_urlsafe(16)

    query = urlencode({
        'client_id': provider_config['client_id'],
        'redirect_uri': url_for('auth.oauth_callback', provider=provider, _external=True),
        'response_type': 'code',
        'scope': ' '.join(provider_config['scopes']),
        'state': session['oauth_state'],
    })

    return redirect(provider_config['authorize_url'] + '?' + query)


@auth_bp.route('/callback/<provider>')
def oauth_callback(provider):
    if not current_user.is_anonymous:
        return redirect('/') # Change to users home

    provider_config = current_app.config['OAUTH2_PROVIDERS'].get(provider)
    if provider_config is None:
        abort(404)

    if 'error' in request.args:
        for key, val in request.args.items():
            if key.startswith('error'):
                flash(f'{key}: {val}')

        return redirect('/auth/login')

    if request.args['state'] != session.get('oauth_state'):
        abort(401)

    if 'code' not in request.args:
        abort(401)

    res = requests.post(provider_config['token_url'], data={
        'client_id': provider_config['client_id'],
        'client_secret': provider_config['client_secret'],
        'code': request.args['code'],
        'grant_type': 'authorization_code',
        'redirect_uri': url_for('auth.oauth_callback', provider=provider, _external=True),
        }, headers={'Accept': 'application/json'}
    )

    if res.status_code != 200:
        abort(401)

    oauth_token = res.json().get('access_token')
    if not oauth_token:
        abort(401)

    res = requests.get(provider_config['userinfo']['url'], headers={
        'Authorization': 'Bearer ' + oauth_token,
        'Accept': 'application/json',
    })

    if res.status_code != 200:
        abort(401)

    email = provider_config['userinfo']['email'](res.json())
    fname = provider_config['userinfo']['given_name'](res.json())
    lname = provider_config['userinfo']['family_name'](res.json())
    username = provider_config['userinfo']['username'](res.json())
    role = 8

    user = User.query.filter_by(email=email).first()

    if user:
        login_user(user)
        flash('Login successful', 'success')
        return redirect('/')
    else:
        user = User(username=username, email=email, first_name=fname, last_name=lname, role_id=role)
        db.session.add(user)
        db.session.commit()
        login_user(user)
        flash('Login successful', 'success')
        return redirect('/')
