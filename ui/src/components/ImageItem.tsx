"use client";
import React, { useState, useEffect } from "react";
import { CheckSquare, Square } from 'lucide-react';

type ImageItemProps = {
    image: {
        docker_image_id: string; // id should be a string, as docker image ids are typically strings
        title: string;
        courses: string[];
        packages: string[];
        dockerfileContent: string;
    };
    isSelected: boolean;
    onToggleSelect: (id: string) => void; // id should also be a string
};

const ImageItem: React.FC<ImageItemProps> = ({ image, isSelected, onToggleSelect }) => {
    const [imageTag, setImageTag] = useState<string>("");

    // Use useEffect to call the async function when the component mounts
    useEffect(() => {
        const getImageTag = async () => {
            try {
                const response = await fetch(`http://localhost:5000/images/${image.docker_image_id}`);
                const data = await response.json();
                setImageTag(data.tag[0]); // Assuming 'tag' is an array and we want the first element
            } catch (error) {
                console.error("Error fetching image tag:", error);
            }
        };

        getImageTag();
    }, [image.docker_image_id]); // Only refetch when the docker_image_id changes

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
                    <h2 className="font-bold">{imageTag || "Loading..."}</h2>
                    {/* <p className="text-gray-500">Courses: {image.courses.join(", ")}</p> */}
                </div>
            </div>
        </div>
    );
};

export default ImageItem;
