interface ImageData {
  description: string;
  docker_image_id: string;
  user_id: string;
  tag: string[];
  packages:string;
}

interface ImageDataState {
  imageData: ImageData | null;
  loading: boolean;
  error: string | null;
}

import { useState, useEffect } from 'react';

export const useImageData = (imageId: string | null): ImageDataState => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.backend}/images/${imageId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network error');
        }
        const data = await response.json();
        setImageData(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setImageData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchImageData();
  }, [imageId]);

  return { imageData, loading, error };
};

export const useAllImagesData = (imageIds: string[]) => {
  const [imagesData, setImagesData] = useState<Record<string, ImageData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllImagesData = async () => {
      try {
        setLoading(true);
        const promises = imageIds.map(id => 
          fetch(`${process.env.backend}./images/${id}`, {
              credentials: 'include'
          }).then(res => res.json())
      );
      
        const results = await Promise.all(promises);
        const newImagesData = results.reduce((acc, data) => {
          acc[data.docker_image_id] = data;
          return acc;
        }, {});
        setImagesData(newImagesData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllImagesData();
  }, [imageIds]);

  return { imagesData, loading, error };
};
