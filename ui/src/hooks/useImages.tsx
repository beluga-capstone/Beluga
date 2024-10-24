import { useState, useEffect } from 'react';
import { Image } from '@/types';

export const useImages = () => {
    const [images, setImages] = useState<Image[]>([]);
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

    useEffect(() => {
        if (selectedImageIds.length === 0) {
            const deleteButton = document.getElementById("delete-button");
            if (deleteButton) {
                deleteButton.classList.add("hidden");
            }
        }
      }, [selectedImageIds]);

    const addImage = (newImage: Image) => {
        setImages([...images, newImage]);
    };

    const editImage = (updatedImage: Image) => {
        setImages((prevImages) =>
            prevImages.map((img) =>
                img.id === updatedImage.id ? updatedImage : img
            )
        );
    };

    const deleteImage = (id: number) => {
        setImages(images.filter((image) => image.id !== id));
    };

    const toggleSelectImage = (id: number) => {
        setSelectedImageIds((prev) =>
            prev.includes(id) ? prev.filter((imageId) => imageId !== id) : [...prev, id]
        );
    };

    const selectAllImages = (select: boolean) => {
        if (selectedImageIds.length === images.length) {
            setSelectedImageIds([]);
        } else {
            setSelectedImageIds(images.map(image => image.id));
        }
    };

    const deleteSelectedImages = async () => {
        try {
            await fetch("/api/deleteImages", {
                method: "POST",
                body: JSON.stringify({ imageIds: selectedImageIds }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            const updatedImages = images.filter((image) => !selectedImageIds.includes(image.id));
            setImages(updatedImages);
            setSelectedImageIds([]);
            localStorage.setItem("images", JSON.stringify(updatedImages));
        } catch (error) {
            console.error("Error deleting images:", error);
        }
    };

    return {
        images,
        selectedImageIds,
        addImage,
        editImage,
        deleteImage,
        toggleSelectImage,
        deleteSelectedImages,
        selectAllImages,
    };
};
