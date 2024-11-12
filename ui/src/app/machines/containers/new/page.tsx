"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useContainers } from "@/hooks/useContainers";
import { Image } from "@/types";
import { useImages } from "@/hooks/useImages";
import { useAllImagesData } from "@/hooks/useImageData";

const NewContainer: React.FC = () => {
  const { addContainer } = useContainers();
  const [containerName, setContainerName] = useState("");
  const [cpuCores, setCpuCores] = useState(1);
  const [memoryGBs, setMemoryGBs] = useState(1);
  const [storageGBs, setStorageGBs] = useState(16);
  const [error, setError] = useState<string | null>(null);

  const { images } = useImages();
  const imageIds = images.map(img => img.docker_image_id);
  const { imagesData } = useAllImagesData(imageIds);

  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  const handleCreateContainer = () => {
    setError(null);

    if (!selectedImage) {
      setError("No image selected");
      return;
    }

    if (!imagesData[selectedImage.docker_image_id]) {
      setError("Selected image data not found");
      return;
    }

    try {
      addContainer(
        containerName,
        selectedImage,
        cpuCores,
        memoryGBs,
        storageGBs
      );
    } catch (err) {
      setError("Failed to create container: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">New Container</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <h2>Container Name</h2>
      <div className="pt-2 pb-8">
        <input
          value={containerName}
          onChange={(e) => setContainerName(e.target.value)}
          type="text"
          className="border rounded p-1 bg-surface"
          placeholder="Container name"
          aria-label="Container name"
        />
      </div>
      <h2>Select Image</h2>
      <div className="pt-2 pb-8">
        <select
          value={selectedImage?.docker_image_id}
          onChange={(e) =>
            setSelectedImage(
              images.find((i) => i.docker_image_id === e.target.value) || null
            )
          }
          className="border rounded p-1 bg-surface"
          aria-label="Select image"
        >
          {images.map((image) => (
            <option key={image.docker_image_id} value={image.docker_image_id}>
              {imagesData[image.docker_image_id]?.tag[0] || 'Loading...'}
            </option>
          ))}
        </select>
      </div>
      <h2>Configuration Options</h2>
      <div className="flex items-center space-x-4 py-2">
        <h3>CPU</h3>
        <select
          value={cpuCores}
          onChange={(e) => setCpuCores(parseInt(e.target.value))}
          className="border rounded p-1 bg-surface"
          aria-label="Number of CPU cores"
        >
          <option value={1}>1 core</option>
          <option value={2}>2 cores</option>
          <option value={4}>4 cores</option>
          <option value={8}>8 cores</option>
        </select>
        <h3>Memory</h3>
        <select
          value={memoryGBs}
          onChange={(e) => setMemoryGBs(parseInt(e.target.value))}
          className="border rounded p-1 bg-surface"
          aria-label="Gigabytes of RAM"
        >
          <option value={1}>1 GB</option>
          <option value={2}>2 GB</option>
          <option value={4}>4 GB</option>
          <option value={8}>8 GB</option>
        </select>
        <h3>Storage</h3>
        <select
          value={storageGBs}
          onChange={(e) => setStorageGBs(parseInt(e.target.value))}
          className="border rounded p-1 bg-surface"
          aria-label="Gigabytes of storage"
        >
          <option value={16}>16 GB</option>
          <option value={32}>32 GB</option>
          <option value={64}>64 GB</option>
          <option value={128}>128 GB</option>
        </select>
      </div>
      <div className="flex flex-column justify-end">
        <div className="p-2">
          <Button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            href="/machines/containers"
          >
            Cancel
          </Button>
        </div>
        <div className="p-2">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleCreateContainer}
            disabled={!containerName || !selectedImage}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewContainer;
