"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AddImageModal from "@/components/AddImageModal";
import EditImageModal from "@/components/EditImageModal";

export default function NewImagePage() {
    const router = useRouter();
    const [isAddModalOpen, setIsAddModalOpen] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<any | null>(null);

    const handleCreateImage = (imageData: {
        title: string;
        courses: string[];
        packages: string[];
        dockerfileContent: string;
    }) => {
        const storedImages = localStorage.getItem("images")
            ? JSON.parse(localStorage.getItem("images") || "[]")
            : [];
        const newImage = {
            id: storedImages.length + 1,
            ...imageData,
        };
        localStorage.setItem("images", JSON.stringify([...storedImages, newImage]));
        setIsAddModalOpen(false);
        router.push("/machines/images");
    };

    const handleUpdateImage = (updatedImage: {
        id: number;
        title: string;
        courses: string[];
        packages: string[];
        dockerfileContent: string;
    }) => {
        const storedImages = JSON.parse(localStorage.getItem("images") || "[]");
        const updatedImages = storedImages.map((image: any) =>
            image.id === updatedImage.id ? updatedImage : image
        );
        localStorage.setItem("images", JSON.stringify(updatedImages));
        setIsEditModalOpen(false);
        router.push("/machines/images");
    };

    const handleDeleteImage = (imageId: number | null) => {
        const storedImages = JSON.parse(localStorage.getItem("images") || "[]");
        const updatedImages = storedImages.filter((image: any) => image.id !== imageId);
        localStorage.setItem("images", JSON.stringify(updatedImages));
        setIsEditModalOpen(false);
    };

    const handleSelectImage = (imageId: number) => {
        const storedImages = JSON.parse(localStorage.getItem("images") || "[]");
        const imageToEdit = storedImages.find((image: any) => image.id === imageId);
        setSelectedImage(imageToEdit);
        setSelectedImageId(imageId);
        setIsEditModalOpen(true);
    };

    return (
        <div className="container mx-auto p-4">
            {isEditModalOpen && selectedImage && (
                <EditImageModal
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdateImage={handleUpdateImage}
                    onDeleteImage={handleDeleteImage}
                    imageId={selectedImageId}
                    selectedImage={selectedImage}
                />
            )}
            {isAddModalOpen && (
                <AddImageModal
                    onClose={() => setIsAddModalOpen(false)}
                    onCreateImage={handleCreateImage}
                    onDeleteImage={() => {}}
                    imageId={null}
                />
            )}
        </div>
    );
}
