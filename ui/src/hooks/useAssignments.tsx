"use client";

import { useEffect, useState } from "react";
import { Assignment } from "@/types";
import { ASSIGNMENTS } from "@/constants";

const loadAssignmentsFromStorage = (): Assignment[] => {
  const data = localStorage.getItem("assignments");
  return data ? JSON.parse(data) : ASSIGNMENTS;
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

  const addAssignment = (assignment: Assignment) => {
    const updatedAssignments = [...assignments, assignment];
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
