"use client";
import React, {useState} from "react";
import { Icon } from "@iconify/react";
import AddImageModal from "@/components/AddImageModal";

export default function Images() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const images = [
    { id: 1, title: 'Assignment 2 - Image' },
    { id: 2, title: 'Assignment 1 - Image' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <span className="font-bold text-4xl">Images</span>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Image
        </button>
      </div>

      {images.map((image) => (
        <div key={image.id} className="flex items-center space-x-2 text-lg font-medium">
          <span>{image.title}</span>
          <button className="text-blue-500 hover:text-blue-700 flex items-center" onClick={() => setIsModalOpen(true)}>
            <Icon icon="mdi:pencil" width="24" height="24" />
          </button>
        </div>
      ))}

      <AddImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
