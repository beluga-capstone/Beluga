"use client";

import Button from "@/components/Button";
import { ROLES } from "@/constants";
import { useUsers } from "@/hooks/useUsers";
import { useDashboard } from "@/hooks/useDashboard";
import React, { useEffect, useState } from "react";
import StudentForm from "../../StudentForm";
import { useRouter } from "next/navigation";

const EditStudent = ({ params }: { params: { id: string } }) => {
  const { updateCourseEnrollment } = useDashboard();
  const { users, updateUser, deleteUser } = useUsers(updateCourseEnrollment);
  const userId = parseInt(params.id, 10);
  const user = users.find((user) => user.id === userId);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(user?.role || ROLES.STUDENT);
  const router = useRouter();
  const initialRole = user?.role;

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setMiddleName(user.middleName || "");
      setLastName(user.lastName);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleSave = () => {
    if (user?.courseId) {
      updateUser(userId, firstName, lastName, middleName, email, role, user.courseId);
    }
    router.push(`/students/courses/${user?.courseId}`);
  };

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
            href="/students/courses"
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
              onClick={handleSave}
              disabled={!firstName || !lastName || !email}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
