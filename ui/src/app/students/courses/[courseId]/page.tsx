"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpFromLine, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import StudentsTable from "../../StudentsTable";
import { Student } from "@/types";

const CourseStudents: React.FC = () => {
  const { courseId } = useParams();
  if (!courseId) {
    console.error("courseId is undefined");
    return;
  }
  console.log("courseId:", courseId);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("useEffect triggered for courseId:", courseId);
    const fetchCourseStudents = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/courses/${courseId}/users`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch course-specific students.");
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        const mappedStudents = data.map((user: any) => ({
            id: user.user_id,
            firstName: user.firstname,
            lastName: user.lastname,
            middleName: user.middlename || "",
            email: user.email,
            role: 
              Number(user.role_id) === 8 ? "Student" : 
              Number(user.role_id) === 4 ? "TA" : 
              "Unknown",
            courseId,
        }));
        setStudents(mappedStudents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };

    fetchCourseStudents();
  }, [courseId]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">Students in Course</h1>
        <div className="flex">
          <div className="pr-8">
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              href={`/students/new/import?courseId=${courseId}`}
            >
              <ArrowUpFromLine className="mr-2" /> Import From File
            </Button>
          </div>
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            href={`/students/new?courseId=${courseId}`}
          >
            <Plus className="mr-2" /> Add Student
          </Button>
        </div>
      </div>

      <StudentsTable students={students} hasClickableNames />
    </div>
  );
};

export default CourseStudents;
