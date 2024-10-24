"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from 'lucide-react';
import AddImageModal from "@/components/AddImageModal";
import EditImageModal from "@/components/EditImageModal";
import ImageItem from "@/components/ImageItem";
import CheckBox from "@/components/CheckBox";
import Link from "next/link";

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
    const [isSelectAll, setIsSelectAll] = useState(false);

    const router = useRouter(); 

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
        setIsModalOpen(false);
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

    const handleSelectAll = () => {
        if (isSelectAll) {
            setSelectedImageIds([]); 
        } else {
            setSelectedImageIds(images.map((image) => image.id));
        }
        setIsSelectAll(!isSelectAll);
    };

    const handleToggleSelect = (id: number) => {
        setSelectedImageIds((prev) =>
            prev.includes(id) ? prev.filter((imageId) => imageId !== id) : [...prev, id]
        );
    };

    const handleDeleteSelectedImages = () => {
        const updatedImages = images.filter((image) => !selectedImageIds.includes(image.id));
        setImages(updatedImages);
        setSelectedImageIds([]);
        localStorage.setItem("images", JSON.stringify(updatedImages));
        setIsSelectAll(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="font-bold text-4xl mb-6">Images</h1>
            <div className="mb-4 flex justify-between items-center">
                <Link href="/machines/images/new">
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setSelectedImageIds([]);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                    >
                        <Plus className="mr-2" /> Add Image
                    </button>
                </Link>

                {selectedImageIds.length > 0 && (
                    <button 
                        onClick={handleDeleteSelectedImages} 
                        className="bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Delete Selected
                    </button>
                )}
            </div>

            {images.length > 1 && selectedImageIds.length > 0 && (
                <div className="mb-4">
                    <CheckBox
                        checked={isSelectAll}
                        onChange={handleSelectAll}
                        label="Select All"
                    />
                </div>
            )}

            {images.map((image) => (
                <div
                    key={image.id}
                    className="cursor-pointer"
                    onClick={() => {
                        setSelectedImageId(image.id);
                        router.push(`/machines/images/details?id=${image.id}`);
                    }}
                >
                    <ImageItem
                        image={image}
                        isSelected={selectedImageIds.includes(image.id)}
                        onToggleSelect={handleToggleSelect}
                        onEdit={(id) => {
                            setSelectedImageId(id);
                            setIsEditing(true);
                        }} 
                    />
                </div>
            ))}
            {isModalOpen && (isEditing ? (
                <EditImageModal
                    onClose={() => setIsModalOpen(false)}
                    onUpdateImage={handleEditImage}
                    onDeleteImage={handleDeleteImage}
                    imageId={selectedImageId}
                    selectedImage={images.find((img) => img.id === selectedImageId) || null}
                />
            ) : (
                <AddImageModal
                    onClose={() => setIsModalOpen(false)}
                    onCreateImage={handleCreateImage}
                    onDeleteImage={handleDeleteImage}
                    imageId={null}
                />
            ))}
        </div>
    );
}
