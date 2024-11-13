"use client";
import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React from "react";
import AssignmentForm from "../../../../components/AssignmentsForm";

const EditAssignment = ({ params }: { params: { id: string } }) => {
  const { assignments } = useAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.assignmentId === params.id
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
  const [imageId, setImageId] = React.useState(assignment?.imageId || "");

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

  React.useEffect(() => {
    if (assignment) {
      setTitle(assignment.title || "");
      setDescription(assignment.description || "");
      setDueAt(formatDate(assignment.dueAt));
      setLockAt(formatDate(assignment.lockAt));
      setUnlockAt(formatDate(assignment.unlockAt));
      setIsUnlocked(!!assignment.isUnlocked);
      setIsPublished(!!assignment.isPublished);
      setPublishAt(formatDate(assignment.publishAt));
      setAllowsLateSubmissions(!!assignment.allowsLateSubmissions);
      setImageId(assignment.imageId || "");
    }
  }, [assignment]);

  // Helper function to safely create Date object
  const createSafeDate = (dateString: string): Date => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${dateString}`);
    }
    return date;
  };

  const prettyDateToIso = (formattedDate: string): Date => {
    return new Date(formattedDate);
    //const date = new Date(formattedDate);
    //return date.toISOString().split('T')[0]; 
  };

  const handleUpdate = () => {
    try {
      if (!assignment?.assignmentId) {
        console.error("No assignment ID found");
        return;
      }

      if (!title.trim()) {
        console.error("Title is required");
        return;
      }

      //console.log("update due with ",prettyDateToIso(dueAt));
      updateAssignment(
        assignment.assignmentId,
        assignment.courseId,
        title.trim(),
        description.trim(),
        prettyDateToIso(dueAt),
        allowsLateSubmissions ? prettyDateToIso(lockAt) : prettyDateToIso(dueAt),
        prettyDateToIso(unlockAt),
        prettyDateToIso(publishAt),
        allowsLateSubmissions,
        imageId
      );
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  const handleDelete = () => {
    if (!assignment?.assignmentId) {
      console.error("No assignment ID found");
      return;
    }
    deleteAssignment(assignment.assignmentId);
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
        <div className="p-2">
          <Button
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleDelete}
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
              onClick={handleUpdate}
              href="/assignments"
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
