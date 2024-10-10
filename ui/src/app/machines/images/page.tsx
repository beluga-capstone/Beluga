"use client";
import React, {useState} from "react";
import { Icon } from "@iconify/react";
import AddImageModal from "@/components/AddImageModal";
import EditImagemodal from "@/components/EditImageModal";

interface Image {
  id: number,
  title: string
}

export default function Images() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [images, setImages] = useState<Image[]>([]);

  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  const handleCreateImage = (imageName: string) => {
    const newImage = { id: images.length + 1, title: imageName };
    setImages([...images, newImage]);
  };

  const handleDeleteImage = (id: number | null) => {
    if (id != null) {
      setImages(images.filter((image) => image.id !== id));
    }
  }

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
          <button className="text-blue-500 hover:text-blue-700 flex items-center" onClick={() => {setSelectedImageId(image.id); setIsModalOpen(true);}}>
            <Icon icon="mdi:pencil" width="24" height="24" />
          </button>
        </div>
      ))}

      <AddImageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreateImage={handleCreateImage}
        onDeleteImage={handleDeleteImage}
        imageId={selectedImageId}
      />
    </div>
  );
}
