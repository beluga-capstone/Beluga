"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { User } from "@/types";

const ImportStudentsPage: React.FC = () => {
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
        <table className="table w-full">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Middle Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5}>
                <hr />
              </td>
            </tr>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="text-center py-2">{student.firstName}</td>
                <td className="text-center py-2">{student.lastName}</td>
                <td className="text-center py-2">{student.middleName}</td>
                <td className="text-center py-2">{student.email}</td>
                <td className="text-center py-2">{student.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ImportStudentsPage;
