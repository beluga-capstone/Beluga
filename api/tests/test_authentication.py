# tests/test_authentication.py
import pytest

@pytest.mark.disable_auth_mock
def test_authentication_redirects(test_client):
    response = test_client.get(f'/auth/logout')
    assert response.status_code == 302
    assert '/auth/login' in response.headers['Location'] # Redirects to login

def test_authenticated_profile(test_client, ):
    response = test_client.get('/users/profile')
    assert response.status_code == 200
