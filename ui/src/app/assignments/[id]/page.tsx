"use client";

import { useAssignments } from "@/hooks/useAssignments";

const AssignmentPage = ({ params }: { params: { id: string } }) => {
  const { assignments } = useAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(params.id, 10)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">{assignment?.title}</h1>
      <h2 className="font-bold pb-4">
        Due Date: {assignment?.dueDate.toLocaleDateString()}
      </h2>
      <h2 className="font-bold pb-4">
        Available: {assignment?.releaseDate.toLocaleDateString()} to{" "}
        {assignment?.dueDate.toLocaleDateString()}
      </h2>
      {assignment?.description && (
        <>
          <h2 className="font-bold pb-4">Description</h2>
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
    </div>
  );
};

export default AssignmentPage;
