"use client";

import { DEFAULT_STUDENTS } from "@/constants";
import { useAssignments } from "@/hooks/useAssignments";

const AssignmentSubmissionsPage = ({ params }: { params: { id: string } }) => {
  const { assignments } = useAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(params.id, 10)
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">{assignment?.title}</h1>
        <h2>
          Due:{" "}
          {assignment?.dueDate.toLocaleDateString("en-US", {
            dateStyle: "short",
            timeZone: "UTC",
          })}
        </h2>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Submitted?</th>
            <th>Score/100</th>
            <th>Graded?</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7}>
              <hr />
            </td>
          </tr>
          {DEFAULT_STUDENTS.map((student) => (
            <tr key={student.id}>
              <td>{student.lastName}</td>
              <td>{student.firstName}</td>
              <td>{student.middleName}</td>
              <td className="text-center">Yes</td>
              <td className="text-center">100</td>
              <td className="text-center">Yes</td>
              <td className="text-center">1 hour ago</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentSubmissionsPage;
