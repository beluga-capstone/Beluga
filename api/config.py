import os

class BaseConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://root:temppassword@localhost:5432/beluga')    
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class TestingConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://postgres:temppassword@localhost:5433/your_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TESTING = True

config_options = {
    'default': BaseConfig,
    'testing': TestingConfig,
}