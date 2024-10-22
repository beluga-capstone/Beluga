"use client";
import React, { useState, useEffect } from "react";
import { Plus } from 'lucide-react';
import AddImageModal from "@/components/AddImageModal";
import EditImageModal from "@/components/EditImageModal";
import ImageItem from "@/components/ImageItem";

type Image = {
    id: number;
    title: string;
    courses: string[];
    packages: string[];
    dockerfileContent: string;
};

export default function Images() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [images, setImages] = useState<Image[]>([]);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);

    useEffect(() => {
        const storedImages = localStorage.getItem("images");
        if (storedImages) {
            console.log("Loading images from localStorage:", JSON.parse(storedImages));
            setImages(JSON.parse(storedImages));
        }
    }, []);

    useEffect(() => {
        if (images.length > 0) {
            console.log("Saving images to localStorage:", images);
            localStorage.setItem("images", JSON.stringify(images));
        }
    }, [images]);

    const handleCreateImage = (imageData: {
        title: string;
        courses: string[];
        packages: string[];
        dockerfileContent: string;
    }) => {
        const imageExists = images.some((image) => image.title === imageData.title);
        if (imageExists) {
            alert("An image with this name already exists. Please choose a different name.");
            return;
        }
        const newImage = {
            id: images.length + 1,
            title: imageData.title,
            courses: imageData.courses,
            packages: imageData.packages,
            dockerfileContent: imageData.dockerfileContent,
        };
        setImages([...images, newImage]);
    };

    const handleEditImage = (updatedImage: {
        id: number;
        title: string;
        courses: string[];
        packages: string[];
        dockerfileContent: string;
    }) => {
        if (selectedImageId !== null) {
            setImages((prevImages) =>
                prevImages.map((img) =>
                    img.id === selectedImageId
                        ? {
                            ...img,
                            title: updatedImage.title,
                            courses: updatedImage.courses,
                            packages: updatedImage.packages,
                            dockerfileContent: updatedImage.dockerfileContent,
                        }
                        : img
                )
            );
        }
        setIsModalOpen(false);
    };

    const handleDeleteImage = (id: number | null) => {
        if (id != null) {
            setImages(images.filter((image) => image.id !== id));
        }
    }

    const handleToggleSelect = (id: number) => {
        setSelectedImageIds((prev) =>
            prev.includes(id) ? prev.filter((imageId) => imageId !== id) : [...prev, id]
        );
    };

    const handleDeleteSelectedImages = () => {
        setImages(images.filter((image) => !selectedImageIds.includes(image.id)));
        setSelectedImageIds([]);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="font-bold text-4xl mb-6">Images</h1>
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setIsEditing(false);
                        setSelectedImageIds([]);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                >
                    <Plus className="mr-2" /> Add Image
                </button>

                <div className="space-x-2">
                    <button 
                        onClick={handleDeleteSelectedImages} 
                        className="bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Delete Selected
                    </button>
                </div>
            </div>

            {images.map((image) => (
                <ImageItem
                  key={image.id}
                  image={image}
                  isSelected={selectedImageIds.includes(image.id)}
                  onToggleSelect={handleToggleSelect}
                  onEdit={(id) => {
                      setSelectedImageId(id);
                      setIsEditing(true);
                      setIsModalOpen(true);
                  }} 
              />
            ))}

            {isModalOpen && isEditing ? (
                <EditImageModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onUpdateImage={handleEditImage}
                    onDeleteImage={handleDeleteImage}
                    imageId={selectedImageId}
                    selectedImage={images.find((img) => img.id === selectedImageId) || null}
                />
            ) : (
                <AddImageModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onCreateImage={handleCreateImage}
                    onDeleteImage={handleDeleteImage}
                    imageId={null}
                />
            )}
        </div>
    );
}
