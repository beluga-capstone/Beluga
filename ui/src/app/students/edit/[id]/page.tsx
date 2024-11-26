"use client";

import Button from "@/components/Button";
import { ROLES } from "@/constants";
import React, { useEffect, useState } from "react";
import StudentForm from "../../StudentForm";
import { useSearchParams } from "next/navigation";

const EditStudent = ({ params }: { params: { id: string } }) => {
  console.log("Params:", params);
  const userId = params.id;
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES.STUDENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.backend}/users/${userId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch user with ID ${userId}`);
        }
        const data = await response.json();
        setFirstName(data.first_name || "");
        setMiddleName(data.middle_name || "");
        setLastName(data.last_name || "");
        setEmail(data.email || "");
        setRole(ROLES.STUDENT);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching user data:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.backend}/users/${userId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          middle_name: middleName || null,
          last_name: lastName,
          email,
          role_id:
            role === ROLES.STUDENT ? 8 : role === ROLES.TA ? 4 : ROLES.ADMIN,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user.");
      }

      console.log("User updated successfully");
      window.location.href = `/students/${userId}`;
    } catch (err: any) {
      console.error("Error updating user:", err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.backend}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete user: ${errorMessage}`);
      }

      console.log("User deleted successfully");

      // Redirect to the course page or fallback
      if (!courseId) {
        console.warn(
          "Redirecting to default student list due to missing courseId."
        );
        window.location.href = `/students`;
      } else {
        window.location.href = `/students/courses/${courseId}`;
      }
    } catch (err: any) {
      console.error("Error deleting user:", err.message);
    }
  };

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error: {error}</p>;

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
      />

      <div className="flex flex-column justify-between">
        <div className="p-2">
          <Button
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleDelete}
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
