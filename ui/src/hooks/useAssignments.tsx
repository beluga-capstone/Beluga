"use client";

import { useEffect, useState } from "react";
import { Assignment } from "@/types";

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchResults, setSearchResults] = useState<Assignment[]>([]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch("http://localhost:5000/assignments");
      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }
      const data = await response.json();

      console.log("Raw assignments data from API:", data);

      const transformedData = data.map((assignment: any) => ({
        assignment_id: assignment.assignment_id || "",
        course_id: assignment.course_id || "",
        title: assignment.title || "",
        description: assignment.description || "",
        due_at: assignment.due_at ? new Date(assignment.due_at) : null,
        lock_at: assignment.lock_at ? new Date(assignment.lock_at) : null,
        unlock_at: assignment.unlock_at ? new Date(assignment.unlock_at) : null,
        publish_at: assignment.publish_at ? new Date(assignment.publish_at) : null,
        is_unlocked: assignment.is_unlocked || false,
        is_published: assignment.is_published || false,
        allows_late_submissions: assignment.allows_late_submissions || false,
        docker_image_id: assignment.docker_image_id || "",
        user_id: assignment.user_id || "",
      }));

      console.log("Transformed assignments data:", transformedData);

      setAssignments(transformedData);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const searchAssignments = async (courseId: string) => {
    try {
      const response = await fetch("http://localhost:5000/assignments/search?course_id=${courseId}");
      if (!response.ok) {
        throw new Error("Failed to search assignments");
      }
      const data = await response.json();

      const transformedData = data.map((assignment: any) => ({
        assignment_id: assignment.assignment_id || "",
        course_id: assignment.course_id || "",
        title: assignment.title || "",
        description: assignment.description || "",
        due_at: assignment.due_at ? new Date(assignment.due_at) : null,
        lock_at: assignment.lock_at ? new Date(assignment.lock_at) : null,
        unlock_at: assignment.unlock_at ? new Date(assignment.unlock_at) : null,
        publish_at: assignment.publish_at ? new Date(assignment.publish_at) : null,
        is_unlocked: assignment.is_unlocked || false,
        is_published: assignment.is_published || false,
        allows_late_submissions: assignment.allows_late_submissions || false,
        docker_image_id: assignment.docker_image_id || "",
        user_id: assignment.user_id || "",
      }));

      setSearchResults(transformedData); // Store search results separately
      console.log("Search results:", transformedData);
    } catch (err) {
      console.error("Error searching assignments:", err);
    }
  };

  const saveAssignment = async (newAssignment: Assignment) => {
    try {
      const response = await fetch("http://localhost:5000/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAssignment),
      });

      if (!response.ok) {
        throw new Error("Failed to add assignment");
      }

      const data = await response.json();
      console.log("Saved Assignment:", data); // Log the response to ensure it's saved correctly
      setAssignments((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
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
      publish_at,
      is_unlocked: Date.now() >= unlock_at.getTime(),
      is_published: Date.now() >= publish_at.getTime(),
      allows_late_submissions: allows_late_submissions,
      docker_image_id: docker_image_id,
    };

    try {
      await saveAssignment(newAssignment);
      setAssignments((prev) => [...prev, newAssignment]);
      await fetchAssignments();
    } catch (err) {
      console.error("Failed to add assignment:", err);
    }
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
      assignment_id,
      course_id,
      title,
      description,
      due_at,
      lock_at,
      unlock_at,
      publish_at,
      is_unlocked: Date.now() >= unlock_at.getTime(),
      is_published: Date.now() >= publish_at.getTime(),
      allows_late_submissions,
      docker_image_id,
    };
    console.log("updating with",assignment_id,course_id,title,description,due_at,lock_at,unlock_at,docker_image_id)

    try {
      const response = await fetch(`http://localhost:5000/assignments/${assignment_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAssignment),
      });

      if (!response.ok) {
        throw new Error("Failed to update assignment");
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
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete assignment");
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAssignment),
      });

      if (!response.ok) {
        throw new Error("Failed to update publish status");
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAssignment),
      });

      if (!response.ok) {
        throw new Error("Failed to update late submissions setting");
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
    fetchAssignments,
    searchAssignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    setPublished,
    setLateSubmissions,
  };
};