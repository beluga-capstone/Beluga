"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { User } from "@/types";
import Button from "@/components/Button";
import { useUsers } from "@/hooks/useUsers";
import StudentsTable from "../../StudentsTable";
import { useSearchParams } from "next/navigation";

const ImportStudentsPage: React.FC = () => {
  const { addUsers } = useUsers();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const [students, setStudents] = useState<User[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedStudents: User[] = results.data
          .filter((student: any) => student["First Name"] && student["Email"])
          .map((student: any, index: number) => ({
            id: Date.now() + index, 
            firstName: student["First Name"] || "",
            lastName: student["Last Name"] || "", 
            middleName: student["Middle Name"] || "", 
            email: student["Email"],
            role: "student", 
          }));

        setStudents(parsedStudents);
      },
      error: (error) => {
        console.error("Error parsing CSV file:", error);
      },
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
  });

  const handleSaveStudents = async () => {
    try {
      if (students.length === 0) {
        alert("No students to save. Please upload a valid CSV file.");
        return;
      }
      const addedUsers = await addUsers(students);
  
      if (addedUsers.length === 0) {
        throw new Error("Failed to add students. Please check your data.");
      }
  
      console.log("Students added successfully:", addedUsers);
  
      if (!courseId) {
        throw new Error("Missing course ID. Cannot enroll students.");
      }
  
      for (const user of addedUsers) {
        console.log("Enrolling user:", { course_id: courseId, user_id: user.user_id });
  
        const enrollmentResponse = await fetch("http://localhost:5000/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_id: courseId,
            user_id: user.user_id,
          }),
        });
  
        if (!enrollmentResponse.ok) {
          console.error(
            `Failed to enroll user ${user.user_id} in course ${courseId}:`,
            await enrollmentResponse.text()
          );
          throw new Error("Enrollment failed for some students.");
        }
  
        console.log("User enrolled successfully:", user.user_id);
      }
      window.location.href = `/students/courses/${courseId}`;
    } catch (error) {
      console.error("Error saving students and enrolling them:", error);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Import Students</h1>

      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-400 p-16 text-center mb-4"
      >
        <input {...getInputProps()} />
        <p>Drag and drop a CSV file here, or click to select one</p>
      </div>

      {students.length > 0 && <StudentsTable students={students} />}

      {/* Buttons are always visible */}
      <div className="flex flex-column justify-end pt-4">
        <div className="p-2">
          <Button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            href={`/students/courses/${courseId}`}
          >
            Cancel
          </Button>
        </div>
        <div className="p-2">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={students.length > 0 ? handleSaveStudents : undefined}
            disabled={students.length === 0}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportStudentsPage;
