"use client";

import Button from "@/components/Button";
import { ROLES } from "@/constants";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import React, { useState } from "react";
import StudentForm from "../../StudentForm";
import { useParams } from "next/navigation";

const NewUser: React.FC = () => {
  const { addUser } = useUsers();
  const params = useParams();
  const courseId=params.id;
  if (!courseId) {
    console.error("courseId is missing from the query params.");
    return;
  }
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES.STUDENT);
  const router = useRouter();

  const handleAddUser = async () => {
    try {
      const newUser = await addUser(
        email,
        firstName,
        lastName,
        middleName,
        "student",
      );

      if (newUser){

        console.log("User added successfully:", newUser);
    
        // Log courseId and newUser.user_id
        console.log("Course ID:", courseId);
        console.log("New User ID:", newUser.user_id);
    
        // Ensure both IDs are valid
        if (!courseId) {
          throw new Error("Missing course ID.");
        }
        if (!newUser.user_id) {
          throw new Error("Missing user ID from user creation response.");
        }
      }
  
      // Enroll the user in the course
      const enrollmentResponse = await fetch(`${process.env.backend}/enrollments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          user_id: newUser.user_id,
        }),
      });
  
      if (!enrollmentResponse.ok) {
        throw new Error("Failed to enroll the student in the course.");
      }
  
      console.log("Student enrolled successfully:", await enrollmentResponse.json());
  
      // Redirect back to the course-specific students page
      router.push(`/students/courses/${courseId}`);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };  
  
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
      />

      <div className="flex flex-column ">
        <div className="mr-2">
          <Button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            href={`/students/courses/${courseId}`}
          >
            Cancel
          </Button>
        </div>
        <div className="">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleAddUser}
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

