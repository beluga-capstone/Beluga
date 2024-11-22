import { useAssignments } from "@/hooks/useAssignments";
import { useProfile } from "@/hooks/useProfile";
import { useSubmissions } from "@/hooks/useSubmissions";
import { shortDate, shortTime } from "@/lib/utils";
import Link from "next/link";

const StudentAssignmentsTable = () => {
  const { assignments } = useAssignments();
  const { submissions } = useSubmissions();
  const { profile } = useProfile();

  const studentDidSubmitAssignment = (
    assignmentId: string,
    user_id: string
  ) => {
    return submissions.some(
      (submission) =>
        submission.assignment_id === assignmentId &&
        submission.user_id === user_id
    );
  };

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Title</th>
          <th>Released</th>
          <th>Due</th>
          <th>Submitted?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={4}>
            <hr />
          </td>
        </tr>
        {assignments.map((assignment) => (
          <tr key={assignment.assignment_id}>
            <td className="text-center py-2">
              <Link href={`/assignments/${assignment.assignment_id}`}>
                {assignment.title}
              </Link>
            </td>
            <td className="text-center py-2">
              {assignment?.publish_at
                ? `${shortDate(assignment.publish_at)} at ${shortTime(
                    assignment.publish_at
                  )}`
                : "-"}
            </td>
            <td className="text-center py-2">
              {assignment?.due_at
                ? `${shortDate(assignment.due_at)} at ${shortTime(
                    assignment.due_at
                  )}`
                : "-"}
            </td>

            <td className="text-center py-2">
              {profile &&
              studentDidSubmitAssignment(
                assignment.assignment_id,
                profile?.user_id
              )
                ? "Yes"
                : "No"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentAssignmentsTable;
