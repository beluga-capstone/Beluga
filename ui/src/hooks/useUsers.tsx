"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import { ROLES } from "@/constants";

const loadUsersFromStorage = (): User[] => {
  const data = localStorage.getItem("users");
  return data ? JSON.parse(data) : [];
};

const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const useUsers = (
  updateCourseEnrollment: (courseId: number, increment: number) => void = () => {}
) => {
  const [users, setUsers] = useState<User[]>(loadUsersFromStorage());

  useEffect(() => {
    const loadedUsers = loadUsersFromStorage();
    setUsers(loadedUsers || []); // Ensure `users` is always an array
  }, []);

  const addUser = (
    firstName: string,
    lastName: string,
    middleName: string | undefined,
    email: string,
    role: string,
    courseId?: number
  ) => {
    const newUser: User = {
      id: Date.now(),
      firstName,
      lastName,
      middleName,
      email,
      role,
      courseId: courseId || null,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);

    if (role === ROLES.STUDENT && courseId) {
      updateCourseEnrollment(courseId, 1);
    }
  };

  const addUsers = (newUsers: User[]) => {
    const updatedUsers = [...users, ...newUsers];
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);

    newUsers.forEach((user) => {
      if (user.role === ROLES.STUDENT && user.courseId) {
        updateCourseEnrollment(user.courseId, 1);
      }
    });
  };

  const updateUser = (
    id: number,
    firstName: string,
    lastName: string,
    middleName: string | undefined,
    email: string,
    role: string,
    courseId: number
  ) => {
    const existingUser = users.find((user) => user.id === id);
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, firstName, lastName, middleName, email, role } : user
    );

    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);

    if (existingUser && courseId) {
      if (existingUser.role === ROLES.STUDENT && role !== ROLES.STUDENT) {
        updateCourseEnrollment(courseId, -1);
      } else if (existingUser.role !== ROLES.STUDENT && role === ROLES.STUDENT) {
        updateCourseEnrollment(courseId, 1);
      }
    }
  };

  const deleteUser = (id: number) => {
    const userToDelete = users.find((user) => user.id === id);
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);

    if (userToDelete?.role === ROLES.STUDENT && userToDelete.courseId) {
      updateCourseEnrollment(userToDelete.courseId, -1);
    }
  };

  return {
    users,
    addUser,
    addUsers,
    updateUser,
    deleteUser,
  };
};
