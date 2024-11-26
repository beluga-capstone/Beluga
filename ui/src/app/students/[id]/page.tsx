"use client";

import React, { useEffect, useState } from "react";
import { Edit2 } from "lucide-react";
import Link from "next/link";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: string;
  courseId?: string;
}

const StudentPage = ({ params }: { params: { id: string } }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentAndCourse = async () => {
      try {
        // Fetch user details
        const userResponse = await fetch(`http://localhost:5000/users/${params.id}`);
        if (!userResponse.ok) {
          throw new Error(`Failed to fetch student with ID ${params.id}`);
        }
        const userData = await userResponse.json();

        // Fetch enrollment details to get course_id
        const enrollmentResponse = await fetch(`http://localhost:5000/enrollments`);
        if (!enrollmentResponse.ok) {
          throw new Error("Failed to fetch enrollments.");
        }
        const enrollments = await enrollmentResponse.json();
        const enrollment = enrollments.find(
          (e: { user_id: string }) => e.user_id === params.id
        );

        setStudent({
          id: userData.user_id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          middleName: userData.middle_name,
          email: userData.email,
          role: userData.role_id === "8" ? "Student" : userData.role_id === "4" ? "TA" : "Unknown",
          courseId: enrollment?.course_id, // Extract course_id from enrollment
        });

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching student or course:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudentAndCourse();
  }, [params.id]);

  if (loading) return <p>Loading student data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center">
        <h1 className="font-bold text-4xl">
          {student?.firstName} {student?.middleName} {student?.lastName}
        </h1>
        <Link
          href={`/students/edit/${student?.id}?courseId=${student?.courseId || ""}`}
          className="px-6"
        >
          <Edit2 size={24} />
        </Link>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-row">
          <h2 className="font-bold pb-4">Email: {student?.email}</h2>
          <h2 className="font-bold pb-4">Role: {student?.role}</h2>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
