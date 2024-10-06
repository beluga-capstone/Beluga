import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://username:password@localhost:port/DBNAME')
    SQLALCHEMY_TRACK_MODIFICATIONS = False