"use client";

import { useEffect, useState } from "react";
import { Assignment } from "@/types";
import { useRouter } from "next/navigation"; // Use useRouter directly here

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(()=>{
    console.log("updated is ",assignments);
  },[assignments]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${process.env.backend}/assignments/search`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
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
        publish_at: assignment.publish_at ? new Date(assignment.publish_at) : null,
        is_published: assignment.is_published || false,
        allows_late_submissions: assignment.allows_late_submissions || false,
        docker_image_id: assignment.docker_image_id || null,
      }));

      setAssignments(transformedData);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAssignmentsByCourseId = async (courseId: string): Promise<Assignment[]> => {
    try {
      console.log(`Fetching assignments for courseId: ${courseId}`);
      const response = await fetch(`${process.env.backend}/assignments/course/${courseId}`, {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === "No assignments found for this course") {
          console.log("No assignments found for this course. Returning empty array.");
          return [];
        }
        throw new Error(`Failed to fetch assignments for course ${courseId}`);
      }
  
      const data = await response.json();
      console.log(`Response from backend for courseId: ${courseId}`, data);
  
      return data.map((assignment: any) => ({
        assignment_id: assignment.assignment_id,
        course_id: assignment.course_id,
        title: assignment.title,
        description: assignment.description,
        due_at: assignment.due_at ? new Date(assignment.due_at) : null,
        lock_at: assignment.lock_at ? new Date(assignment.lock_at) : null,
        unlock_at: assignment.unlock_at ? new Date(assignment.unlock_at) : null,
        publish_at: assignment.publish_at ? new Date(assignment.publish_at) : null,
        is_published: assignment.is_published || false,
        allows_late_submissions: assignment.allows_late_submissions || false,
        docker_image_id: assignment.docker_image_id || null,
      }));
    } catch (err) {
      console.error(`Error in fetchAssignmentsByCourseId:`, err);
      return [];
    }
  };
  
  
  const fetchAssignmentsById = async (assignmentId: string): Promise<Assignment> => {
    try {
      const response = await fetch(`${process.env.backend}/assignments/${assignmentId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch assignment details');
      }
      const data = await response.json();
      return {
        assignment_id: data.assignment_id,
        course_id: data.course_id,
        title: data.title,
        description: data.description,
        due_at: data.due_at ? new Date(data.due_at) : null,
        lock_at: data.lock_at ? new Date(data.lock_at) : null,
        unlock_at: data.unlock_at ? new Date(data.unlock_at) : null,
        publish_at: data.publish_at ? new Date(data.publish_at) : null,
        is_published: data.is_published || false,
        allows_late_submissions: data.allows_late_submissions || false,
        docker_image_id: data.docker_image_id || null,
      };
    } catch (err) {
      console.error(`Error fetching assignment by ID:`, err);
      throw err;
    }
  };
  
  const saveAssignment = async (newAssignment: Assignment) => {
    try {
      const response = await fetch(`${process.env.backend}/assignments`, {
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
      return data;
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
      docker_image_id,
    };

    fetchAssignments();
    const data = await saveAssignment(newAssignment);
    return data;
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
    docker_image_id: string | null
  ) => {
    const updatedAssignment = {
      assignment_id,
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
      docker_image_id,
    };

    try {
      const response = await fetch(`${process.env.backend}/assignments/${assignment_id}`, {
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

  const deleteAssignment = async (assignmentId: string, courseId: string): Promise<void> => {
    try {
      const response = await fetch(`${process.env.backend}/assignments/${assignmentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to delete assignment");
      }
      setAssignments((prev) =>
        prev.filter((assignment) => assignment.assignment_id !== assignmentId)
      );
      window.location.href = `/assignments/courses/${courseId}`;
    } catch (err) {
      console.error("Error deleting assignment:", err);
      throw err;
    }
  };

  const setPublished = async (assignmentId: string, isPublished: boolean) => {
    try {
      const updatedAssignment = { isPublished };

      const response = await fetch(`${process.env.backend}/assignments/${assignmentId}/publish`, {
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

      const response = await fetch(`${process.env.backend}/assignments/${assignmentId}/late-submissions`, {
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
      fetchAssignments();
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
    fetchAssignments,
    fetchAssignmentsByCourseId,
    fetchAssignmentsById,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    setPublished,
    setLateSubmissions,
  };
};
