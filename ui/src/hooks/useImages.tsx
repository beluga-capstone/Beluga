import { useState, useEffect } from 'react';
import { Image } from '@/types'

export const useImages = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // get image data
  const getAssignmentsForImage =async(docker_image_id:string) =>{
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/assignments/search?docker_image_id=${docker_image_id}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch docker image id');
      }
      const data = await response.json();
      return data;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // get image data
  const getImage =async(docker_image_id:string|null) =>{
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/images/search?docker_image_id=${docker_image_id}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch docker image id');
      }
      const data = await response.json();
      return data;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch images from the database
  const fetchImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/images/search', {
        method: 'GET',
        credentials: 'include',
      });
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
        credentials: 'include',
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
        credentials: 'include',
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
            credentials:"include",
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
    getImage,
    toggleSelectImage,
    deleteSelectedImages,
    selectAllImages,
    refreshImages: fetchImages,
    getAssignmentsForImage,
  };
};
