"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import { useContainers } from "@/hooks/useContainers";
import React from "react";

const NewAssignment: React.FC = () => {
  const { addAssignment } = useAssignments();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [releaseDate, setReleaseDate] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const { containers } = useContainers();
  const [containerId, setContainerId] = React.useState(0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">New Assignment</h1>
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
          className="border rounded p-1 bg-surface"
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
          className="border rounded p-1 bg-surface"
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
          <option value={0}>Select a container</option>
          {containers.map((container) => (
            <option key={container.id} value={container.id}>
              {container.name}
            </option>
          ))}
        </select>
      </div>

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
                title,
                description,
                new Date(releaseDate),
                new Date(dueDate)
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
