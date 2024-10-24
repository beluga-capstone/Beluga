import pytest

def test_create_update_delete_image(test_client, image_id):
    # Step 1: Update the Image
    update_data = {
        'name': 'Updated Test Image',
        'description': 'This is an updated test image',
        'updated_at': '2024-10-23T12:00:00'
    }
    update_response = test_client.put(f'/images/{image_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Image updated successfully' in update_response.data

    # Step 2: Get and Verify the Updated Image
    get_response = test_client.get(f'/images/{image_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['name'] == 'Updated Test Image'
    assert json_data['description'] == 'This is an updated test image'

    # Step 3: Delete the Image
    delete_response = test_client.delete(f'/images/{image_id}')
    assert delete_response.status_code == 200
    assert b'Image deleted successfully' in delete_response.data

    # Step 4: Verify the Image Deletion
    verified_delete_response = test_client.get(f'/images/{image_id}')
    assert verified_delete_response.status_code == 404
