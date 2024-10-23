import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://root:temppassword@localhost:5432/beluga')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
