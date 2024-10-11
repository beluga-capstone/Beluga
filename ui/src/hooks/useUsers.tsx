// @/hooks/useUsers.ts
"use client";

import { useEffect, useState } from 'react';
import { User } from '@/types';
import { DEFAULT_USERS } from '@/constants';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>(DEFAULT_USERS); // Initialize with DEFAULT_USERS
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    const addUser = (firstname: string, lastname: string, middlename: string, role: string) => {
        const newUser: User = {
            id: Date.now(),
            firstName: firstname,
            lastName: lastname,
            middleName: middlename,
            role: role,
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
    };

    const deleteUser = (id: number) => {
        const updatedUsers = users.filter(user => user.id !== id);
        setUsers(updatedUsers);
        setSelectedUsers(selectedUsers.filter(selectedId => selectedId !== id));
    };

    const toggleSelectUser = (id: number) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(selectedId => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const performBulkAction = (action: 'delete') => {
        if (action === 'delete') {
            const updatedUsers = users.filter(user => !selectedUsers.includes(user.id));
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
