"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import Button from "@/components/Button";
import { useDashboard } from "@/hooks/useDashboard";
import { useUsers } from "@/hooks/useUsers";
import StudentsTable from "../../students/StudentsTable";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

const NewCourse: React.FC = () => {
  const { addCourse, fetchCourses } = useDashboard();
  const { addUsers } = useUsers();
  const { profile } = useProfile();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [students, setStudents] = useState<User[]>([]);
  const [csvRowCount, setCsvRowCount] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedStudents = results.data
          .filter(
            (student: any) =>
              student["First Name"] && student["Last Name"] && student["Email"]
          )
          .map((student: any, index: number) => ({
            firstName: student["First Name"],
            lastName: student["Last Name"] || "",
            middleName: student["Middle Name"] || "",
            email: student["Email"],
            role: "student",
          }));

        setStudents(parsedStudents);
        setCsvRowCount(parsedStudents.length);
      },
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
  });

  const handleAddCourse = async () => {
    if (!title || !profile) {
      alert("Course Title or Profile is missing!");
      return;
    }
  
    try {
      // Step 1: Create the course
      const courseResponse = await addCourse(title, csvRowCount, profile.user_id);
      console.log("Course response:", courseResponse);
      if (!courseResponse) throw new Error("Failed to create course");
  
      const courseId = courseResponse.course_id; // Fix: Use course_id
      console.log("Extracted courseId:", courseId);
  
      // Step 2: Add students as users
      const addedUsers = await addUsers(students);
      console.log("Added users:", addedUsers);
  
      if (addedUsers.length === 0) {
        throw new Error("Failed to add users");
      }
  
      // Step 3: Enroll students in the course (individually)
      for (const user of addedUsers) {
        console.log("Sending enrollment request:", {
          course_id: courseId,
          user_id: user.user_id, // Fix: Use user_id
        });
        const enrollmentResponse = await fetch("http://localhost:5000/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_id: courseId,
            user_id: user.user_id, // Fix: Match backend field
          }),
        });
  
        if (!enrollmentResponse.ok) {
          console.error(
            `Failed to enroll user ${user.user_id} in course ${courseId}`,
            await enrollmentResponse.text()
          );
          throw new Error("Failed to enroll students");
        }
      }
  
      console.log("All students enrolled successfully!");
      await fetchCourses();
      router.push("/");
    } catch (error) {
      console.error("Error adding course and enrolling students:", error);
    }
  };  

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">New Course</h1>

      {/* Course Form */}
      <div className="flex flex-col w-1/5 mb-8">
        <label className="font-semibold mb-1">Course Name</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="border rounded p-2 bg-surface"
          placeholder="Course name"
          aria-label="Course name"
        />
      </div>

      {/* CSV Upload Section */}
      <h2 className="font-bold text-2xl mt-8 mb-4">Upload Students</h2>
      {students.length === 0 ? (
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-gray-400 p-16 text-center"
        >
          <input {...getInputProps()} />
          <p>Drag and drop a CSV file here, or click to select one</p>
        </div>
      ) : (
        <StudentsTable students={students} />
      )}

      {/* Action Buttons */}
      <div className="flex flex-row pt-4 space-x-2">
        <Button className="bg-gray-500 text-white px-4 py-2 rounded" href="/">
          Cancel
        </Button>
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddCourse}
          disabled={!title || students.length === 0}
        >
          Add Course
        </Button>
      </div>
    </div>
  );
};

export default NewCourse;
