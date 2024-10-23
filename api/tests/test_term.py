def test_create_update_delete_term(test_client):
    # Create Term
    create_data = {
        'name': 'Fall 2024'
    }
    response = test_client.post('/terms', json=create_data)
    assert response.status_code == 201
    assert b'Term created successfully' in response.data

    term_id = response.get_json()['term_id']

    # Update Term
    update_data = {
        'name': 'Summer 2025'
    }
    update_response = test_client.put(f'/terms/{term_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Term updated successfully' in update_response.data

    # Get the updated term
    get_response = test_client.get(f'/terms/{term_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['name'] == 'Summer 2025'

    # Delete Term
    delete_response = test_client.delete(f'/terms/{term_id}')
    assert delete_response.status_code == 200
    assert b'Term deleted successfully' in delete_response.data

    # Verified deleted
    verfified_delete_response = test_client.get(f'/terms/{term_id}')
    assert verfified_delete_response.status_code == 404
