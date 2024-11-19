"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React from "react";
import AssignmentForm from "../../../components/AssignmentsForm";

const NewAssignment: React.FC = () => {
  const { addAssignment } = useAssignments();
  const courseId = "84d8445d-f12c-467a-8d2f-3ee03b5dd10e";
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [publishAt, setPublishAt] = React.useState("");
  const [dueAt, setDueAt] = React.useState("");
  const [lockAt, setLockAt] = React.useState("");
  const [unlockAt, setUnlockAt] = React.useState("");
  const [allowsLateSubmissions, setAllowsLateSubmissions] =
    React.useState(false);
  const [imageId, setImageId] = React.useState("");

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
            href="/assignments"
          >
            Cancel
          </Button>
        </div>
        <div className="p-2">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={() =>
              addAssignment(
                courseId,
                title,
                description,
                new Date(dueAt),
                allowsLateSubmissions ? new Date(lockAt) : new Date(dueAt),
                new Date(unlockAt),
                new Date(publishAt),
                allowsLateSubmissions,
                imageId
              )
            }
            href="/assignments"
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
