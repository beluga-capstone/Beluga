"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React, { useState, useEffect } from "react";
import AssignmentForm from "../../../components/AssignmentsForm";
import { useRouter } from "next/navigation";

const NewAssignment: React.FC = () => {
  const { assignments, addAssignment } = useAssignments();
  const router = useRouter();
  const courseId = "6d37fdc4-77ed-42cc-bb57-4dc59fd683a0";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishAt, setPublishAt] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [lockAt, setLockAt] = useState("");
  const [unlockAt, setUnlockAt] = useState("");
  const [allowsLateSubmissions, setAllowsLateSubmissions] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (imageId === "-1") setImageId(null);
  }, [imageId]);

  const handleAddAssignment = () => {
    const isDuplicate = assignments.some(
      (assignment) =>
        assignment.title &&
        assignment.title.toLowerCase() === title.toLowerCase()
    );
  
    if (isDuplicate) {
      setError("Assignment title must be unique.");
      return;
    }
    setError("");
  
    addAssignment(
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
    router.push("/assignments");
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

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="flex flex-column justify-end">
        <div className="p-2">
          <Button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            href="/assignments"
          >
            Cancel
          </Button>
        </div>
        <div className="p-2">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleAddAssignment}
            disabled={!title || error !== ""}
          >
            Add Assignment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewAssignment;
