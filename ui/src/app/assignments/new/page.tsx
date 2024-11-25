"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React, { useState, useEffect } from "react";
import AssignmentForm from "../../../components/AssignmentsForm";
import { toLocalISOString } from "@/lib/utils";
import { useRouter,useSearchParams } from "next/navigation";

const NewAssignment: React.FC = () => {
  const { assignments, addAssignment } = useAssignments();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [publishAt, setPublishAt] = React.useState("");
  const [dueAt, setDueAt] = React.useState("");
  const [lockAt, setLockAt] = React.useState("");
  const [unlockAt, setUnlockAt] = React.useState("");
  const [allowsLateSubmissions, setAllowsLateSubmissions] =
    React.useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // if select image, then unselect,imageid will be -1, fix it
  useEffect(() => {
    if (imageId === "-1") setImageId(null);
  }, [imageId]);

  const handleAddAssignment = async () => {
    if (!courseId) {
      console.log("Course ID is missing!");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/assignments/course/${courseId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch assignments for the course.");
      }
      const courseAssignments = await response.json();
      const isDuplicate = courseAssignments.some(
        (assignment: any) => assignment.title.toLowerCase() === title.toLowerCase()
      );
  
      if (isDuplicate) {
        setError("An assignment with this title already exists in the course.");
        return;
      }
      
      setError("");
      await addAssignment(
        courseId,
        title,
        description,
        new Date(dueAt),
        allowsLateSubmissions ? new Date(lockAt) : new Date(dueAt),
        new Date(unlockAt),
        new Date(publishAt),
        allowsLateSubmissions,
        imageId || null
      );
  
      router.push(`/assignments/courses/${courseId}`);
    } catch (error) {
      console.error("Error checking for duplicates or adding assignment:", error);
      setError("An error occurred while adding the assignment. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">New Assignment</h1>

      <AssignmentForm
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        publishAt={publishAt}
        setPublishAt={setPublishAt}
        dueAt={dueAt}
        setDueAt={setDueAt}
        lockAt={lockAt}
        setLockAt={setLockAt}
        unlockAt={unlockAt}
        setUnlockAt={setUnlockAt}
        allowsLateSubmissions={allowsLateSubmissions}
        setAllowsLateSubmissions={setAllowsLateSubmissions}
        imageId={imageId}
        setImageId={setImageId}
      />

      {error && <p className="text-red-500 my-2">{error}</p>}

      <div className="flex flex-column">
        <div className="mr-2">
          <Button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            href={`/assignments?courseId=${courseId}`}
          >
            Cancel
          </Button>
        </div>
        <div className="">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleAddAssignment}
            disabled={!title || !courseId}
          >
            Add Assignment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewAssignment;
