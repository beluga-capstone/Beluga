"use client";

import { useEffect, useState } from "react";
import { Assignment } from "@/types";

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:5000/assignments/search', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }
      const data = await response.json();

      const transformedData = data.map((assignment: Assignment) => ({
        assignment_id: assignment.assignment_id,
        course_id: assignment.course_id,
        title: assignment.title,
        description: assignment.description,
        due_at: assignment.due_at ? new Date(assignment.due_at) : null,
        lock_at: assignment.lock_at ? new Date(assignment.lock_at) : null,
        unlock_at: assignment.unlock_at ? new Date(assignment.unlock_at) : null,
        user_id: assignment.user_id,
        docker_image_id: assignment.docker_image_id,
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
        credentials: 'include',
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
      fetchAssignments();
    } catch (err) {
      console.log(err);
    }
  };

  const addAssignment = async (
    course_id: string,
    title: string,
    description: string,
    due_at: Date,
    lock_at: Date,
    unlock_at: Date,
    publish_at: Date,
    allows_late_submissions: boolean,
    docker_image_id: string | null
  ) => {
    const newAssignment: Assignment = {
      assignment_id: Date.now().toString(),
      course_id,
      title,
      description,
      due_at,
      lock_at,
      unlock_at,
      is_unlocked: Date.now() >= unlock_at.getTime(),
      is_published: Date.now() >= publish_at.getTime(),
      publish_at,
      allows_late_submissions,
      docker_image_id: docker_image_id,
    };

    fetchAssignments();
    const saved = await saveAssignment(newAssignment);
    return saved;
  };

  const updateAssignment = async (
    assignment_id: string,
    course_id: string,
    title: string,
    description: string,
    due_at: Date,
    lock_at: Date,
    unlock_at: Date,
    publish_at: Date,
    allows_late_submissions: boolean,
    docker_image_id: string
  ) => {
    const updatedAssignment = {
      assignment_id: assignment_id,
      course_id: course_id,
      title:title,
      description:description,
      due_at:due_at,
      lock_at:lock_at,
      unlock_at:unlock_at,
      is_unlocked: Date.now() >= unlock_at.getTime(),
      is_published: Date.now() >= publish_at.getTime(),
      publish_at:publish_at,
      allows_late_submissions:allows_late_submissions,
      docker_image_id:docker_image_id,  
    };
    console.log("updating with",assignment_id,course_id,title,description,due_at,lock_at,unlock_at,docker_image_id)

    try {
      const response = await fetch(`http://localhost:5000/assignments/${assignment_id}`, {
        method: 'PUT',
        credentials: 'include',
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
          assignment.assignment_id === assignment_id ? updatedAssignment : assignment
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
        credentials: 'include',
      });

      if (!response.ok) {
        console.log("failed del",assignmentId);
        throw new Error('Failed to delete assignment ');
      }

      setAssignments((prev) =>
        prev.filter((assignment) => assignment.assignment_id !== assignmentId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const setPublished = async (assignmentId: string, isPublished: boolean) => {
    try {
      const updatedAssignment = { isPublished };

      const response = await fetch(`http://localhost:5000/assignments/${assignmentId}/publish`, {
        method: 'PATCH',
        credentials: 'include',
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
          assignment.assignment_id === assignmentId ? { ...assignment, isPublished } : assignment
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const setLateSubmissions = async (
    assignmentId: string,
    allowsLateSubmissions: boolean
  ) => {
    try {
      const updatedAssignment = { allowsLateSubmissions };

      const response = await fetch(`http://localhost:5000/assignments/${assignmentId}/late-submissions`, {
        method: 'PATCH',
        credentials: 'include',
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
          assignment.assignment_id === assignmentId ? { ...assignment, allowsLateSubmissions } : assignment
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

