from dotenv import load_dotenv
from os import environ, path
from uuid import uuid4


PROJECT_DIR = path.abspath(path.dirname(__file__))
load_dotenv(path.join(PROJECT_DIR, '.env'))


class Config:
    ENVIRONMENT = environ.get('ENVIRONMENT', 'production')

    FLASKAPP = 'app.py'
    DEBUG = environ.get('FLASK_DEBUG')
    SECRET_KEY = environ.get('SECRET_KEY', uuid4().hex)
    FLASK_RUN_PORT = environ.get('FLASK_PORT', 5000)
    FLASK_RUN_HOST = environ.get('FLASK_HOST', '127.0.0.1')

    SQLALCHEMY_DATABASE_URI = environ.get('DATABASE_URI', 'postgresql://root:temppassword@localhost:5432/beluga')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = environ.get("SQLALCHEMY_ECHO")

    OAUTH2_PROVIDERS = {
        'google': {
            'client_id': environ.get('GOOGLE_CLIENT_ID'),
            'client_secret': environ.get('GOOGLE_CLIENT_SECRET'),
            'authorize_url': 'https://accounts.google.com/o/oauth2/auth',
            'token_url': 'https://accounts.google.com/o/oauth2/token',
            'userinfo': {
                'url': 'https://www.googleapis.com/oauth2/v3/userinfo',
                'email': lambda json: json['email'],
            },
            'scopes': ['https://www.googleapis.com/auth/userinfo.email'],
        }
    }
