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
    middlename: string,
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
    setSelectedUsers(selectedUsers.filter((selectedId) => selectedId !== id));
    saveUsersToStorage(updatedUsers);
  };

  const toggleSelectUser = (id: number) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const performBulkAction = (action: "delete") => {
    if (action === "delete") {
      const updatedUsers = users.filter(
        (user) => !selectedUsers.includes(user.id)
      );
      setUsers(updatedUsers);
      setSelectedUsers([]);
      return null;
    }
    return null;
  };

  return {
    users,
    selectedUsers,
    addUser,
    deleteUser,
    toggleSelectUser,
    performBulkAction,
  };
};
