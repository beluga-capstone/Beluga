import pytest

def test_create_update_delete_term(test_client, term_id):
    # Step 1: Update the Term
    update_data = {
        'name': 'Summer 2025'
    }
    update_response = test_client.put(f'/terms/{term_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Term updated successfully' in update_response.data

    # Step 2: Get and Verify the Updated Term
    get_response = test_client.get(f'/terms/{term_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['name'] == 'Summer 2025'

    # Step 3: Delete the Term
    delete_response = test_client.delete(f'/terms/{term_id}')
    assert delete_response.status_code == 200
    assert b'Term deleted successfully' in delete_response.data

    # Step 4: Verify the Term Deletion
    verified_delete_response = test_client.get(f'/terms/{term_id}')
    assert verified_delete_response.status_code == 404
