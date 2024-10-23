"use client";

import React from "react";
import { Plus } from "lucide-react";
import Button from "@/components/Button";
import { useUsers } from "@/hooks/useUsers";
import Link from "next/link";

const Students: React.FC = () => {
  const { users } = useUsers();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">Students</h1>
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          href="/students/new"
        >
          <Plus className="mr-2" /> Add User
        </Button>
      </div>

      <table className="table w-full">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Middle Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4}>
              <hr />
            </td>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="text-center py-2">
                <Link href={`/students/edit/${user.id}`}>{user.firstName}</Link>
              </td>
              <td className="text-center py-2">
                <Link href={`/students/edit/${user.id}`}>{user.lastName}</Link>
              </td>
              <td className="text-center py-2">
                <Link href={`/students/edit/${user.id}`}>{user.middleName}</Link>
              </td>
              <td className="text-center py-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
