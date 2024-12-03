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
            <th>Due</th>
            <th>Submissions</th>
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
                {assignment.due_at
                  ? `${shortDate(assignment.due_at)} at ${shortTime(
                      assignment.due_at
                    )}`
                  : "-"}
              </td>
              <td className="text-center py-2">
                {getSubmissionCountForAssignment(assignment.assignment_id)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfessorAssignmentsTable;
