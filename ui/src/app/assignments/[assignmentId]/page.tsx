"use client";

import { useAssignments } from "@/hooks/useAssignments";
import { useContainers } from "@/hooks/useContainers";
import { Edit2 } from "lucide-react";
import Link from "next/link";

const AssignmentPage = ({ params }: { params: { assignmentId: string } }) => {
  const { assignments } = useAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(params.assignmentId, 10)
  );
  const { containers } = useContainers();
  const containerName = containers.find(
    (container) => container.id === assignment?.containerId
  )?.name;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center">
        <h1 className="font-bold text-4xl">{assignment?.title}</h1>
        <Link href={`/assignments/edit/${assignment?.id}`} className="px-6">
          <Edit2 size={24} />
        </Link>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-row">
          <h2 className="font-bold pb-4">
            Due Date:{" "}
            {assignment?.dueDate.toLocaleDateString("en-US", {
              dateStyle: "short",
              timeZone: "UTC",
            })}
          </h2>
          <h2 className="font-bold pb-4">
            Available:{" "}
            {assignment?.releaseDate.toLocaleDateString("en-US", {
              dateStyle: "short",
              timeZone: "UTC",
            })}{" "}
            to{" "}
            {assignment?.dueDate.toLocaleDateString("en-US", {
              dateStyle: "short",
              timeZone: "UTC",
            })}
          </h2>
        </div>
        {assignment?.containerId && assignment.containerId !== -1 && (
          <h2 className="font-bold pb-4">
            Container:{" "}
            <Link href={`/machines/containers/${assignment.containerId}`}>
              {containerName}
            </Link>
          </h2>
        )}
      </div>
      {assignment?.description && (
        <>
          <h2 className="font-bold py-4">Description</h2>
          <p>
            {assignment?.description.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </>
      )}
      <p className="text-blue-500 py-8">
        <Link href={`/assignments/${assignment?.id}/submissions`}>
          View Submissions
        </Link>
      </p>
    </div>
  );
};

export default AssignmentPage;
