"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import { useContainers } from "@/hooks/useContainers";
import React from "react";
import AssignmentForm from "../../../components/AssignmentsForm";
import { useRouter, useSearchParams } from "next/navigation";

const NewAssignment: React.FC = () => {
  const { addAssignment } = useAssignments();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [releaseDate, setReleaseDate] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const { containers } = useContainers();
  const [containerId, setContainerId] = React.useState(-1);

  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const handleAddAssignment = () => {
    if (courseId) {
      addAssignment(
        title,
        description,
        new Date(releaseDate),
        new Date(dueDate),
        containerId,
        parseInt(courseId)
      );
      router.push(`/assignments/courses/${courseId}`);
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
        releaseDate={releaseDate}
        setReleaseDate={setReleaseDate}
        dueDate={dueDate}
        setDueDate={setDueDate}
        containerId={containerId}
        setContainerId={setContainerId}
      />

      <div className="flex flex-column justify-end">
        <div className="p-2">
          <Button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            href={`/assignments/courses/${courseId}`}
          >
            Cancel
          </Button>
        </div>
        <div className="p-2">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleAddAssignment}
            disabled={!title || !releaseDate || !dueDate}
          >
            Add Assignment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewAssignment;
