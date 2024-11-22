"use client";
import React from "react";
import { CheckSquare, Square, Loader } from 'lucide-react';
import { useImageData } from "@/hooks/useImageData";

type ImageItemProps = {
    image: {
        docker_image_id: string;
        user_id: string;
        description: string;
    };
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
};

const ImageItem: React.FC<ImageItemProps> = ({ image, isSelected, onToggleSelect }) => {
    const { imageData, loading, error } = useImageData(image.docker_image_id);

    return (
        <div className="border p-4 rounded mb-4 flex justify-between items-center">
            <div className="flex items-center">
                <label
                    className="flex items-center cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                    >
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(image.docker_image_id)}
                        className="hidden"
                    />
                    <span
                        className={`w-4 h-4 border rounded-md flex items-center justify-center mr-2 ${
                        isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                        }`}
                    >
                        {isSelected && <span className="text-white">✓</span>}
                    </span>
                </label>
                
                <div>
                    <h2 className="font-bold flex items-center">
                        {loading ? (
                            <>
                                <Loader className="animate-spin mr-2" size={16} />
                                <span className="text-gray-400">Loading image data...</span>
                            </>
                        ) : (
                            imageData?.tag[0] || `Image not found in repository. Image ID: ${image.docker_image_id || "Unknown"}`

                        )}
                    </h2>
                    {!loading && imageData && (
                        <p className="text-gray-500">{imageData.description || "No description available"}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageItem;
