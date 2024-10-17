"use client";

import { useEffect, useState } from "react";
import { Assignment } from "@/types";
import { ASSIGNMENTS } from "@/constants";

const loadAssignmentsFromStorage = (): Assignment[] => {
  const data = localStorage.getItem("assignments");
  if (data) {
    const parsedData = JSON.parse(data);
    return parsedData.map((assignment: any) => ({
      ...assignment,
      releaseDate: new Date(assignment.releaseDate),
      dueDate: new Date(assignment.dueDate),
    }));
  }
  return ASSIGNMENTS;
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

  const addAssignment = (title: string, description: string, releaseDate: Date, dueDate: Date) => {
    const newAssignment: Assignment = {
      id: Date.now(),
      courseId: 1,
      title: title,
      description: description,
      releaseDate: releaseDate,
      dueDate: dueDate,
      containerId: 1
    };

    const updatedAssignments = [...assignments, newAssignment];
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

  return { assignments, addAssignment, deleteAssignment };
};
