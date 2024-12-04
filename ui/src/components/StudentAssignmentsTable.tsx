import Link from "next/link";
import { Assignment } from "@/types";
import { shortDate, shortTime, toLocalISOString } from "@/lib/utils";

interface StudentsAssignmentsTableProps {
  assignments: Assignment[]; // Array of assignments to display
}

const StudentsAssignmentsTable: React.FC<StudentsAssignmentsTableProps> = ({
  assignments,
}) => {
  return (
    <div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No assignments found.
              </td>
            </tr>
          ) : (
            <>
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
                    {assignment.due_at
                      ? `${shortDate(assignment.due_at)} at ${shortTime(
                          assignment.due_at
                        )}`
                      : "-"}
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsAssignmentsTable;
