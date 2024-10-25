import React from "react";
import { CheckSquare, Square } from 'lucide-react';

type ImageItemProps = {
    image: {
        id: number;
        title: string;
        courses: string[];
        packages: string[];
        dockerfileContent: string;
    };
    isSelected: boolean;
    onToggleSelect: (id: number) => void;
    onEdit?: (id: number) => void;
};

const ImageItem: React.FC<ImageItemProps> = ({ image, isSelected, onToggleSelect, onEdit }) => {
    return (
        <div
            className={`border p-4 rounded mb-4 flex justify-between items-center`}
        >
            <div className="flex items-center">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect(image.id);
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
                    <h2 className="font-bold">{image.title}</h2>
                    <p className="text-gray-500">Courses: {image.courses.join(", ")}</p>
                </div>
            </div>
        </div>
    );
};

export default ImageItem;
