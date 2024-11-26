"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpFromLine, Plus } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import StudentsTable from "../../StudentsTable";
import { useUsers } from "@/hooks/useUsers";
import { Student } from "@/types";

interface CourseStudentsProps {
  params: { courseId: string };
}

const CourseStudents = ({ params }: CourseStudentsProps) => {
  const { fetchCourseStudents } = useUsers(); 
  const searchParams = useSearchParams();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = searchParams.get("role") || "professor";

  useEffect(() => {
    if (!params.courseId) {
      console.error("courseId is undefined");
      setError("Course ID is undefined.");
      setLoading(false);
      return;
    }

    const getStudents = async () => {
      try {
        const data: Student[] = await fetchCourseStudents(params.courseId); 
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch students.");
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, [params.courseId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">Students in Course</h1>
        {role !== "student" && (
          <div className="flex">
            <div className="pr-8">
              <Button
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                href={`/students/new/import?courseId=${params.courseId}`}
              >
                <ArrowUpFromLine className="mr-2" /> Import From File
              </Button>
            </div>
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              href={`/students/new?courseId=${params.courseId}`}
            >
              <Plus className="mr-2" /> Add Student
            </Button>
          </div>
        )}
      </div>

      <StudentsTable students={students} hasClickableNames />
    </div>
  );
};

export default CourseStudents;
