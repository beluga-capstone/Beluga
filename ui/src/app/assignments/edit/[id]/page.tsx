"use client";
import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React, { useEffect, useState } from "react";
import AssignmentForm from "../../../../components/AssignmentsForm";
import { toLocalISOString } from "@/lib/utils";

const EditAssignment = ({ params }: { params: { id: string } }) => {
  const { assignments } = useAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.assignment_id === params.id
  );
  const { updateAssignment, deleteAssignment } = useAssignments();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [lockAt, setLockAt] = useState("");
  const [unlockAt, setUnlockAt] = useState("");
  const [publishAt, setPublishAt] = useState("");
  const [allowsLateSubmissions, setAllowsLateSubmissions] = useState(false);
  const [imageId, setImageId] = useState(assignment?.docker_image_id || null);

  const formatDate = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Invalid date
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title || "");
      setDescription(assignment.description || "");
      setDueAt(formatDate(assignment.due_at));
      setLockAt(formatDate(assignment.lock_at));
      setUnlockAt(formatDate(assignment.unlock_at));
      setPublishAt(formatDate(assignment.publish_at));
      setAllowsLateSubmissions(!!assignment.allows_late_submissions);
      setImageId(assignment.docker_image_id || null);
    }
  }, [assignment]);

  const handleUpdate = () => {
    try {
      if (!assignment?.assignment_id) {
        console.error("No assignment ID found");
        return;
      }

      if (!title.trim()) {
        console.error("Title is required");
        return;
      }

      updateAssignment(
        assignment.assignment_id,
        assignment.course_id,
        title.trim(),
        description.trim(),
        new Date(toLocalISOString(dueAt)),
        allowsLateSubmissions
          ? new Date(toLocalISOString(lockAt))
          : new Date(toLocalISOString(dueAt)),
        new Date(toLocalISOString(unlockAt)),
        new Date(toLocalISOString(publishAt)),
        allowsLateSubmissions,
        imageId
      );
      window.history.back();
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  const handleDelete = () => {
    if (!assignment?.assignment_id) {
      console.error("No assignment ID found");
      return;
    }
    deleteAssignment(assignment.assignment_id);
  };

  if (!assignment) {
    return <div>Loading...</div>;
  }

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
        imageId={imageId}
        setImageId={setImageId}
      />
      <div className="flex flex-column justify-between">
        <div className="flex">
          <div className="mr-3">
            <Button
              className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
              onClick={handleDelete}
              href="/assignments"
            >
              Delete
            </Button>
          </div>
          <div className="mr-3">
            <Button
              className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
          <div className="">
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              onClick={handleUpdate}
              disabled={!title.trim()}
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
