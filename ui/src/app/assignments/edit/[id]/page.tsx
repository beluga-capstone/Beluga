"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import { useContainers } from "@/hooks/useContainers";
import React from "react";

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
  const { containers } = useContainers();
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
      <h2>Assignment Name</h2>
      <div className="pt-2 pb-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="border rounded p-1 bg-surface"
          placeholder="Assignment name"
          aria-label="Assignment name"
        />
      </div>

      <h2>Description</h2>
      <div className="pt-2 pb-8">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-1 bg-surface w-3/4"
          placeholder="Description"
          aria-label="Description"
          rows={5}
        />
      </div>

      <h2>Release Date</h2>
      <div className="pt-2 pb-8">
        <input
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          type="date"
          className="border rounded p-1 bg-surface dark:[color-scheme:dark]"
          placeholder="Release Date"
          aria-label="Release Date"
        />
      </div>

      <h2>Due Date</h2>
      <div className="pt-2 pb-8">
        <input
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          type="date"
          className="border rounded p-1 bg-surface dark:[color-scheme:dark]"
          placeholder="Due Date"
          aria-label="Due Date"
        />
      </div>

      <h2>Container</h2>
      <div className="pt-2 pb-8">
        <select
          title="Container"
          value={containerId}
          onChange={(e) => setContainerId(parseInt(e.target.value))}
          className="border rounded p-1 bg-surface"
        >
          <option value={-1}>Select a container</option>
          {containers.map((container) => (
            <option key={container.id} value={container.id}>
              {container.name}
            </option>
          ))}
        </select>
      </div>

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
