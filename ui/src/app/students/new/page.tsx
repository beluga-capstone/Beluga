"use client";

import Button from "@/components/Button";
import { ROLES } from "@/constants";
import { useUsers } from "@/hooks/useUsers";
import Link from "next/link";
import React, { useState } from "react";

const NewUser: React.FC = () => {
  const { addUser } = useUsers();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState(ROLES[3]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">New Student</h1>
        <Link href="/students/new/import">
          <p className="text-blue-500">Import With File</p>
        </Link>
      </div>
      <h2>First Name</h2>
      <div className="pt-2 pb-8">
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          type="text"
          className="border rounded p-1 bg-surface"
          placeholder="First name"
          aria-label="First name"
        />
      </div>

      <h2>Middle Name</h2>
      <div className="pt-2 pb-8">
        <input
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          type="text"
          className="border rounded p-1 bg-surface"
          placeholder="Middle name"
          aria-label="Middle name"
        />
      </div>

      <h2>Last Name</h2>
      <div className="pt-2 pb-8">
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          type="text"
          className="border rounded p-1 bg-surface"
          placeholder="Last name"
          aria-label="Last name"
        />
      </div>

      <h2>Role</h2>
      <div className="pt-2 pb-8">
        <select
          title="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded p-1 bg-surface"
        >
          <option value={ROLES[3]}>{ROLES[3]}</option>
          <option value={ROLES[2]}>{ROLES[2]}</option>
        </select>
      </div>

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
                role
              )
            }
            href="/students"
            disabled={!firstName || !lastName}
          >
            Add Student
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
