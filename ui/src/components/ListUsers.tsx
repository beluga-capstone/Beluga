"use client";
import React, { useState } from 'react';
import { User } from '@/types';
import { Pencil, Trash2, CheckSquare, Square, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ListUsersProps {
  users: User[];
  onUpdateUser: (userId: number, newRole: number) => void;
  onDeleteUsers: (userId?: number) => void;
  selectedUserIds: number[];
  setSelectedUserIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const ListUsers: React.FC<ListUsersProps> = ({ users, onUpdateUser, onDeleteUsers, selectedUserIds, setSelectedUserIds }) => {
  const router = useRouter();

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedRole, setEditedRole] = useState<number>(8);

  const handleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setEditedRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedRole(8);
  };

  const handleSaveEdit = (userId: number) => {
    onUpdateUser(userId, editedRole);
    setEditingUserId(null);
  };

  const toggleSelectUser = (userId: number) => {
    setSelectedUserIds((prevSelected) => 
      prevSelected.includes(userId) ? prevSelected.filter(id => id !== userId) : [...prevSelected, userId]
    );
  };

  const handleDelete = (userId: number) => {
    if (selectedUserIds.length > 0) {
      onDeleteUsers();
    } else {
      onDeleteUsers(userId);
    }
  };

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input 
                type="checkbox" 
                checked={selectedUserIds.length === users.length} 
                onChange={() => {
                  if (selectedUserIds.length === users.length) {
                    setSelectedUserIds([]);
                  } else {
                    setSelectedUserIds(users.map(user => user.id));
                  }
                }} 
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Middle Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <input 
                  type="checkbox" 
                  checked={selectedUserIds.includes(user.id)} 
                  onChange={() => toggleSelectUser(user.id)} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.firstName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.middleName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editingUserId === user.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(user.id)}
                      className="text-green-600 hover:text-green-900 mr-2"
                    >
                      <Check />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      <Pencil />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListUsers;
