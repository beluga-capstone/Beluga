"use client";

import Button from "@/components/Button";
import { useContainers } from "@/hooks/useContainers";
import React, { useState, useEffect } from "react";
import ContainerForm from "@/components/ContainerForm";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NewContainer: React.FC = () => {
  const { runContainer, checkContainerExists } = useContainers();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [imageId, setImageId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission
  const [titleExists, setTitleExists] = useState(false); // Track if title exists
  const router = useRouter();

  // If an image is selected, unselect it when imageId is "-1"
  useEffect(() => {
    if (imageId === "-1") setImageId(null);
  }, [imageId]);

  // Validation function to check if the form is valid
  const isFormValid = async () => {
    if (!title || !imageId) {
      return false; // Title and imageId must exist
    }
    const { exists } = await checkContainerExists(title);
    setTitleExists(exists); // Set the titleExists state based on the check
    return !exists; // Ensure title does not already exist
  };

  useEffect(()=>{
    isFormValid();
  },[title]);

  // Handle form submission
  const handleAddContainer = async (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default link behavior

    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true); // Set submitting state to true

    const valid = await isFormValid();
    if (!valid) {
      setIsSubmitting(false); // Reset submission state
      return; // Exit early if the form is invalid
    }

    let alt_desc = description;
    if (description == ""){
      alt_desc = "No description"
    }
    const result = await runContainer(imageId ?? null, title, alt_desc);
    if (result) {
      const { appPort: port, container_id: id } = result;
      console.log(`Container running on port: ${port}, ID: ${id}`);
      router.push(`/machines/containers/${id}`);
    } else {
      console.error("Failed to run the container.");
    }
    setIsSubmitting(false); // Reset submitting state after submission
  };

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

      {/* Display error message next to title input */}
      {titleExists && (
        <div className="text-red-500 text-sm mt-2">Container with this title already exists.</div>
      )}

      <div className="flex flex-column">
        <div className="mr-2">
          <Link href="/machines/containers">
            <Button className="bg-gray-500 text-white px-4 py-2 rounded flex items-center">
              Cancel
            </Button>
          </Link>
        </div>
        <div className="">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleAddContainer}
            disabled={isSubmitting || !title || !imageId || titleExists} // Disable if title or imageId is invalid or if title exists
          >
            {isSubmitting ? "Creating..." : "Create Container"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewContainer;

