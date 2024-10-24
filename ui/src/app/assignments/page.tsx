"use client";

import Button from "@/components/Button";
import { useAssignments } from "@/hooks/useAssignments";
import { Plus, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";

const Assignments: React.FC = () => {
  const { assignments, setPublished, setLateSubmissions } = useAssignments();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">Assignments</h1>
        <Link href="/assignments/new">
          <Button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <Plus className="mr-2" /> Add Assignment
          </Button>
        </Link>
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
              <td className="text-center py-2">
                <Link href={`/assignments/${assignment.id}`}>
                  {assignment.title}
                </Link>
              </td>
              <td className="text-center py-2">
                {assignment.releaseDate.toLocaleDateString("en-US", {
                  dateStyle: "short",
                  timeZone: "UTC",
                })}
              </td>
              <td className="text-center py-2">
                {assignment.dueDate.toLocaleDateString("en-US", {
                  dateStyle: "short",
                  timeZone: "UTC",
                })}
              </td>
              <td className="text-center py-2">0</td>
              <td className="py-2">
                <div className="flex justify-center items-center">
                  {assignment.isPublished ? (
                    <ToggleRight
                      size={32}
                      className="text-green-500"
                      onClick={() => setPublished(assignment.id, false)}
                    />
                  ) : (
                    <ToggleLeft
                      size={32}
                      className="text-red-500"
                      onClick={() => setPublished(assignment.id, true)}
                    />
                  )}
                </div>
              </td>
              <td className="py-2">
                <div className="flex justify-center items-center">
                  {assignment.allowsLateSubmissions ? (
                    <ToggleRight
                      size={32}
                      className="text-green-500"
                      onClick={() => setLateSubmissions(assignment.id, false)}
                    />
                  ) : (
                    <ToggleLeft
                      size={32}
                      className="text-red-500"
                      onClick={() => setLateSubmissions(assignment.id, true)}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Assignments;
