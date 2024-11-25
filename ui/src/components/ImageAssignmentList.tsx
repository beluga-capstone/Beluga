import React from "react";
import Link from "next/link";
import NoCopyTextBox from "./NoCopyTextBox";

type Assignment = {
  assignment_id: string;
  title: string;
};

interface AssignmentsListProps {
  assignments: Assignment[] | null;
}

const ImageAssignmentList: React.FC<AssignmentsListProps> = ({ assignments }) => {
  if (!assignments) {
    return <p>No assignments available.</p>;
  }

  return (
    <div>
      <h2 className="font-bold pb-4">Assignments assigned to this image:</h2>
      <ul className="pb-4 flex space-x-1">
        {assignments.map((assignment) => (
          <li key={assignment.assignment_id}>
            <Link href={`/assignments/${assignment.assignment_id}`}>
              <NoCopyTextBox overlayText={assignment.title} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageAssignmentList;
