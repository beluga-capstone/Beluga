"use client";

import { ROLES } from "@/constants";
import { useState } from "react";
import { User } from "@/types";

const fetchUsers = async() => {
}

const fetchUserById = async (userId: string): Promise<{ firstName: string; lastName: string } | null> => {
  try {
    const response = await fetch(`http://localhost:5000/users/${userId}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("User not found");
    }

    const data = await response.json();
    return {
      firstName: data.first_name,
      lastName: data.last_name,
    };
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return null;
  }
};


export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const insertUser = (user: User) => {
    if (users.some((u) => u.id === user.id)) {
      return;
    }
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
  };

  const addUser = async(
    email: string,
    firstName: string,
    lastName: string,
    middleName: string | undefined,
    role: string,
    courseId?: number
  ) => {
    const newUser: User = {
      email,
      firstName,
      lastName,
      middleName,
      role,
      courseId,
    };

    // Add the user to the backend
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email:email,
        firstName:firstName,
        lastName:lastName,
        middleName: middleName === "" ? undefined : middleName,
        role: role,
      }),
    });

    if (response.ok) {
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      return response.json();
    }
  };

  const addUsers = async (users: User[]): Promise<{ user_id: string; email: string }[]> => { // Fix: Return user_id and email
    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(users),
      });
  
      if (!response.ok) {
        console.error("Failed to add users. Status:", response.status, response.statusText);
        throw new Error(`Error adding users: ${response.statusText}`);
      }
  
      const addedUsers = await response.json();
      console.log("Users added successfully:", addedUsers);
      return addedUsers; // Ensure it returns user_id and email
    } catch (error) {
      console.error("Error adding users:", error);
      return [];
    }
  };  
  
  
  const updateUser = (
    id: string,
    firstName: string,
    lastName: string,
    middleName: string | undefined,
    email: string,
    role: string,
    courseId?: number
  ) => {
    const updatedUser = {
      id,
      firstName,
      lastName,
      middleName,
      email,
      role,
      courseId,
    };

    const updatedUsers = users.map((user) =>
      user.id === id ? updatedUser : user
    );

    setUsers(updatedUsers);
  };

  const getUser = (id: string) => {
    return users.find((user) => user.id === id);
  };
  const deleteUser = (id: string) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  return {
    users,
    fetchUserById,
    addUser,
    addUsers,
    updateUser,
    getUser,
    deleteUser,
  };
};
