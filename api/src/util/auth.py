from src.util.db import db, User
from src.__init__ import login_manager

from flask import Flask, redirect, url_for, abort
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
            abort(403)
    return wrapped_view


def professor_required(view):
    @functools.wraps(view)
    @login_required
    def wrapped_view(**kwargs):
        if not current_user.is_prof():
            abort(403)
        else:
            return view(**kwargs)

    return wrapped_view


def ta_required(view):
    @functools.wraps(view)
    @login_required
    def wrapped_view(**kwargs):
        if not current_user.is_ta():
            abort(403)
        else:
            return view(**kwargs)

    return wrapped_view


def student_required(view):
    @functools.wraps(view)
    @login_required
    def wrapped_view(**kwargs):
        if not current_user.is_student():
            abort(403)
        else:
            return view(**kwargs)

    return wrapped_view
