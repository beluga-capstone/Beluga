"use client";

import Button from "@/components/Button";
import { ASSIGNMENTS } from "@/constants";
import { useAssignments } from "@/hooks/useAssignments";
import { Edit2, Plus } from "lucide-react";

export default function Assignments() {
  const { assignments, addAssignment, deleteAssignment } = useAssignments();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">Assignments</h1>
        <Button
          onClick={() => addAssignment(ASSIGNMENTS[0])}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="mr-2" /> Add Assignment
        </Button>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Released</th>
            <th>Due</th>
            <th>Submissions</th>
            <th>Published</th>
            <th>Late Submissions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={6}>
              <hr />
            </td>
          </tr>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td className="text-center py-2">{assignment.title}</td>
              <td className="text-center py-2">{assignment.dueDate}</td>
              <td className="text-center py-2">{assignment.dueDate}</td>
              <td className="text-center py-2">0</td>
              <td className="text-center py-2">0</td>
              <td className="text-center py-2">0</td>
              <td>
                <Edit2 size={24} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
