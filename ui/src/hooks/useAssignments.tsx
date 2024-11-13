"use client";

import { useEffect, useState } from "react";
import { Assignment } from "@/types";

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:5000/assignments');
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }
      const data = await response.json();

      const transformedData = data.map((assignment: any) => ({
        assignmentId: assignment.assignment_id,
        courseId: assignment.course_id,
        title: assignment.title,
        description: assignment.description,
        dueAt: assignment.due_at ? new Date(assignment.due_at) : null,
        lockAt: assignment.lock_at ? new Date(assignment.lock_at) : null,
        unlockAt: assignment.unlock_at ? new Date(assignment.unlock_at) : null,
        userId: assignment.user_id,
        imageId: assignment.docker_image_id,
      }));

      setAssignments(transformedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // add an assignment to the db
  const saveAssignment = async (newAssignment: Assignment) => {
    try {
      const response = await fetch('http://localhost:5000/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAssignment),
      });

      if (!response.ok) {
        throw new Error('Failed to add assignment');
      }

      const data = await response.json();
      setAssignments((prev) => [...prev, data]);
    } catch (err) {
      console.log(err);
    }
  };

  const addAssignment = async (
    courseId: string,
    title: string,
    description: string,
    dueAt: Date,
    lockAt: Date,
    unlockAt: Date,
    publishAt: Date,
    allowsLateSubmissions: boolean,
    imageId: string
  ) => {
    const newAssignment: Assignment = {
      assignmentId: Date.now().toString(),
      courseId,
      title,
      description,
      dueAt,
      lockAt,
      unlockAt,
      isUnlocked: Date.now() >= unlockAt.getTime(),
      isPublished: Date.now() >= publishAt.getTime(),
      publishAt,
      allowsLateSubmissions,
      imageId: imageId,
    };

    await saveAssignment(newAssignment);
  };

  const updateAssignment = async (
    assignmentId: number,
    title: string,
    description: string,
    dueAt: Date,
    lockAt: Date,
    unlockAt: Date,
    publishAt: Date,
    allowsLateSubmissions: boolean,
    containerId: number
  ) => {
    const updatedAssignment = {
      assignmentId,
      title,
      description,
      dueAt,
      lockAt,
      unlockAt,
      isUnlocked: Date.now() >= unlockAt.getTime(),
      isPublished: Date.now() >= publishAt.getTime(),
      publishAt,
      allowsLateSubmissions,
      imageId: containerId,
    };

    try {
      const response = await fetch(`http://localhost:5000/assignments/${assignmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAssignment),
      });

      if (!response.ok) {
        throw new Error('Failed to update assignment');
      }

      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.assignmentId === assignmentId ? updatedAssignment : assignment
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAssignment = async (assignmentId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/assignments/${assignmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.log("failed del",assignmentId);
        throw new Error('Failed to delete assignment ');
      }

      setAssignments((prev) =>
        prev.filter((assignment) => assignment.assignmentId !== assignmentId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const setPublished = async (assignmentId: number, isPublished: boolean) => {
    try {
      const updatedAssignment = { isPublished };

      const response = await fetch(`http://localhost:5000/assignments/${assignmentId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAssignment),
      });

      if (!response.ok) {
        throw new Error('Failed to update publish status');
      }

      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.assignmentId === assignmentId ? { ...assignment, isPublished } : assignment
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const setLateSubmissions = async (
    assignmentId: number,
    allowsLateSubmissions: boolean
  ) => {
    try {
      const updatedAssignment = { allowsLateSubmissions };

      const response = await fetch(`http://localhost:5000/assignments/${assignmentId}/late-submissions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAssignment),
      });

      if (!response.ok) {
        throw new Error('Failed to update late submissions setting');
      }

      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.assignmentId === assignmentId ? { ...assignment, allowsLateSubmissions } : assignment
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return {
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    setPublished,
    setLateSubmissions,
  };
};

