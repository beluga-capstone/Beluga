"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React from "react";
import AssignmentForm from "../../../../components/AssignmentsForm";

const EditAssignment = ({ params }: { params: { id: string } }) => {
  const assignmentId = parseInt(params.id, 10);
  const { assignments } = useAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.assignmentId === assignmentId
  );
  const { updateAssignment, deleteAssignment } = useAssignments();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueAt, setDueAt] = React.useState("");
  const [lockAt, setLockAt] = React.useState("");
  const [unlockAt, setUnlockAt] = React.useState("");
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [isPublished, setIsPublished] = React.useState(false);
  const [publishAt, setPublishAt] = React.useState("");
  const [allowsLateSubmissions, setAllowsLateSubmissions] = React.useState(false);
  const [containerId, setContainerId] = React.useState(
    assignment?.containerId || -1
  );

  React.useEffect(() => {
    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description);
      setDueAt(new Date(assignment.dueAt).toISOString().split("T")[0]);
      setLockAt(new Date(assignment.lockAt).toISOString().split("T")[0]);
      setUnlockAt(new Date(assignment.unlockAt).toISOString().split("T")[0]);
      setIsUnlocked(isUnlocked);
      setIsPublished(isPublished);
      setPublishAt(
        new Date(assignment.publishAt).toISOString().split("T")[0]
      );
      setAllowsLateSubmissions(assignment.allowsLateSubmissions);
      setContainerId(assignment.containerId);
    }
  }, [assignment]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Edit Assignment</h1>

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
        containerId={containerId}
        setContainerId={setContainerId}
      />

      <div className="flex flex-column justify-between">
        <div className="p-2">
          <Button
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
            onClick={() => deleteAssignment(assignmentId)}
            href="/assignments"
          >
            Delete
          </Button>
        </div>
        <div className="flex">
          <div className="p-2">
            <Button
              className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
          <div className="p-2">
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              onClick={() =>
                updateAssignment(
                  assignmentId,
                  title,
                  description,
                  new Date(dueAt),
                  allowsLateSubmissions ? new Date(lockAt) : new Date(dueAt),
                  new Date(unlockAt),
                  new Date(publishAt),
                  allowsLateSubmissions,
                  containerId
                )
              }
              href="/assignments"
              disabled={!title}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAssignment;
