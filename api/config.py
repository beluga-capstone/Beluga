import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://root:temppassword@localhost:5432/beluga')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv('TEST_DATABASE_URI', 'sqlite:///:memory:')  # Use in-memory SQLite for tests


config_options = {
    #'development': DevelopmentConfig,
    'testing': TestingConfig,
    #'production': ProductionConfig,
}