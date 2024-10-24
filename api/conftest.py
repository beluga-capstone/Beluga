import os
import sys

os.chdir(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))


import pytest
from src import create_app 
from src.util.db import db  


@pytest.fixture(scope='module')
def test_client():
    #app = create_app('testing')
    app = create_app()  
    with app.test_client() as testing_client:
        with app.app_context():
            db.create_all()  
        yield testing_client  
        db.drop_all()  
