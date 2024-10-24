"use client";

import React from "react";
import { ArrowUpFromLine, Plus } from "lucide-react";
import Button from "@/components/Button";
import { useUsers } from "@/hooks/useUsers";
import StudentsTable from "./StudentsTable";

const Students: React.FC = () => {
  const { users } = useUsers();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">Students</h1>
        <div className="flex">
          <div className="pr-8">
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              href="/students/new/import"
            >
              <ArrowUpFromLine className="mr-2" /> Import From File
            </Button>
          </div>
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            href="/students/new"
          >
            <Plus className="mr-2" /> Add Student
          </Button>
        </div>
      </div>

      <StudentsTable students={users} hasClickableNames />
    </div>
  );
};

export default Students;
