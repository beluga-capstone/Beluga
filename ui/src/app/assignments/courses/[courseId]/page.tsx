"use client";

import { useAssignments } from "@/hooks/useAssignments";
import { useSearchParams } from "next/navigation";
import ProfessorAssignmentsTable from "@/components/ProfessorAssignmentsTable";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useEffect } from "react";

const CourseAssignments = () => {
  const { assignments, fetchAssignments, setPublished, setLateSubmissions } = useAssignments();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const courseName = decodeURIComponent(searchParams.get("name") || "Unknown Course");

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const courseAssignments = assignments.filter(
    (assignment) => assignment.course_id === courseId
  );
  
  console.log("All assignments:", assignments);
  console.log("Filtered assignments for course:", courseAssignments);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-3xl">Assignments</h1>
        <Link
          href={`/assignments/new?courseId=${courseId}&name=${encodeURIComponent(courseName)}`}
        >
          <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <Plus className="mr-2" /> Add Assignment
          </button>
        </Link>
      </div>
      <ProfessorAssignmentsTable
        assignments={courseAssignments}
        setPublished={setPublished}
        setLateSubmissions={setLateSubmissions}
      />
    </div>
  );
};

export default CourseAssignments;
