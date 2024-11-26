import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

const socket = io(`${process.env.backend}`, {
  withCredentials: true,
});

const normalizeDockerImageName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_.-]+/g, "_")
};

function NewImageForm() {
  const [imageName, setImageName] = useState("");
  const [description, setDescription] = useState("");
  const [additionalPackages, setAdditionalPackages] = useState("");
  const [extraDockerFileContent, setExtraDockerFileContent] = useState("");
  const [buildStatus, setBuildStatus] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const { profile } = useProfile();

  const statusRef = useRef<HTMLPreElement>(null);
  const router = useRouter();

  useEffect(() => {
    socket.on("build_status", (data) => {
      setBuildStatus((prevStatus) => `${prevStatus}\n${data.status}`);
    });

    socket.on("build_complete", () => {
      setBuildStatus((prevStatus) => `${prevStatus}\nBuild complete!`);
      setIsBuilding(false);
      router.push('/images');
    });

    socket.on("build_error", (error) => {
      setBuildStatus((prevStatus) => `${prevStatus}\nError: ${error.error}`);
      setIsBuilding(false);
    });

    return () => {
      socket.off("build_status");
      socket.off("build_complete");
      socket.off("build_error");
    };
  }, []);

  useEffect(() => {
    if (statusRef.current) {
      statusRef.current.scrollTop = statusRef.current.scrollHeight;
    }
  }, [buildStatus]);

  const handleBuildImage = async () => {
    if (imageName.trim() === "") {
      alert("Image name cannot be empty.");
      return;
    }

    const normalizedImageName = normalizeDockerImageName(imageName);
    setIsBuilding(true);
    setBuildStatus("Starting image build...");

    const dockerfileContent = `
      ${extraDockerFileContent}
    `;

    try {
      let altDesc = "No description";
      if (description !== "") {
        altDesc = description
      }
      const response = await fetch(`${process.env.backend}/images/search`, {
        credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: profile?.user_id,
          description: altDesc,
          additional_packages: additionalPackages, 
          dockerfile_content: dockerfileContent,
          image_tag: normalizedImageName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown server error");
      }

      const result = await response.json();
      if (result.message === "Image already exists") {
        alert(`An image with this hash already exists.`);
      }
      setBuildStatus((prevStatus) => `${prevStatus}\n${result.message}`);
      router.back();
    } catch (error) {
      setBuildStatus((prevStatus) => `${prevStatus}\nError: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="font-bold text-4xl mb-6">New Image</h1>

      {/* Image Name Section */}
      <div className="mb-6 rounded-lg shadow-md bg-surface">
        <h2 className="block font-bold text-2xl mb-4">
          Image Name
        </h2>
        <input
          id="imageName"
          type="text"
          value={imageName}
          onChange={(e) => setImageName(normalizeDockerImageName(e.target.value))}
          className="border rounder p-1 bg-surface w-full mb-4"
          placeholder="Enter image name"
        />
      </div>

      {/* Description Section */}
      <div className="mb-6 rounded-lg shadow-md bg-surface">
        <h2 className="block font-bold text-2xl mb-4">
          Description
        </h2>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-1 bg-surface w-full h-24 mb-4"
          placeholder="Enter image description"
        />
      </div>

      {/* Dockerfile Section */}
      <div className="mb-8 rounded-lg shadow-md bg-surface">
        <h2 className="text-2xl font-bold mb-4">Dockerfile</h2>
        <div className="bg-surface p-4 rounded border">
          <pre className="whitespace-pre-wrap">
            <span>FROM beluga_base_ubuntu</span>
            <br />
            <span>RUN apt update && apt install git curl wget build-essential </span>
            <input
              type="text"
              value={additionalPackages}
              onChange={(e) => setAdditionalPackages(e.target.value)}
              className="border rounder p-1 bg-surface w-2/4 mb-4"
              placeholder="Enter additional packages"
            />
            <br />
          </pre>
          <textarea
            className="border rounded p-2 w-full h-40 bg-surface text-on-surface"
            value={extraDockerFileContent}
            onChange={(e) => setExtraDockerFileContent(e.target.value)}
            placeholder="Add additional Dockerfile content here..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center mt-4 bg-none ">
        <button
          className="mr-3 bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          className={`px-4 py-2 rounded ${
            isBuilding || !imageName.trim()
              ? "bg-gray-500 text-gray-700 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={handleBuildImage}
          disabled={isBuilding || !imageName.trim()}
        >
          {isBuilding ? "Building..." : "Build"}
        </button>

      </div>

      {/* Build Status Section */}
      <div className="mt-8 rounded-lg shadow-md bg-surface">
        <h2 className="text-2xl font-bold mb-4">Build Status</h2>
        <pre
          ref={statusRef}
          className="border rounded p-4 bg-surface min-h-[600px] h-40 overflow-auto text-on-surface"
        >
          {buildStatus}
        </pre>
      </div>
    </div>
  );
}

export default NewImageForm;
