"use client";

import StudentListingForSubmission from "@/components/StudentListingForSubmission";
import { useAssignments } from "@/hooks/useAssignments";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useUsers } from "@/hooks/useUsers";

const AssignmentSubmissionsPage = ({
  params,
}: {
  params: { assignmentId: string; submissionId: string };
}) => {
  const { assignments } = useAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.assignment_id === params.assignmentId
  );
  const { users } = useUsers();
  const { getLatestSubmissionForUser } = useSubmissions();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">{assignment?.title}</h1>
        <h2>
          Due:{" "}
          {assignment?.due_at &&
            assignment.due_at.toLocaleDateString("en-US", {
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
            <th>Submission Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7}>
              <hr />
            </td>
          </tr>
          {users.map((user) => {
            return (
              <StudentListingForSubmission
                key={user.id}
                student={user}
                assignment={assignment}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentSubmissionsPage;
