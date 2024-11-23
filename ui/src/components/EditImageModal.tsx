"use client";
import React, { useEffect, useState } from "react";
import {Image} from "@/types";

interface EditImageModalProps {
    onClose: () => void;
    onUpdateImage: (updatedImage: Image) => void;
    onDeleteImage: (imageId: string | null) => void;
    imageId: string | null;
    selectedImage: Image | null;
}

function EditImageModal({onClose, onUpdateImage, onDeleteImage, imageId, selectedImage }: EditImageModalProps) {
    const [imageName, setImageName] = useState("");
    const [courses, setCourses] = useState<string[]>([]);
    const [packages, setPackages] = useState<string[]>([]);
    const [dockerFileContent, setDockerFileContent] = useState("");
    const [isAdvancedDetailsOpen, setIsAdvancedDetailsOpen] = useState(false);

    useEffect(() => {
        if (selectedImage) {
            setImageName(selectedImage.docker_image_id);
        } else {
            setImageName("");
            setCourses([]);
            setPackages([]);
            setDockerFileContent("");
        }
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="font-bold text-4xl mb-6">Edit Image</h1>
            <div className="mb-4">
            <h2>Image Name</h2>
                <div className="pt-2 pb-8">
                    <input
                        id="imageName"
                        type="text"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                        className="border rounded p-1 bg-surface"
                        placeholder="Image Name"
                    />
                </div>
            </div>

            <div className="mb-4">
                <h2>Assignments:</h2>
                <div className="mb-4">
                </div>
            </div>
                
            <div className="pt-2 pb-8">
            <input
                type="text"
                placeholder="Search"
                className="border rounded p-1 bg-surface"
            />
            </div>

            <div className="mb-4">
            <table className="min-w mb-4">
                <thead>
                    <tr className="border-b border-black">
                        <th className="text-left bg-surface">Package</th>
                        <th className="text-center bg-surface">Install</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            </div>

            <div className="pt-2 pb-8">
                {isAdvancedDetailsOpen && (
                    <>
                        <label className="block mb-2">Docker File:</label>
                        <textarea
                            className="border rounded p-1 w-1/2 h-60 bg-surface"
                            placeholder="Type your Dockerfile content here..."
                            value={dockerFileContent}
                            onChange={(e) => setDockerFileContent(e.target.value)}
                        />
                    </>
                )}
            </div>

            <div className="flex justify-between items-center -mt-4">
                <button
                    className={`border rounded p-1 bg-surface ${
                        isAdvancedDetailsOpen ? "bg-gray-300" : ""
                    }`}
                    onClick={() => setIsAdvancedDetailsOpen(!isAdvancedDetailsOpen)}
                >
                    {isAdvancedDetailsOpen ? "Hide Advanced Details" : "Show Advanced Details"}
                </button>
            </div>
            
            <div className="flex justify-between items-center mt-12">
                <button 
                    className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                    onClick={() => {
                        if (imageId) {
                            onDeleteImage(imageId); // Call the delete function
                        }
                    }}
                >
                    Delete
                </button>
                
                <div className="flex space-x-4">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded flex items-center" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center" onClick={handleUpdateImage}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditImageModal;
