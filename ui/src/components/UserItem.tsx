// UserItem.tsx

import React from "react";
import { Trash2, Pencil, Square, CheckSquare } from "lucide-react";
import { User } from "@/types";
import IconButton from "./IconButton";

interface ContainerItemProps {
  user: User;
  onDelete: (id: number) => void;
  onToggleSelect: (id: number) => void;
  isSelected: boolean;
}

const UserItem: React.FC<ContainerItemProps> = ({
  user,
  onDelete,
  onToggleSelect,
  isSelected,
}) => (
  <div className="flex items-center space-x-4 p-4 border rounded-lg mb-4">
    <button
      onClick={() => onToggleSelect(user.id)}
      className="focus:outline-none"
    >
      {isSelected ? (
        <CheckSquare className="text-blue-500" />
      ) : (
        <Square className="text-gray-400" />
      )}
    </button>
    <div className="flex-grow">
      <h3 className="font-semibold">
        {user.lastName}{", "}{user.firstName}{" "}{user.middleName || ""}
      </h3>
      <p className="text-sm text-on-surface">
        {user.role}
      </p>
    </div>
    <div className="flex items-center space-x-2">
      <IconButton
        title="Delete"
        onClick={() => onDelete(user.id)}
        icon={Trash2}
        iconColor="red-500"
      />
    </div>
  </div>
);

export default UserItem;
