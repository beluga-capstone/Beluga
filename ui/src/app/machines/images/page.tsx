"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, Plus, Square, StopCircle } from "lucide-react";
import ImageItem from "@/components/ImageItem";
import CheckBox from "@/components/CheckBox";
import Link from "next/link";
import { useImages } from "@/hooks/useImages";
import { useProfile } from "@/hooks/useProfile";
import { ROLES } from "@/constants";

export default function Images() {
  const {
    images,
    selectedImageIds,
    toggleSelectImage,
    deleteSelectedImages,
    selectAllImages,
  } = useImages();

  const { profile } = useProfile();
  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Images</h1>
      <div className="mb-4 flex items-center">
        {profile?.role_id !== ROLES.STUDENT && (
          <Link href="/machines/images/new">
            <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
              <Plus className="mr-2" /> Add Image
            </button>
          </Link>
        )}

        {selectedImageIds.length > 0 && (
          <button
            onClick={deleteSelectedImages}
            className="bg-red-700 text-white ml-2 px-4 py-2 rounded flex items-center"
          >
            <StopCircle className="mr-2" />
            <span>Delete Selected</span>
          </button>
        )}
      </div>

      <br />
      {images.length > 0 && (
        <div className="flex items-center mb-4">
          <button
            onClick={() => {
              selectAllImages();
            }}
            className="flex items-center"
          >
            {selectedImageIds.length === images.length ? (
              <CheckSquare className="text-blue-500 mr-2" size={20} />
            ) : (
              <Square className="text-gray-500 mr-2" size={20} />
            )}
            <span className="font-medium">Select All</span>
          </button>
        </div>
      )}

      {images.map((image) => (
        <div
          key={image.docker_image_id}
          className="cursor-pointer"
          onClick={() => {
            router.push(`/machines/images/${image.docker_image_id}`);
          }}
        >
          <ImageItem
            image={image}
            isSelected={selectedImageIds.includes(image.docker_image_id)}
            onToggleSelect={toggleSelectImage}
          />
        </div>
      ))}
    </div>
  );
}
