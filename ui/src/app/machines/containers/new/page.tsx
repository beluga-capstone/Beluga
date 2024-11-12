"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useContainers } from "@/hooks/useContainers";
import { Image } from "@/types";
import { useImages } from "@/hooks/useImages";
import { useAllImagesData } from "@/hooks/useImageData";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const NewContainer: React.FC = () => {
  const { addContainer } = useContainers();
  const [containerName, setContainerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string[]>([]);

  const { images } = useImages();
  const imageIds = images.map((img) => img.docker_image_id);
  const { imagesData } = useAllImagesData(imageIds);

  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  useEffect(() => {
    // Listen for container status updates from the backend
    socket.on("container_output", (data) => {
      setOutput((prevOutput) => [...prevOutput, data.output]);
    });

    socket.on("container_started", (data) => {
      setOutput((prevOutput) => [
        ...prevOutput,
        `Container started with ID: ${data.docker_container_id}`,
      ]);
    });

    socket.on("container_error", (data) => {
      setError(data.error);
    });

    return () => {
      socket.off("container_output");
      socket.off("container_started");
      socket.off("container_error");
    };
  }, []);

  const handleCreateContainer = async () => {
    setError(null);
    setOutput([]);

    if (!selectedImage) {
      setError("No image selected");
      return;
    }

    if (!imagesData[selectedImage.docker_image_id]) {
      setError("Selected image data not found");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/containers/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          docker_image_id: selectedImage.docker_image_id,
          user_id: "0a2ad6c8-5ea8-4190-a725-c5739c8093e8", // Replace with actual user ID
          container_name: containerName || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to create container: ${errorData.error}`);
      }
    } catch (err) {
      setError(`Failed to create container: ${err}`);
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
              {imagesData[image.docker_image_id]?.tag[0] || "Loading..."}
            </option>
          ))}
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
      <div className="mt-4">
        <h2>Container Logs</h2>
        <div className="bg-gray-100 p-4 rounded h-64 overflow-y-auto">
          {output.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewContainer;
