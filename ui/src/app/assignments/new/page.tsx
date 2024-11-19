"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React from "react";
import AssignmentForm from "../../../components/AssignmentsForm";
import { useRouter, useSearchParams } from "next/navigation";

const NewAssignment: React.FC = () => {
  const { addAssignment, fetchAssignments } = useAssignments(); // Include fetchAssignments here
  const searchParams = useSearchParams();
  const router = useRouter();

  const courseId = searchParams.get("courseId") || "";
  const courseName = decodeURIComponent(searchParams.get("name") || "Unknown Course");

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [publishAt, setPublishAt] = React.useState("");
  const [dueAt, setDueAt] = React.useState("");
  const [lockAt, setLockAt] = React.useState("");
  const [unlockAt, setUnlockAt] = React.useState("");
  const [allowsLateSubmissions, setAllowsLateSubmissions] = React.useState(false);
  const [imageId, setImageId] = React.useState("");

  const handleAddAssignment = async () => {
    await addAssignment(
      courseId,
      title,
      description,
      new Date(dueAt),
      allowsLateSubmissions ? new Date(lockAt) : new Date(dueAt),
      new Date(unlockAt),
      new Date(publishAt),
      allowsLateSubmissions,
      imageId
    );

    await fetchAssignments();

    router.push(`/assignments/courses/${courseId}?courseId=${courseId}&name=${encodeURIComponent(courseName)}`);
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

      <div className="flex flex-column justify-end">
        <div className="p-2">
          <Button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            href={`/assignments/courses/${courseId}?courseId=${courseId}&name=${encodeURIComponent(courseName)}`}
          >
            Cancel
          </Button>
        </div>
        <div className="p-2">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleAddAssignment}
            disabled={!title}
          >
            Add Assignment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewAssignment;
