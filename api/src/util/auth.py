from src.util.db import db, User
from src.__init__ import login_manager

from flask import Flask, redirect, url_for
from flask_login import current_user, login_required

import functools
import re


def admin_required(view):
    @functools.wraps(view)
    @login_required
    def wrapped_view(**kwargs):
        if current_user.is_admin():
            return view(**kwargs)
        else:
            return redirect(url_for('auth.oauth_authorize', provider='google'))
    return wrapped_view


def professor_required(view):
    @functools.wraps(view)
    @login_required
    def wrapped_view(**kwargs):
        if not current_user.is_prof():
            return redirect(url_for('auth.oauth_authorize', provider='google'))
        else:
            return view(**kwargs)

    return wrapped_view


def ta_required(view):
    @functools.wraps(view)
    @login_required
    def wrapped_view(**kwargs):
        if not current_user.is_ta():
            return redirect(url_for('auth.oauth_authorize', provider='google'))
        else:
            return view(**kwargs)

    return wrapped_view


def student_required(view):
    @functools.wraps(view)
    @login_required
    def wrapped_view(**kwargs):
        if not current_user.is_student():
            return redirect(url_for('auth.oauth_authorize', provider='google'))
        else:
            return view(**kwargs)

    return wrapped_view
