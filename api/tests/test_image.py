import pytest
from unittest.mock import patch

@patch('src.blueprints.image.docker_client')
def test_create_update_delete_image(mock_docker_client, test_client, docker_image_id):
    # Mock the methods you expect to be called
    mock_docker_client.images.get.return_value.tags = ['test_image:latest']
    mock_docker_client.images.get.return_value.id = docker_image_id

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

def test_search_images(test_client, user_id, docker_image_id):
    # Search by user_id
    response = test_client.get(f'/images/search?user_id={user_id}')
    assert response.status_code == 200
    json_data = response.get_json()
    assert any(image['user_id'] == str(user_id) for image in json_data)

    # Search by docker_image_id
    response = test_client.get(f'/images/search?docker_image_id={docker_image_id}')
    assert response.status_code == 200
    json_data = response.get_json()
    assert any(image['docker_image_id'] == docker_image_id for image in json_data)

    # Search with non-matching criteria
    response = test_client.get('/images/search?description=NonExistentImage')
    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data) == 0
