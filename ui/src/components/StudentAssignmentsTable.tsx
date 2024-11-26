import Link from "next/link";
import { Assignment } from "@/types";

interface StudentsAssignmentsTableProps {
  assignments: Assignment[]; // Array of assignments to display
}

const format_date = (date: Date | null | undefined) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not Found";

const StudentsAssignmentsTable: React.FC<StudentsAssignmentsTableProps> = ({
  assignments,
}) => {
  return (
    <div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Released</th>
            <th>Due</th>
            <th>Actions</th>
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
                    {format_date(assignment.publish_at)}
                  </td>
                  <td className="text-center py-2">
                    {format_date(assignment.due_at)}
                  </td>
                  <td className="text-center py-2">
                    <Link
                      href={`/assignments/${assignment.assignment_id}`}
                      className="text-blue-500 underline"
                    >
                      View Details
                    </Link>
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

export default StudentAssignmentsTable;
