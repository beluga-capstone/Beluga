def test_create_update_delete_image(test_client):
    # Create Image
    create_data = {
        'user_id': 1,
        'name': 'Test Image',
        'description': 'This is a test image',
        'created_at': '2024-10-22T12:00:00',
        'updated_at': '2024-10-22T12:00:00'
    }
    response = test_client.post('/images', json=create_data)
    assert response.status_code == 201
    assert b'Image created successfully' in response.data

    image_id = response.get_json()['image_id']

    # Update Image
    update_data = {
        'name': 'Updated Test Image',
        'description': 'This is an updated test image',
        'updated_at': '2024-10-23T12:00:00'
    }
    update_response = test_client.put(f'/images/{image_id}', json=update_data)
    assert update_response.status_code == 200
    assert b'Image updated successfully' in update_response.data

    # Get the updated image
    get_response = test_client.get(f'/images/{image_id}')
    assert get_response.status_code == 200
    json_data = get_response.get_json()
    assert json_data['name'] == 'Updated Test Image'
    assert json_data['description'] == 'This is an updated test image'

    # Delete Image
    delete_response = test_client.delete(f'/images/{image_id}')
    assert delete_response.status_code == 200
    assert b'Image deleted successfully' in delete_response.data

    # Verified deleted
    verfified_delete_response = test_client.get(f'/images/{image_id}')
    assert verfified_delete_response.status_code == 404
