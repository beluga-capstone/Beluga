import os

class BaseConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://root:temppassword@localhost:5432/beluga')    
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class TestingConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://postgres:temppassword@db:5432/your_db')
    TESTING = True

config_options = {
    'default': BaseConfig,
    'testing': TestingConfig,
}