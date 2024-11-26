import { ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import { Assignment } from "@/types";

interface ProfessorAssignmentsTableProps {
  assignments: Assignment[];
  setPublished: (assignmentId: string, isPublished: boolean) => void;
  setLateSubmissions: (
    assignmentId: string,
    allowsLateSubmissions: boolean
  ) => void;
}

const format_date = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const ProfessorAssignmentsTable: React.FC<ProfessorAssignmentsTableProps> = ({
  assignments,
  setPublished,
  setLateSubmissions,
}) => {
  console.log("Assignments passed to ProfessorAssignmentsTable:", assignments);

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
        {assignments.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center py-4">
              No assignments found.
            </td>
          </tr>
        ) : (
          assignments.map((assignment) => (
            <tr key={assignment.assignment_id}>
              <td className="text-center py-2">
                <Link href={`/assignments/${assignment.assignment_id}`}>
                  {assignment.title}
                </Link>
              </td>
              <td className="text-center py-2">
                {assignment.publish_at
                  ? format_date(assignment.publish_at.toISOString())
                  : "Not Found"}
              </td>
              <td className="text-center py-2">
                {assignment.due_at
                  ? format_date(assignment.due_at.toISOString())
                  : "Not Found"}
              </td>
              <td className="text-center py-2">0</td>
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
          ))
        )}
      </tbody>
    </table>
  );
};

export default ProfessorAssignmentsTable;
