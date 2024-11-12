"use client";

import { useEffect, useState } from "react";
import { Assignment } from "@/types";

const loadAssignmentsFromStorage = (): Assignment[] => {
  const data = localStorage.getItem("assignments");
  if (data) {
    const parsedData = JSON.parse(data);
    return parsedData.map((assignment: any) => ({
      ...assignment,
      dueAt: new Date(assignment.dueAt),
      lockAt: new Date(assignment.lockAt),
      unlockAt: new Date(assignment.unlockAt),
      publishAt: new Date(assignment.publishAt),
    }));
  } else {
    return [];
  }
};

const saveAssignmentsToStorage = (assignments: Assignment[]) => {
  localStorage.setItem("assignments", JSON.stringify(assignments));
};

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const loadedAssignments = loadAssignmentsFromStorage();
    setAssignments(loadedAssignments);
  }, []);

  const addAssignment = (
    courseId: number,
    title: string,
    description: string,
    dueAt: Date,
    lockAt: Date,
    unlockAt: Date,
    publishAt: Date,
    allowsLateSubmissions: boolean,
    containerId: number
  ) => {
    const newAssignment: Assignment = {
      assignmentId: Date.now(),
      courseId: courseId,
      title: title,
      description: description,
      dueAt: dueAt,
      lockAt: lockAt,
      unlockAt: unlockAt,
      isUnlocked: Date.now() >= unlockAt.getTime(),
      isPublished: Date.now() >= publishAt.getTime(),
      publishAt: publishAt,
      allowsLateSubmissions: allowsLateSubmissions,
      imageId: containerId,
    };

    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    saveAssignmentsToStorage(updatedAssignments);
  };

  const updateAssignment = (
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
    const assignment = assignments.find(
      (assignment) => assignment.assignmentId === assignmentId
    );

    const updatedAssignment = {
      assignmentId: assignmentId,
      courseId: assignment?.courseId || -1,
      title: title,
      description: description,
      dueAt: dueAt,
      lockAt: lockAt,
      unlockAt: unlockAt,
      isUnlocked: Date.now() >= unlockAt.getTime(),
      isPublished: Date.now() >= publishAt.getTime(),
      publishAt: publishAt,
      allowsLateSubmissions: allowsLateSubmissions,
      containerId: containerId,
    };

    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.assignmentId === updatedAssignment.assignmentId) {
        return { ...assignment, ...updatedAssignment };
      } else {
        return assignment;
      }
    });

    setAssignments(updatedAssignments);
    saveAssignmentsToStorage(updatedAssignments);
  };

  const deleteAssignment = (assignmentId: number) => {
    const updatedAssignments = assignments.filter(
      (assignment) => assignment.assignmentId !== assignmentId
    );
    setAssignments(updatedAssignments);
    saveAssignmentsToStorage(updatedAssignments);
  };

  const setPublished = (assignmentId: number, isPublished: boolean) => {
    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.assignmentId === assignmentId) {
        return { ...assignment, isPublished: isPublished };
      } else {
        return assignment;
      }
    });

    setAssignments(updatedAssignments);
    saveAssignmentsToStorage(updatedAssignments);
  };

  const setLateSubmissions = (
    assignmentId: number,
    allowsLateSubmissions: boolean
  ) => {
    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.assignmentId === assignmentId) {
        return { ...assignment, allowsLateSubmissions: allowsLateSubmissions };
      } else {
        return assignment;
      }
    });

    setAssignments(updatedAssignments);
    saveAssignmentsToStorage(updatedAssignments);
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
