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
