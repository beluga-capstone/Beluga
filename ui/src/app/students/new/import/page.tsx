"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { User } from "@/types";
import Button from "@/components/Button";
import { useUsers } from "@/hooks/useUsers";
import StudentsTable from "../../StudentsTable";
import { useParams } from "next/navigation";

const ImportStudentsPage: React.FC = () => {
  const { addUsers } = useUsers();
  const params = useParams();
  const courseId = params.id;
  const [users, setUsers] = useState<User[]>([]);
  const [dropAreaActive, setDropAreaActive] = useState(true);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDropAreaActive(false);
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedUsers: User[] = results.data
          .filter((user: any) => user["First Name"] && user["Email"])
          .map((user: any, index: number) => ({
            id: `${Date.now() + index}`, // Ensure IDs are strings initially
            firstName: user["First Name"] || "",
            lastName: user["Last Name"] || "",
            middleName: "",
            email: user["Email"],
            role: "student",
          }));

        setUsers(parsedUsers); // Replace users state to avoid duplication
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

  const handleSaveStudents = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      if (users.length === 0) {
        alert("No students to save. Please upload a valid CSV file.");
        return;
      }

      const addedUsers = await addUsers(users);

      if (addedUsers.length === 0) {
        throw new Error("Failed to add students. Please check your data.");
      }

      if (!courseId) {
        throw new Error("Missing course ID. Cannot enroll students.");
      }

      for (const user of addedUsers) {
        const enrollmentResponse = await fetch(
          "http://localhost:5000/enrollments",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              course_id: courseId,
              user_id: user.user_id,
            }),
          }
        );

        if (!enrollmentResponse.ok) {
          console.error(
            `Failed to enroll user ${user.user_id} in course ${courseId}:`,
            await enrollmentResponse.text()
          );
          throw new Error("Enrollment failed for some students.");
        }
      }

      setUsers([]); // Clear users after successful save
      window.location.href = `/students/courses/${courseId}`;
    } catch (error) {
      console.error("Error saving students and enrolling them:", error);
    }
  };

  // Transform users to students with proper type
  const students = users.map((user, index) => ({
    id: user.id || `${Date.now() + index}`,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: "",
    email: user.email,
    role_id: 8, // Default role_id for students
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Import Students</h1>
      {dropAreaActive && (
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-gray-400 p-16 text-center mb-4"
        >
          <input {...getInputProps()} />
          <p>Drag and drop a CSV file here, or click to select one</p>
        </div>
      )}
      {students.length > 0 && <StudentsTable students={students} />}{" "}
      {/* Pass transformed students */}
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
            onClick={handleSaveStudents}
            disabled={users.length === 0}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportStudentsPage;
