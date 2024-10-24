import pytest

@pytest.fixture
def term_id(test_client):
    create_data = {
        'name': 'Fall 2024'
    }
    response = test_client.post('/terms', json=create_data)
    assert response.status_code == 201
    assert b'Term created successfully' in response.data
    return response.get_json()['term_id']

def test_update_term(test_client, term_id):
    update_data = {
        'name': 'Summer 2025'
    }
    update_response = test_client.put(f'/terms/{term_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Term updated successfully' in update_response.data

def test_get_term(test_client, term_id):
    get_response = test_client.get(f'/terms/{term_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['name'] == 'Summer 2025'

def test_delete_term(test_client, term_id):
    delete_response = test_client.delete(f'/terms/{term_id}')
    assert delete_response.status_code == 200
    assert b'Term deleted successfully' in delete_response.data

    verified_delete_response = test_client.get(f'/terms/{term_id}')
    assert verified_delete_response.status_code == 404

def test_create_update_delete_term(test_client):
    term_id_value = term_id(test_client)
    test_update_term(test_client, term_id_value)
    test_get_term(test_client, term_id_value)
    test_delete_term(test_client, term_id_value)
