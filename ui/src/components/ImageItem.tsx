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
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(image.docker_image_id);
          }}
          className="mr-4"
        >
          {isSelected ? (
            <CheckSquare className="text-blue-500" />
          ) : (
            <Square className="text-gray-500" />
          )}
        </button>
        
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
            <p className="text-gray-500">
              {[
                imageData.description || "No description available",
                ", Additional packages: ",
                imageData.packages || "No additional packages",
              ].join("")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageItem;

