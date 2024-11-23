import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

const socket = io("http://localhost:5000");

// Normalization function for Docker image names
const normalizeDockerImageName = (name: string) => {
  return name
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9_.-]+/g, "_") // Replace invalid characters with '_'
};

function NewImageForm() {
  const [isAdvancedDetailsOpen, setIsAdvancedDetailsOpen] = useState(false);
  const [imageName, setImageName] = useState("");
  const [courses, setSelectedCourses] = useState<string[]>([]);
  const [packages, setSelectedPackages] = useState<string[]>([]);
  const [dockerFileContent, setDockerFileContent] = useState("");
  const [buildStatus, setBuildStatus] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const { profile } = useProfile();

  const statusRef = useRef<HTMLPreElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const router = useRouter();

  useEffect(() => {
    socket.on("build_status", (data) => {
      setBuildStatus((prevStatus) => `${prevStatus}\n${data.status}`);
    });

    socket.on("build_complete", (data) => {
      setBuildStatus((prevStatus) => `${prevStatus}\nBuild complete!`);
      setIsBuilding(false);
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

  const handleScroll = () => {
    if (statusRef.current) {
      const atBottom =
        statusRef.current.scrollHeight - statusRef.current.scrollTop ===
        statusRef.current.clientHeight;
      setIsUserScrolling(!atBottom);
    }
  };

  const handleCourseChange = (course: string) => {
    setSelectedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  const handlePackageChange = (packageName: string) => {
    setSelectedPackages((prev) =>
      prev.includes(packageName)
        ? prev.filter((p) => p !== packageName)
        : [...prev, packageName]
    );
  };

  const handleBuildImage = async () => {
    if (imageName.trim() === "") {
      alert("Image name cannot be empty.");
      return;
    }

    const normalizedImageName = normalizeDockerImageName(imageName);
    setIsBuilding(true);
    setBuildStatus("Starting image build...");

    const dockerfileContent =
      dockerFileContent ||
      `FROM python:3.8-slim\nRUN apt-get update && apt-get install -y ${packages.join(
        " "
      )}`;

    try {
      const response = await fetch("http://localhost:5000/images/build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dockerfile_content: dockerfileContent,
          user_id: profile?.user_id,
          description: `Image for ${normalizedImageName}`,
          image_tag: normalizedImageName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown server error");
      }

      const result = await response.json();
      if (result.message === "Image already exists") {
        alert(`This image already exists!`);
      }
      setBuildStatus((prevStatus) => `${prevStatus}\n${result.message}`);
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setBuildStatus((prevStatus) => `${prevStatus}\nError: ${error.message}`);
      } else {
        setBuildStatus(
          (prevStatus) =>
            `${prevStatus}\nError: An unknown error occurred`
        );
      }
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">New Image</h1>
      <div className="mb-4">
        <h2>Image Name</h2>
        <div className="pt-2 pb-8">
          <input
            id="imageName"
            type="text"
            value={imageName}
            onChange={(e) => setImageName(normalizeDockerImageName(e.target.value))}
            className="border rounded p-1 bg-surface"
            placeholder="Image Name"
          />
        </div>
      </div>

      <div className="mb-4">
        <h2>Courses Assigned:</h2>
        <div className="mb-4">
          {["CSCE 121", "CSCE 313", "CSCE 410"].map((course) => (
            <label key={course} className="flex items-center bg-surface">
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
            {["vim", "python3", "imagemagick"].map((packageName) => (
              <tr key={packageName}>
                <td className="bg-surface">{packageName}</td>
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

      <div className="flex justify-between items-center mt-4">
        <button
          className={`border rounded p-1 bg-surface ${
            isAdvancedDetailsOpen ? "bg-gray-300" : ""
          }`}
          onClick={() => setIsAdvancedDetailsOpen(!isAdvancedDetailsOpen)}
        >
          {isAdvancedDetailsOpen ? "Hide Advanced Details" : "Show Advanced Details"}
        </button>

        <div className="flex space-x-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleBuildImage}
            disabled={isBuilding}
          >
            {isBuilding ? "Building..." : "Create"}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-2xl mb-4">Build Status:</h2>
        <pre
          ref={statusRef}
          onScroll={handleScroll}
          className="border rounded p-2 bg-surface w-full h-40 overflow-auto"
        >
          {buildStatus}
        </pre>
      </div>
    </div>
  );
}

export default NewImageForm;

