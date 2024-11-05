"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EditImageModal from "@/components/EditImageModal";

export default function EditImagePage() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const imageId = searchParams.get("id"); // Assuming the image ID is passed via query params

    const [selectedImage, setSelectedImage] = useState<any | null>(null);

    const handleClose = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            router.push('/machines/images'); 
        }, 300);
    };

    useEffect(() => {
        if (imageId) {
            const storedImages = JSON.parse(localStorage.getItem("images") || "[]");
            const imageToEdit = storedImages.find((image: any) => image.id === parseInt(imageId));
            setSelectedImage(imageToEdit);
        }
    }, [imageId]);

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
        router.push("/machines/images");
    };

    const handleDeleteImage = (imageId: number | null) => {
        const storedImages = JSON.parse(localStorage.getItem("images") || "[]");
        const updatedImages = storedImages.filter((image: any) => image.id !== imageId);
        localStorage.setItem("images", JSON.stringify(updatedImages));
        router.push("/machines/images");
    };

    return (
        <div className="container mx-auto p-4">
            {selectedImage ? (
                isModalOpen && (
                    <EditImageModal
                        onClose={() => router.back()}
                        onUpdateImage={handleUpdateImage}
                        onDeleteImage={handleDeleteImage}
                        imageId={selectedImage.id}
                        selectedImage={selectedImage}
                    />
                )
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
