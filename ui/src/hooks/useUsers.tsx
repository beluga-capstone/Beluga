"use client";

import { useState } from "react";
import { User } from "@/types";

const loadUsersFromStorage = (): User[] => {
  const data = localStorage.getItem("users");
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
};

const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useState(() => {
    const loadedUsers = loadUsersFromStorage();
    setUsers(loadedUsers);
  });

  const addUser = (
    firstname: string,
    lastname: string,
    middlename: string | undefined,
    role: string
  ) => {
    const newUser: User = {
      id: Date.now(),
      firstName: firstname,
      lastName: lastname,
      middleName: middlename,
      role: role,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
  };

  const deleteUser = (id: number) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    setSelectedUsers(selectedUsers.filter((selectedId) => selectedId !== id));
  };

  return {
    users,
    addUser,
    deleteUser,
  };
};
