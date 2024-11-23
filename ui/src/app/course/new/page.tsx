"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import Button from "@/components/Button";
import CoursesForm from "@/components/CoursesForm";
import { useDashboard } from "@/hooks/useDashboard";
import { useProfile } from "@/hooks/useProfile"; // Import the hook
import StudentsTable from "../../students/StudentsTable";
import { useRouter } from "next/navigation";

const NewCourse: React.FC = () => {
  const { addCourse, fetchCourses } = useDashboard();
  const { profile } = useProfile(); // Access the logged-in user's profile
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [section, setSection] = useState<string>("");
  const [semester, setSemester] = useState("");

  // Explicitly define the type for students
  const [students, setStudents] = useState<Array<{
    user_id: string;
    first_name: string;
    last_name: string;
    middleName?: string;
    email: string;
    role_id: string;
  }>>([]);

  const loggedInUserId = profile?.user_id; // Get the logged-in user's ID

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedStudents = results.data
          .filter((student: any) => student["First Name"] && student["Last Name"])
          .map((student: any, index: number) => ({
            user_id: (Date.now() + index).toString(),
            first_name: student["First Name"],
            last_name: student["Last Name"],
            middleName: student["Middle Name"] || "",
            email: student["Email"],
            role_id: "Student",
          }));
        setStudents(parsedStudents);
      },
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
  });

  const handleAddCourse = async () => {
    if (!loggedInUserId) {
      console.error("Unable to create course: User ID is missing");
      return;
    }

    await addCourse(
      title,
      section,
      loggedInUserId, // Use the logged-in user's ID
      semester,
      "Course description goes here",
      students.length
    );
    await fetchCourses();
    router.push("/");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">New Course</h1>

      {/* Course Form */}
      <CoursesForm
        title={title}
        setTitle={setTitle}
        section={section}
        setSection={setSection}
        professor={profile?.firstName + " " + profile?.lastName || ""} // Pre-fill professor's name
        setProfessor={() => {}} // Disable manual professor selection
        semester={semester}
        setSemester={setSemester}
        professors={[]} // No dropdown needed
      />

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
      <div className="flex flex-row justify-end pt-4 space-x-2">
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
