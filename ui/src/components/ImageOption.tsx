import React from 'react';
import { useImageData } from '@/hooks/useImageData';

type ImageProps = {
  image: { docker_image_id: string };
};

const ImageOption: React.FC<ImageProps> = ({ image }) => {
  const { imageData, loading, error } = useImageData(image.docker_image_id);

  return (
    <option key={image.docker_image_id} value={image.docker_image_id}>
      <span>
        {loading && 'Loading...'}
        {error && `Error: ${error}`}
        {imageData ? imageData.tag[0] || 'Image not found' : 'No data'}
      </span>
    </option>
  );
};

export default ImageOption;

