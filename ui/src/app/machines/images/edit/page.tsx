"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EditImageModal from "@/components/EditImageModal";
import { Image } from "@/types";
import { useImages } from "@/hooks/useImages"; 

export default function EditImagePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const imageId = searchParams.get("id");

    const { images, editImage, deleteImage, refreshImages, error, isLoading } = useImages();
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);

    useEffect(() => {
        // Refresh images and find the selected image by ID
        refreshImages().then(() => {
            const foundImage = images.find(img => img.docker_image_id === imageId);
            setSelectedImage(foundImage || null);
        });
    }, []);

    const handleUpdateImage = async (updatedImage: Image) => {
        try {
            await editImage(updatedImage);
            router.back(); // Navigate back after successful edit
        } catch (err) {
            console.error("Failed to update image:", err);
        }
    };

    const handleDeleteImage = async (docker_image_id: string) => {
        try {
            await deleteImage(docker_image_id);
            router.back(); // Navigate back after deletion
        } catch (err) {
            console.error("Failed to delete image:", err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : selectedImage ? (
                <EditImageModal
                    onClose={() => router.back()}
                    onUpdateImage={handleUpdateImage}
                    onDeleteImage={() => handleDeleteImage(selectedImage.docker_image_id)}
                    imageId={selectedImage.docker_image_id}
                    selectedImage={selectedImage}
                />
            ) : (
                <p>Image not found.</p>
            )}
        </div>
    );
}

