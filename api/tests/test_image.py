import pytest

def test_create_update_delete_image(test_client, docker_image_id):
    # Step 1: Update the Image
    update_data = {
        'description': 'This is an updated test image'
    }
    update_response = test_client.put(f'/images/{docker_image_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Image updated successfully' in update_response.data

    # Step 2: Get and Verify the Updated Image
    get_response = test_client.get(f'/images/{docker_image_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['description'] == 'This is an updated test image'

    # Step 3: Delete the Image
    delete_response = test_client.delete(f'/images/{docker_image_id}')
    assert delete_response.status_code == 200
    assert b'Image deleted successfully' in delete_response.data

    # Step 4: Verify the Image Deletion
    verified_delete_response = test_client.get(f'/images/{docker_image_id}')
    assert verified_delete_response.status_code == 404

def test_create_image_missing_fields(test_client):
    data = {}
    response = test_client.post('/images', json=data)
    assert response.status_code == 400
    assert b'Docker Image ID and User ID are required' in response.data
