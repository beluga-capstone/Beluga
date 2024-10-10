"use client";
import React, {useState} from "react";
import { Icon } from "@iconify/react";
import Draggable from "react-draggable";

// Define the type for the props
interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddImageModal({ isOpen, onClose }: AddImageModalProps) {
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isAdvancedDetailsOpen, setIsAdvancedDetailsOpen] = useState(false);
  const [dockerFileContent, setDockerFileContent] = useState("");

  if (!isOpen) return null; // Prevent rendering if not open

  return (
    <Draggable handle=".modal-header">
      <div className="bg-white shadow-lg rounded-lg p-5 w-5/6 h-4/5 flex flex-col ml-28 mt-8">
        <div className="modal-header flex justify-between items-center cursor-move">
            <div></div>
            <div className="flex justify-end space-x-2 mb-4">
                <button className="text-black" onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? (
                    <Icon icon="mdi:window-maximize" width="20" height="20" />
                ) : (
                    <Icon icon="mdi:window-minimize" width="20" height="20" />
                )}
                </button>
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
                    placeholder="Enter image name"
                    className="border border-gray-300 rounded p-2 w-full mb-4"
                    />
                    
                    {/* Course Assign */}
                    <label className="block mb-2 text-black">Courses Assigned:</label>
                    <div className="mb-4">
                    {['CSCE 121', 'CSCE 313', 'CSCE 410'].map((course) => (
                        <label key={course} className="flex items-center text-black">
                        <input type="checkbox" className="mr-2" /> {course}
                        </label>
                    ))}
                    </div>
                    
                    {/* Search */}
                    <input
                    type="text"
                    placeholder="Search packages"
                    className="border border-gray-300 rounded p-2 w-full mb-4"
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
                        {['vim', 'python3', 'imagemagick'].map((packageName, index) => (
                        <tr key={index}>
                            <td className="text-black">{packageName}</td>
                            <td className="text-center">
                            <input type="checkbox" />
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
                        onChange={(e) => setDockerFileContent(e.target.value)}
                        />
                    </>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mt-4">
                {/* Advanced Details Button */}
                <button
                    className={`bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 ${isAdvancedDetailsOpen ? 'bg-gray-300' : ''}`}
                    onClick={() => setIsAdvancedDetailsOpen(!isAdvancedDetailsOpen)}
                >
                    {isAdvancedDetailsOpen ? "Hide Advanced Details" : "Show Advanced Details"}
                </button>

                {/* Delete and Create Buttons */}
                <div className="flex space-x-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Delete
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Create
                    </button>
                </div>
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
}

export default AddImageModal;