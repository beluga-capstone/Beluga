import React from "react";
import { Trash2, Pencil, Square, CheckSquare } from "lucide-react";
import { Course } from "@/types";
import IconButton from "./IconButton";

interface ContainerItemProps {
  course: Course;
  onDelete: (id: number) => void;
  onToggleSelect: (id: number) => void;
  isSelected: boolean;
}

const CourseItem: React.FC<ContainerItemProps> = ({
  course,
  onDelete,
  onToggleSelect,
  isSelected,
}) => (
  <div className="flex items-center space-x-4 p-4 border rounded-lg mb-4">
    <button
      onClick={() => onToggleSelect(course.id)}
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
        {course.name}
      </h3>
      <p className="text-sm text-on-surface">
        {course.term}{" "}{course.year}
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

export default CourseItem;