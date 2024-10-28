"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React from "react";
import AssignmentForm from "../../../../components/AssignmentsForm";

const EditAssignment = ({ params }: { params: { id: string } }) => {
  const assignmentId = parseInt(params.id, 10);
  const { assignments } = useAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.id === assignmentId
  );
  const { updateAssignment, deleteAssignment } = useAssignments();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [releaseDate, setReleaseDate] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [containerId, setContainerId] = React.useState(
    assignment?.containerId || -1
  );

  React.useEffect(() => {
    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description);
      setReleaseDate(
        new Date(assignment.releaseDate).toISOString().split("T")[0]
      );
      setDueDate(new Date(assignment.dueDate).toISOString().split("T")[0]);
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
        releaseDate={releaseDate}
        setReleaseDate={setReleaseDate}
        dueDate={dueDate}
        setDueDate={setDueDate}
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
                  new Date(releaseDate),
                  new Date(dueDate),
                  containerId
                )
              }
              href="/assignments"
              disabled={!title || !releaseDate || !dueDate}
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
