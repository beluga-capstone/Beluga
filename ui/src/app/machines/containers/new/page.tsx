"use client";

import Button from "@/components/Button";
import { DEFAULT_IMAGES } from "@/constants";
import { useContainers } from "@/hooks/useContainers";
import { useState } from "react";

const NewContainer: React.FC = () => {
  const { addContainer } = useContainers();
  const [containerName, setContainerName] = useState("");
  const [image, setImage] = useState(DEFAULT_IMAGES[0]);
  const [cpuCores, setCpuCores] = useState(1);
  const [memoryGBs, setMemoryGBs] = useState(1);
  const [storageGBs, setStorageGBs] = useState(16);

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">New Container</h1>
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
          value={image.id}
          onChange={(e) =>
            setImage(
              DEFAULT_IMAGES.find((i) => i.id === parseInt(e.target.value))!
            )
          }
          className="border rounded p-1 bg-surface"
          aria-label="Select image"
        >
          {DEFAULT_IMAGES.map((image) => (
            <option key={image.id} value={image.id}>
              {image.name}
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
            onClick={() =>
              addContainer(
                containerName,
                image,
                cpuCores,
                memoryGBs,
                storageGBs
              )
            }
            href="/machines/containers"
            disabled={!containerName}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewContainer;
