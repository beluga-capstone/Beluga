"use client";

import { useAssignments } from "@/hooks/useAssignments";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useUsers } from "@/hooks/useUsers";
import Link from "next/link";

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
            const latestSubmission = getLatestSubmissionForUser(user.id);
            return (
              <tr key={user.id}>
                <td>
                  <Link
                    href={`/assignments/${assignment?.assignment_id}/submissions/${user.id}`}
                  >
                    {user.lastName}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/assignments/${assignment?.assignment_id}/submissions/${user.id}`}
                  >
                    {user.firstName}
                  </Link>
                </td>
                <td>{user.middleName}</td>
                <td className="text-center">
                  {latestSubmission ? "Yes" : "No"}
                </td>
                <td className="text-center">
                  {latestSubmission?.status === "graded"
                    ? latestSubmission?.grade
                    : "-"}
                </td>
                <td className="text-center">
                  {latestSubmission?.status === "graded" ? "Yes" : "No"}
                </td>
                <td className="text-center">
                  {latestSubmission?.submitted_at ? (
                    <>
                      {latestSubmission.submitted_at.toLocaleDateString(
                        "en-US",
                        {
                          dateStyle: "short",
                          timeZone: "UTC",
                        }
                      )}{" "}
                      at{" "}
                      {latestSubmission.submitted_at.toLocaleTimeString(
                        "en-US",
                        {
                          timeStyle: "short",
                          timeZone: "UTC",
                        }
                      )}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentSubmissionsPage;
