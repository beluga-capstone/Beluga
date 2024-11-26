"use client";
import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import React, { useEffect, useState } from "react";
import AssignmentForm from "../../../../components/AssignmentsForm";
import { useRouter } from "next/navigation";
import { toLocalISOString } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const EditAssignment = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchAssignmentsById, updateAssignment, deleteAssignment } =
    useAssignments();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [lockAt, setLockAt] = useState("");
  const [unlockAt, setUnlockAt] = useState("");
  const [publishAt, setPublishAt] = useState("");
  const [allowsLateSubmissions, setAllowsLateSubmissions] = useState(false);
  const [imageId, setImageId] = useState(assignment?.docker_image_id || "");

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
    const loadAssignment = async () => {
      setLoading(true);
      try {
        const fetchedAssignment = await fetchAssignmentsById(params.id);
        if (fetchedAssignment) {
          setAssignment(fetchedAssignment);
          setTitle(fetchedAssignment.title || "");
          setDescription(fetchedAssignment.description || "");
          setDueAt(formatDate(fetchedAssignment.due_at));
          setLockAt(formatDate(fetchedAssignment.lock_at));
          setUnlockAt(formatDate(fetchedAssignment.unlock_at));
          setPublishAt(formatDate(fetchedAssignment.publish_at));
          setAllowsLateSubmissions(!!fetchedAssignment.allows_late_submissions);
          setImageId(fetchedAssignment.docker_image_id || "");
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
        router.push("/assignments");
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [params.id, router]);

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

  const handleDelete = async () => {
    const courseId = assignment?.course_id || searchParams.get("courseId");

    if (!assignment?.assignment_id || !courseId) {
      console.error("Assignment ID or Course ID is missing");
      return;
    }

    try {
      console.log("Course ID fetched for deletion:", courseId);
      // Pass both assignmentId and courseId to the deleteAssignment function
      await deleteAssignment(assignment.assignment_id, courseId);
    } catch (error: any) {
      console.error("Error deleting assignment:", error);
      if (error?.response?.data?.error) {
        console.error("API Error:", error.response.data.error);
      } else {
        console.error("An unexpected error occurred");
      }
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
        dueAt={dueAt}
        setDueAt={setDueAt}
        imageId={imageId}
        setImageId={setImageId}
      />
      <div className="flex justify-between">
        <div className="flex gap-x-3">
          <Button
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleDelete}
            // href="/assignments"
          >
            Delete
          </Button>
          <div className="">
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
