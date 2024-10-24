"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { User } from "@/types";
import Button from "@/components/Button";
import { useUsers } from "@/hooks/useUsers";
import StudentsTable from "../../StudentsTable";

const ImportStudentsPage: React.FC = () => {
  const { addUsers } = useUsers();
  const [data, setData] = useState<any[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setData(results.data);
        results.data.forEach((student: any) => {
          setStudents((prev) => {
            const newId =
              prev.length > 0 ? prev[prev.length - 1].id + 1 : Date.now();
            if (!student["First Name"] || !student["Last Name"]) {
              return prev;
            }
            return [
              ...prev,
              {
                id: newId,
                firstName: student["First Name"],
                lastName: student["Last Name"],
                middleName: student["Middle Name"],
                email: student["Email"],
                role: "Student",
              },
            ];
          });
        });
      },
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Import Students</h1>
      {data.length === 0 ? (
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

      {data.length > 0 && (
        <div className="flex flex-column justify-end pt-4">
          <div className="p-2">
            <Button
              className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
              href="/students"
            >
              Cancel
            </Button>
          </div>
          <div className="p-2">
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              href="/students"
              onClick={() => addUsers(students)}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportStudentsPage;
