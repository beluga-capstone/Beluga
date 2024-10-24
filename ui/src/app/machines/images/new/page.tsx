"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AddImageModal from "@/components/AddImageModal";

export default function NewImagePage() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const router = useRouter();

    const handleClose = () => {
        setIsModalOpen(false);
    };

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
        router.push("/machines/images");
    };

    return (
        <div className="container mx-auto p-4">
            {isModalOpen && (
                <AddImageModal
                    onClose={() => router.back()}
                    onCreateImage={handleCreateImage}
                    onDeleteImage={() => {}}
                    imageId={null}
                />
            )}
        </div>
    );
}
