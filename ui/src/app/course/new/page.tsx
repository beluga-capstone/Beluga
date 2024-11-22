"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import Button from "@/components/Button";
import CoursesForm from "@/components/CoursesForm";
import { useDashboard } from "@/hooks/useDashboard";
import { useUsers } from "@/hooks/useUsers";
import StudentsTable from "../../students/StudentsTable";
import { User } from "@/types";
import { useRouter } from "next/navigation";

const NewCourse: React.FC = () => {
  const { addCourse, fetchCourses } = useDashboard();
  const { users } = useUsers();
  const router = useRouter();

  const [name, setName] = useState("");
  const [term, setTerm] = useState("");
  const [professor, setProfessor] = useState<string>("");
  const [students, setStudents] = useState<User[]>([]);
  const professors = users
    .filter((user) => user.role === "Professor") 
    .map((user) => ({
      id: user.id.toString(), 
      name: `${user.firstName} ${user.lastName}`,
  }));

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
    try {
      if (!professor) {
        throw new Error("Select a professor.");
      }
      await addCourse(name, term, professor, students.length);
      await fetchCourses();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">New Course</h1>

      <CoursesForm
        name={name}
        setName={setName}
        term={term}
        setTerm={setTerm}
        professor={professor}
        setProfessor={setProfessor}
        professors={professors}
      />

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

      <div className="flex flex-row justify-end pt-4 space-x-2">
        <Button className="bg-gray-500 text-white px-4 py-2 rounded" href="/">
          Cancel
        </Button>
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddCourse}
          disabled={!name || !term || !professor}
        >
          Add Course
        </Button>
      </div>
    </div>
  );
};

export default NewCourse;
