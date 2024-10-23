import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://username:password@localhost:port/DBNAME')
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv('TEST_DATABASE_URI', 'sqlite:///:memory:')  # Use in-memory SQLite for tests


config_options = {
    #'development': DevelopmentConfig,
    'testing': TestingConfig,
    #'production': ProductionConfig,
}