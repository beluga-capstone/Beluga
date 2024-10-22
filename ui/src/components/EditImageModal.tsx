"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

interface EditImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdateImage: (updatedImage: { id: number; title: string; courses: string[]; packages: string[]; dockerfileContent: string }) => void;
    onDeleteImage: (imageId: number | null) => void;
    imageId: number | null;
    selectedImage: {
        id: number;
        title: string;
        courses: string[];
        packages: string[];
        dockerfileContent: string;
    } | null;
}

function EditImageModal({ isOpen, onClose, onUpdateImage, imageId, selectedImage }: EditImageModalProps) {
    const [imageName, setImageName] = useState("");
    const [courses, setCourses] = useState<string[]>([]);
    const [packages, setPackages] = useState<string[]>([]);
    const [dockerFileContent, setDockerFileContent] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const [isAdvancedDetailsOpen, setIsAdvancedDetailsOpen] = useState(false);

    useEffect(() => {
        if (selectedImage) {
            setImageName(selectedImage.title);
            setCourses(selectedImage.courses);
            setPackages(selectedImage.packages);
            setDockerFileContent(selectedImage.dockerfileContent);
        }
    }, [selectedImage]);

    if (!isOpen) return null; 

    const handleUpdateImage = () => {
        if (imageName.trim() !== "" && imageId !== null) {
            onUpdateImage({
                id: imageId,
                title: imageName,
                courses,
                packages,
                dockerfileContent: dockerFileContent,
            });
            onClose();
        }
    };

    const handleCourseChange = (course: string) => {
        setCourses((prevCourses) =>
            prevCourses.includes(course)
                ? prevCourses.filter((c) => c !== course)
                : [...prevCourses, course]
        );
    };

    const handlePackageChange = (packageName: string) => {
        setPackages((prevPackages) =>
            prevPackages.includes(packageName)
                ? prevPackages.filter((p) => p !== packageName)
                : [...prevPackages, packageName]
        );
    };

    return (
        <>
            <div className="fixed inset-0 bg-black opacity-50 z-40" />

            <div className="bg-white shadow-lg rounded-lg p-5 w-5/6 h-4/5 flex flex-col ml-28 mt-8 z-50 relative">
                <div className="modal-header flex justify-between items-center">
                    <div></div>
                    <div className="flex justify-end space-x-2 mb-4">
                        <button className="text-black" onClick={onClose}>
                            <Icon icon="mdi:close" width="20" height="20" />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        <div className="modal-body flex justify-between">
                            <div className="w-1/2">
                                {/* Image Name */}
                                <label className="font-semibold block mb-2 text-black">Image Name</label>
                                <input
                                    type="text"
                                    value={imageName}
                                    onChange={(e) => setImageName(e.target.value)}
                                    placeholder="Enter image name"
                                    className="border border-gray-300 rounded p-2 w-full mb-4 text-black"
                                />

                                {/* Course Assign */}
                                <label className="block mb-2 text-black">Courses Assigned:</label>
                                <div className="mb-4">
                                    {['CSCE 121', 'CSCE 313', 'CSCE 410'].map((course) => (
                                        <label key={course} className="flex items-center text-black">
                                            <input
                                                type="checkbox"
                                                checked={courses.includes(course)}
                                                onChange={() => handleCourseChange(course)}
                                                className="mr-2"
                                            />{" "}
                                            {course}
                                        </label>
                                    ))}
                                </div>

                                {/* Search */}
                                <input
                                    type="text"
                                    placeholder="Search packages"
                                    className="border border-gray-300 rounded p-2 w-full mb-4 text-black"
                                />

                                {/* Package */}
                                <table className="min-w-full mb-4">
                                    <thead>
                                        <tr className="border-b border-black">
                                            <th className="text-left text-black">Package</th>
                                            <th className="text-center text-black">Install</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {['vim', 'python3', 'imagemagick'].map((packageName) => (
                                            <tr key={packageName}>
                                                <td className="text-black">{packageName}</td>
                                                <td className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={packages.includes(packageName)}
                                                        onChange={() => handlePackageChange(packageName)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* DockerFile */}
                            <div className="w-1/2 pl-4">
                                {isAdvancedDetailsOpen && (
                                    <>
                                        <label className="block mb-2 text-black">Docker File:</label>
                                        <textarea
                                            className="border border-gray-300 rounded p-2 w-full h-60 text-black"
                                            placeholder="Type your Dockerfile content here..."
                                            value={dockerFileContent}
                                            onChange={(e) => setDockerFileContent(e.target.value)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            {/* Advanced Details Button */}
                            <button
                                className={`bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ${
                                    isAdvancedDetailsOpen ? "bg-gray-300" : ""
                                }`}
                                onClick={() => setIsAdvancedDetailsOpen(!isAdvancedDetailsOpen)}
                            >
                                {isAdvancedDetailsOpen ? "Hide Advanced Details" : "Show Advanced Details"}
                            </button>

                            {/* Cancel and Update Buttons */}
                            <div className="flex space-x-4">
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleUpdateImage}>
                                    Update
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default EditImageModal;
