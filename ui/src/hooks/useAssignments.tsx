"use client";

import { useEffect, useState } from "react";
import { Assignment } from "@/types";

const loadAssignmentsFromStorage = (): Assignment[] => {
  const data = localStorage.getItem("assignments");
  if (data) {
    const parsedData = JSON.parse(data);
    return parsedData.map((assignment: any) => ({
      ...assignment,
      releaseDate: new Date(assignment.releaseDate),
      dueDate: new Date(assignment.dueDate),
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
    title: string,
    description: string,
    releaseDate: Date,
    dueDate: Date,
    containerId: number
  ) => {
    const newAssignment: Assignment = {
      id: Date.now(),
      courseId: 1,
      title: title,
      description: description,
      isPublished: false,
      releaseDate: releaseDate,
      dueDate: dueDate,
      containerId: containerId,
    };

    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    saveAssignmentsToStorage(updatedAssignments);
  };

  const updateAssignment = (
    id: number,
    title: string,
    description: string,
    isPublished: boolean,
    releaseDate: Date,
    dueDate: Date,
    containerId: number
  ) => {
    const updatedAssignment = {
      id: id,
      courseId: 1,
      title: title,
      description: description,
      isPublished: isPublished,
      releaseDate: releaseDate,
      dueDate: dueDate,
      containerId: containerId,
    };

    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.id === updatedAssignment.id) {
        return updatedAssignment;
      } else {
        return assignment;
      }
    });

    setAssignments(updatedAssignments);
    saveAssignmentsToStorage(updatedAssignments);
  };

  const deleteAssignment = (id: number) => {
    const updatedAssignments = assignments.filter(
      (assignment) => assignment.id !== id
    );
    setAssignments(updatedAssignments);
    saveAssignmentsToStorage(updatedAssignments);
  };

  const setPublished = (id: number, isPublished: boolean) => {
    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.id === id) {
        return { ...assignment, isPublished: isPublished };
      } else {
        return assignment;
      }
    });

    setAssignments(updatedAssignments);
    saveAssignmentsToStorage(updatedAssignments);
  };

  return { assignments, addAssignment, updateAssignment, deleteAssignment, setPublished };
};
