"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AssignmentForm from "../../../../components/AssignmentsForm";

const EditAssignment = ({ params }: { params: { id: string } }) => {
  const assignmentId = parseInt(params.id, 10);
  const { assignments, updateAssignment, deleteAssignment } = useAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.id === assignmentId
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseName = searchParams.get("name") || `Course ${assignment?.courseId}`;

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [releaseDate, setReleaseDate] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [containerId, setContainerId] = React.useState(
    assignment?.containerId || -1
  );
  const [courseId, setCourseId] = React.useState<number | undefined>(
    assignment?.courseId
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
      setCourseId(assignment.courseId);
    }
  }, [assignment]);

  const handleSave = () => {
    console.log("Navigating with courseId:", courseId, "and courseName:", courseName);
    updateAssignment(
      assignmentId,
      title,
      description,
      new Date(releaseDate),
      new Date(dueDate),
      containerId,
      courseId || 0
    );
    const courseNameQuery = encodeURIComponent(courseName);
    router.push(`/assignments/courses/${courseId}?name=${courseNameQuery}`);
  };
  

  const handleDelete = () => {
    deleteAssignment(assignmentId);
    if (courseId !== undefined) {
      router.push(`/assignments/courses/${courseId}?name=${encodeURIComponent(courseName)}`);
    }
  };

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
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
        <div className="flex">
          <div className="p-2">
            <Button
              className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
          <div className="p-2">
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              onClick={handleSave}
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
