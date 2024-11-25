"use client";

import { useState } from "react";
import { User } from "@/types";

const loadUsersFromStorage = (): User[] => {
  let data: string | null = null;
  if (typeof window !== "undefined") {
    data = localStorage.getItem("users");
  }
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
};

const saveUsersToStorage = (users: User[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("users", JSON.stringify(users));
  }
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useState(() => {
    const loadedUsers = loadUsersFromStorage();
    setUsers(loadedUsers);
  });

  const insertUser = (user: User) => {
    if (users.some((u) => u.id === user.id)) {
      return;
    }
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
  };
  const addUser = (
    firstname: string,
    lastname: string,
    middlename: string | undefined,
    email: string,
    role: number
  ) => {
    const newUser: User = {
      id: Date.now().toLocaleString(),
      firstName: firstname,
      lastName: lastname,
      middleName: middlename,
      email: email,
      role_id: role,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
  };

  const addUsers = (newUsers: User[]) => {
    const updatedUsers = [...users, ...newUsers];
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
  };

  const updateUser = (
    id: string,
    firstname: string,
    lastname: string,
    middlename: string | undefined,
    email: string,
    role_id: number
  ) => {
    const updatedUser = {
      id: id,
      firstName: firstname,
      lastName: lastname,
      middleName: middlename,
      email: email,
      role_id: role_id,
    };

    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return updatedUser;
      }
      return user;
    });

    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
  };

  const getUser = (id: string) => {
    return users.find((user) => user.id === id);
  };
  const deleteUser = (id: string) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    setSelectedUsers(selectedUsers.filter((selectedId) => selectedId !== id));
  };

  return {
    users,
    insertUser,
    addUser,
    addUsers,
    updateUser,
    getUser,
    deleteUser,
  };
};
