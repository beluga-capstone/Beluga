"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import Button from "@/components/Button";
import CoursesForm from "@/components/CoursesForm";
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
  const [section, setSection] = useState<string>("");
  const [professor, setProfessor] = useState<string>("");
  const [semester, setSemester] = useState("");
  const [students, setStudents] = useState<User[]>([]);
  const [termId, setTermId] = useState<string | null>(null);

  // Fetch termId dynamically based on semester
  useEffect(() => {
    const fetchTermId = async () => {
      if (!semester) return;

      try {
        const response = await fetch(`http://localhost:5000/terms?name=${semester}`, {
          method: "GET",
        });
        const data = await response.json();

        if (data.length > 0) {
          setTermId(data[0].term_id);
        } else {
          setTermId(null); // Fallback for unknown terms
        }
      } catch (error) {
        console.error("Error fetching term ID:", error);
        setTermId(null);
      }
    };

    fetchTermId();
  }, [semester]); // Re-fetch termId whenever semester changes

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedStudents = results.data
          .filter((student: any) => student["First Name"] && student["Last Name"])
          .map((student: any, index: number) => ({
            id: Date.now() + index,
            firstName: student["First Name"],
            lastName: student["Last Name"],
            middleName: student["Middle Name"] || "",
            email: student["Email"],
            role: "Student",
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
    if (!profile || !termId) {
      alert("Profile or Term ID is missing!");
      return;
    }

    const courseId = Date.now();
    await addCourse(
      title,
      section,
      professor,
      semester,
      students.length,
      profile.user_id, // Include user ID from profile
      termId // Include term ID
    );
    await fetchCourses();

    const studentsWithCourseId = students.map((student) => ({
      ...student,
      courseId,
    }));
    await addUsers(studentsWithCourseId);

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
        professor={professor}
        setProfessor={setProfessor}
        semester={semester}
        setSemester={setSemester}
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