from dotenv import load_dotenv
from os import environ, path
from uuid import uuid4


PROJECT_DIR = path.abspath(path.dirname(__file__))
load_dotenv(path.join(PROJECT_DIR, '.env'))

class Config:
    ENVIRONMENT = environ.get('ENVIRONMENT', 'production')
    BASE_KEY_PATH = path.join(path.expanduser("~"), "beluga_data", "keys")
    FLASKAPP = 'app.py'
    DEBUG = environ.get('FLASK_DEBUG')
    SECRET_KEY = environ.get('SECRET_KEY', uuid4().hex)
    FLASK_RUN_PORT = environ.get('FLASK_PORT', 5000)
    FLASK_RUN_HOST = environ.get('FLASK_HOST', '127.0.0.1')

    SQLALCHEMY_DATABASE_URI = environ.get('DATABASE_URI', 'postgresql://postgres:temppassword@localhost:5432/your_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = environ.get("SQLALCHEMY_ECHO")

    LOGIN_REDIRECT = '/'
    CONTAINER_START_PORT = 8000
    CONTAINER_END_PORT = 18000

    OAUTH2_PROVIDERS = {
        'google': {
            'client_id': environ.get('GOOGLE_CLIENT_ID'),
            'client_secret': environ.get('GOOGLE_CLIENT_SECRET'),
            'authorize_url': 'https://accounts.google.com/o/oauth2/auth',
            'token_url': 'https://accounts.google.com/o/oauth2/token',
            'userinfo': {
                'url': 'https://www.googleapis.com/oauth2/v3/userinfo',
                'email': lambda json: json['email'],
                'given_name': lambda json: json['given_name'],
                'family_name': lambda json: json['family_name'],
                'username': lambda json: json['email'].split('@')[0]
            },
            'scopes': [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ],
        }
    }

class TestingConfig:
    SQLALCHEMY_DATABASE_URI = environ.get('DATABASE_URI', 'postgresql://postgres:temppassword@db:5432/your_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TESTING = True
    LOGIN_REDIRECT='http://localhost:3000'

config_options = {
    'default': Config,
    'testing': TestingConfig,
}
