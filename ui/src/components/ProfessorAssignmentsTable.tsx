import { useAssignments } from "@/hooks/useAssignments";
import { useSubmissions } from "@/hooks/useSubmissions";
import { shortDate, shortTime } from "@/lib/utils";
import { ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";

const ProfessorAssignmentsTable = () => {
  const { assignments, setPublished, setLateSubmissions } = useAssignments();
  const { getSubmissionCountForAssignment } = useSubmissions();

  return (
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
          <tr key={assignment.assignment_id}>
            <td className="text-center py-2">
              <Link href={`/assignments/${assignment.assignment_id}`}>
                {assignment.title}
              </Link>
            </td>
            <td className="text-center py-2">
              {assignment.publish_at
                ? `${shortDate(assignment.publish_at)} at ${shortTime(
                    assignment.publish_at
                  )}`
                : "-"}
            </td>
            <td className="text-center py-2">
              {assignment.due_at
                ? `${shortDate(assignment.due_at)} at ${shortTime(
                    assignment.due_at
                  )}`
                : "-"}
            </td>
            <td className="text-center py-2">
              {getSubmissionCountForAssignment(assignment.assignment_id)}
            </td>
            <td className="py-2">
              <div className="flex justify-center items-center">
                {assignment.is_published ? (
                  <ToggleRight
                    size={32}
                    className="text-green-500"
                    onClick={() =>
                      setPublished(assignment.assignment_id, false)
                    }
                  />
                ) : (
                  <ToggleLeft
                    size={32}
                    className="text-red-500"
                    onClick={() => setPublished(assignment.assignment_id, true)}
                  />
                )}
              </div>
            </td>
            <td className="py-2">
              <div className="flex justify-center items-center">
                {assignment.allows_late_submissions ? (
                  <ToggleRight
                    size={32}
                    className="text-green-500"
                    onClick={() =>
                      setLateSubmissions(assignment.assignment_id, false)
                    }
                  />
                ) : (
                  <ToggleLeft
                    size={32}
                    className="text-red-500"
                    onClick={() =>
                      setLateSubmissions(assignment.assignment_id, true)
                    }
                  />
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProfessorAssignmentsTable;
