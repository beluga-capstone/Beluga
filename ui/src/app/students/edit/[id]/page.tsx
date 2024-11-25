"use client";

import Button from "@/components/Button";
import { ROLES } from "@/constants";
import { useUsers } from "@/hooks/useUsers";
import React, { useEffect, useState } from "react";
import StudentForm from "../../StudentForm";

const EditStudent = ({ params }: { params: { id: string } }) => {
  const { users, updateUser, deleteUser } = useUsers();
  const userId = params.id;
  const user = users.find((user) => user.id === userId);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES.STUDENT);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setMiddleName(user.middleName || "");
      setLastName(user.lastName);
      setEmail(user.email);
      setRole(ROLES.STUDENT);
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Edit Student</h1>

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

      <div className="flex flex-column justify-between">
        <div className="p-2">
          <Button
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
            onClick={() => deleteUser(userId)}
            href="/students"
          >
            Delete
          </Button>
        </div>
        <div className="flex">
          <div className="p-2">
            <Button
              className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
              href={`/students/${userId}`}
            >
              Cancel
            </Button>
          </div>
          <div className="p-2">
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              onClick={() =>
                updateUser(
                  userId,
                  firstName,
                  lastName,
                  middleName === "" ? undefined : middleName,
                  email,
                  role
                )
              }
              href={`/students/${userId}`}
              disabled={!firstName || !lastName || !email}
            >
              Save
            </Button>
          </div>
        </div>{" "}
      </div>
    </div>
  );
};

export default EditStudent;
