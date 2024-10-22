import React from "react";
import { Edit, CheckSquare, Square } from 'lucide-react';

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
    onEdit: (id: number) => void;
};

const ImageItem: React.FC<ImageItemProps> = ({ image, isSelected, onToggleSelect, onEdit }) => {
    return (
        <div
            className={`border p-4 rounded mb-4 flex justify-between items-center`}
        >
            <div className="flex items-center">
                <button
                    onClick={() => onToggleSelect(image.id)}
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
            
            <button
                onClick={() => isSelected && onEdit(image.id)}
                disabled={!isSelected}
                className={`px-2 py-1 rounded flex items-center ${
                    isSelected ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                <Edit className="mr-1" /> Edit
            </button>
        </div>
    );
};

export default ImageItem;
