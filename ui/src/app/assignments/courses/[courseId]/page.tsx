"use client";

import { useAssignments } from "@/hooks/useAssignments";
import { useSearchParams } from "next/navigation";
import ProfessorAssignmentsTable from "@/components/ProfessorAssignmentsTable";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

const CourseAssignments = ({ params }: { params: { courseId: string } }) => {
  const { assignments, setPublished, setLateSubmissions } = useAssignments();
  const courseId = parseInt(params.courseId, 10);

  const searchParams = useSearchParams();
  const initialCourseName = decodeURIComponent(
    searchParams.get("name") || `Course ${courseId}`
  );
  const [courseName, setCourseName] = useState(initialCourseName);

  useEffect(() => {
    setCourseName(initialCourseName);
  }, [initialCourseName]);

  const courseAssignments = assignments.filter(
    (assignment) => assignment.courseId === courseId
  );

  useEffect(() => {
    const currentDate = new Date();

    courseAssignments.forEach((assignment) => {
      const isWithinDateRange =
        assignment.releaseDate <= currentDate && currentDate <= assignment.dueDate;
      
      if (assignment.isPublished !== isWithinDateRange) {
        setPublished(assignment.id, isWithinDateRange);
      }
    });
  }, [courseAssignments, setPublished]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-3xl">Assignments for {courseName}</h1>
        <Link href={`/assignments/new?courseId=${courseId}&name=${encodeURIComponent(courseName)}`}>
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
