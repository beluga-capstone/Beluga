"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React, {useState,useEffect} from "react";
import AssignmentForm from "../../../components/AssignmentsForm";

const NewAssignment: React.FC = () => {
  const { addAssignment } = useAssignments();
  const courseId = "2a854c84-a873-4b61-8eb0-4e5c18384c42";
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [publishAt, setPublishAt] = React.useState("");
  const [dueAt, setDueAt] = React.useState("");
  const [lockAt, setLockAt] = React.useState("");
  const [unlockAt, setUnlockAt] = React.useState("");
  const [allowsLateSubmissions, setAllowsLateSubmissions] =
    React.useState(false);
  const [imageId, setImageId] = useState<string | null>(null);

  // if select image, then unselect,imageid will be -1, fix it
  useEffect(()=>{
    if (imageId === "-1") setImageId(null);
  }, [imageId]);

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
                imageId || null
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
