"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React, { useState, useEffect } from "react";
import AssignmentForm from "../../../components/AssignmentsForm";

const NewAssignment: React.FC = () => {
  const { assignments, addAssignment } = useAssignments();
  const courseId = "1f3999da-09c1-4e6b-898b-139d417cddac";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishAt, setPublishAt] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [lockAt, setLockAt] = useState("");
  const [unlockAt, setUnlockAt] = useState("");
  const [allowsLateSubmissions, setAllowsLateSubmissions] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [duplicateName, setDuplicateName] = useState("");

  // if select image, then unselect,imageid will be -1, fix it
  useEffect(() => {
    if (imageId === "-1") setImageId(null);
  }, [imageId]);

  useEffect(() => {
    if (title === duplicateName && duplicateName) {
      setError("Assignment title must be unique.");
    } else {
      setError("");
    }
  }, [title, duplicateName]);

  const handleAddAssignment = () => {
    const isDuplicate = assignments.some(
      (assignment) =>
        assignment.title &&
        assignment.title.toLowerCase() === title.toLowerCase()
    );

    if (isDuplicate) {
      setError("Assignment title must be unique.");
      setDuplicateName(title);
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
    window.history.back();
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
            href="/assignments"
          >
            Cancel
          </Button>
        </div>
        <div className="">
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
