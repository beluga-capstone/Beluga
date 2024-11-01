"use client";

import Button from "@/components/Button";
import { ROLES } from "@/constants";
import { useUsers } from "@/hooks/useUsers";
import React, { useState } from "react";
import StudentForm from "../StudentForm";

const NewUser: React.FC = () => {
  const { addUser } = useUsers();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES.STUDENT);

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">New Student</h1>

      <StudentForm
        firstName={firstName}
        setFirstName={setFirstName}
        middleName={middleName}
        setMiddleName={setMiddleName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        role={role}
        setRole={setRole}
      />

      <div className="flex flex-column justify-end">
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
            onClick={() =>
              addUser(
                firstName,
                lastName,
                middleName === "" ? undefined : middleName,
                email,
                role
              )
            }
            href="/students"
            disabled={!firstName || !lastName || !email}
          >
            Add Student
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
