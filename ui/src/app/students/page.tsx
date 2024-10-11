"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import UserItem from '@/components/UserItem';
import BulkActions from '@/components/UsersBulkActions';
import Button from '@/components/Button';
import { useUsers } from '@/hooks/useUsers';

const Students: React.FC = () => {
  const { 
    users, 
    selectedUsers,
    addUser, 
    deleteUser, 
    toggleSelectUser, 
    performBulkAction 
  } = useUsers();

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Students</h1>
      <div className="mb-4 flex justify-between items-center">
        <Button
          onClick={() => addUser("john", "doe", "", "student")}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="mr-2" /> Add User
        </Button>

        <BulkActions
          selectedCount={selectedUsers.length}
          onDelete={() => performBulkAction('delete')}
        />
      </div>

      {/* List the users */}
      {users.map(user => (
        <UserItem
          key={user.id}
          user={user}
          onDelete={deleteUser}
          onToggleSelect={toggleSelectUser}
          isSelected={selectedUsers.includes(user.id)}
        />
      ))}
    </div>
  );
};

export default Students;
