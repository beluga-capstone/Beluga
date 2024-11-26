"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Button from "@/components/Button";

const EditCourse: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId; // Ensure courseId is a string

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState(""); // Track the original name for comparison

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) {
        console.error("Course ID is missing.");
        router.push("/");
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/courses/${courseId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }
        const course = await response.json();
        setName(course.name || "");
        setOriginalName(course.name || ""); // Set the original name
      } catch (error) {
        console.error("Error loading course:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [courseId, router]);

  const handleUpdateCourse = async () => {
    if (!courseId) {
      console.error("Course ID is missing.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      console.log("Course updated successfully");
      router.push("/"); // Redirect to the dashboard after updating
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  // Check if any changes have been made
  const hasChanges = name.trim() !== originalName.trim();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Edit Course</h1>

      <div className="flex flex-col w-1/5 mb-8">
        <label className="font-semibold mb-1" htmlFor="course-name">
          Course Name
        </label>
        <input
          id="course-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 bg-surface"
        />
      </div>

      <div className="flex flex-row justify-end pt-4 space-x-2">
        <Button className="bg-gray-500 text-white px-4 py-2 rounded" href="/">
          Cancel
        </Button>
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleUpdateCourse}
          disabled={!hasChanges || !name.trim()} // Disable if no changes or empty name
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditCourse;
