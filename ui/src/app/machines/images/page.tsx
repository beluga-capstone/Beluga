"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import ImageItem from "@/components/ImageItem";
import Link from "next/link";
import { useImages } from "@/hooks/useImages";

export default function Images() {
  const {
    images,
    selectedImageIds,
    toggleSelectImage,
    deleteSelectedImages,
  } = useImages();

  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Images</h1>
      <div className="mb-4 flex justify-between items-center">
        <Link href="/machines/images/new">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus className="mr-2" /> Add Image
          </button>
        </Link>

        <div className="space-x-2">
          <button
            onClick={deleteSelectedImages}
            className="bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete Selected
          </button>
        </div>
      </div>

      {images.map((image) => (
        <div
          key={image.id}
          className="cursor-pointer"
          onClick={() => {
            router.push(`/machines/images/details?id=${image.id}`);
          }}
        >
          <ImageItem
            image={image}
            isSelected={selectedImageIds.includes(image.id)}
            onToggleSelect={toggleSelectImage}
          />
        </div>
      ))}
    </div>
  );
}
