import { useState, useEffect } from 'react';
import { Image } from '@/types'
import NewImagePage from '@/app/machines/images/new/page';

export const useImages = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch images from the database
  const fetchImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/images');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchImages();
  }, []);

  const editImage = async (updatedImage: Image) => {
    try {
      const response = await fetch(`http://localhost:5000/images/${updatedImage.docker_image_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedImage),
      });

      if (!response.ok) {
        throw new Error('Failed to update image');
      }

      setImages(prevImages =>
        prevImages.map(img =>
          img.docker_image_id === updatedImage.docker_image_id ? updatedImage : img
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image');
      throw err;
    }
  };

  const deleteImage = async (docker_image_id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/images/${docker_image_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setImages(prevImages => prevImages.filter(img => img.docker_image_id !== docker_image_id));
      setSelectedImageIds(prevSelected => prevSelected.filter(id => id !== docker_image_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
      throw err;
    }
  };

  const toggleSelectImage = (docker_image_id: string) => {
    setSelectedImageIds(prev =>
      prev.includes(docker_image_id)
        ? prev.filter(id => id !== docker_image_id)
        : [...prev, docker_image_id]
    );
  };

  const selectAllImages = () => {
    if (selectedImageIds.length === images.length) {
      setSelectedImageIds([]);
    } else {
      setSelectedImageIds(images.map(image => image.docker_image_id));
    }
  };

  const deleteSelectedImages = async () => {
    try {
      await Promise.all(
        selectedImageIds.map(docker_image_id =>
          fetch(`http://localhost:5000/images/${docker_image_id}`, {
            method: 'DELETE',
          })
        )
      );

      setImages(prevImages =>
        prevImages.filter(image => !selectedImageIds.includes(image.docker_image_id))
      );
      setSelectedImageIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete selected images');
      throw err;
    }
  };

  return {
    images,
    selectedImageIds,
    isLoading,
    error,
    editImage,
    deleteImage,
    toggleSelectImage,
    deleteSelectedImages,
    selectAllImages,
    refreshImages: fetchImages,
  };
};
