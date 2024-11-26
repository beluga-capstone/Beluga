import { ToggleLeft, ToggleRight } from "lucide-react";
import { Assignment } from "@/types";
import { shortDate, shortTime } from "@/lib/utils";
import { useSubmissions } from "@/hooks/useSubmissions";

interface ProfessorAssignmentsTableProps {
  assignments: Assignment[];
  setPublished: (assignmentId: string, isPublished: boolean) => void;
  setLateSubmissions: (
    assignmentId: string,
    allowsLateSubmissions: boolean
  ) => void;
}

const ProfessorAssignmentsTable: React.FC<ProfessorAssignmentsTableProps> = ({
  assignments,
  setPublished,
  setLateSubmissions,
}) => {
  const { getSubmissionCountForAssignment } = useSubmissions();

  return (
    <div>
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
            <tr
              key={assignment.assignment_id}
              onClick={() =>
                (window.location.href = `/assignments/${assignment.assignment_id}`)
              }
              className="cursor-pointer"
            >
              <td className="text-center py-2">{assignment.title}</td>
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
                      onClick={() =>
                        setPublished(assignment.assignment_id, true)
                      }
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
    </div>
  );
};

export default ProfessorAssignmentsTable;
