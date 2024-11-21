"use client";

import Button from "@/components/Button";
import { useContainers } from "@/hooks/useContainers";
import React, { useState, useEffect } from "react";
import ContainerForm from "@/components/ContainerForm";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NewContainer: React.FC = () => {
  const { runContainer } = useContainers();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [imageId, setImageId] = useState<string | null>(null);
  const router = useRouter();

  // If an image is selected, unselect it when imageId is "-1"
  useEffect(() => {
    if (imageId === "-1") setImageId(null);
  }, [imageId]);

  // Check if the "Add Container" button should be enabled
  const isButtonDisabled = !title || !description || !imageId;

  const handleAddContainer=async()=>{
    const result = await runContainer(imageId ?? null, title);
      if (result) {
        const { container_port: port, container_id: id } = result;
        console.log(`Container running on port: ${port}, ID: ${id}`);
        router.push(`/machines/containers/${id}`);
      } else {
        console.error("Failed to run the container.");
      }
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">New Container</h1>

      <ContainerForm
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        imageId={imageId}
        setImageId={setImageId}
      />

      <div className="flex flex-column justify-end">
        <div className="p-2">
          <Link href="/machines/containers">
          <Button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
          >
            Cancel
          </Button>
          </Link>
        </div>
        <div className="p-2">
          <Link href="/machines/containers">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={() =>
              handleAddContainer()
            }
            disabled={isButtonDisabled}
          >
            Add Container
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewContainer;
