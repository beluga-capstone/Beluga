"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React, { useState, useEffect } from "react";
import AssignmentForm from "../../../../components/AssignmentsForm";
import { useRouter, useParams } from "next/navigation";
import { toLocalISOString } from "@/lib/utils";

const NewAssignment: React.FC = () => {
  const { addAssignment } = useAssignments();
  const params = useParams();
  const courseId = params.id;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishAt, setPublishAt] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [lockAt, setLockAt] = useState("");
  const [unlockAt, setUnlockAt] = useState("");
  const [allowsLateSubmissions, setAllowsLateSubmissions] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // Reset imageId if it's set to "-1"
  const handleAddAssignment = async () => {
    if (!courseId) {
      setError("Course ID is missing!");
      return;
    }

    try {
      // Fetch assignments for the course
      const response = await fetch(
        `${process.env.backend}/assignments/search?course_id=${courseId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      let courseAssignments = [];
      if (response.ok) {
        courseAssignments = await response.json();
      } else {
        const errorData = await response.json();
        if (errorData.error === "No assignments found for this course") {
          console.log(
            "No assignments found for this course. Proceeding to add a new assignment."
          );
          courseAssignments = []; // Treat as empty array
        } else {
          throw new Error("Failed to fetch assignments for this course.");
        }
      }

      const isDuplicate = courseAssignments.some(
        (assignment: any) =>
          assignment.title.toLowerCase() === title.toLowerCase()
      );

      if (isDuplicate) {
        setError("An assignment with this title already exists in the course.");
        return;
      }

      setError("");

      await addAssignment(
        Array.isArray(courseId) ? courseId[0] : courseId,
        title,
        description,
        new Date(toLocalISOString(dueAt)),
        allowsLateSubmissions && lockAt
          ? new Date(toLocalISOString(lockAt))
          : new Date(toLocalISOString(dueAt)),
        new Date(toLocalISOString(unlockAt)),
        new Date(toLocalISOString(publishAt)),
        allowsLateSubmissions,
        imageId || null
      );

      router.push(`/assignments/courses/${courseId}`);
    } catch (err) {
      console.error("Error adding assignment:", err);
      setError(
        "An error occurred while adding the assignment. Please try again."
      );
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
        <div>
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
