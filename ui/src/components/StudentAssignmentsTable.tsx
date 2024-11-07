import { useAssignments } from "@/hooks/useAssignments";
import Link from "next/link";

const StudentAssignmentsTable = () => {
  const { assignments } = useAssignments();

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
          <tr key={assignment.id}>
            <td className="text-center py-2">
              <Link href={`/assignments/${assignment.id}`}>
                {assignment.title}
              </Link>
            </td>
            <td className="text-center py-2">
              {assignment.releaseDate.toLocaleDateString("en-US", {
                dateStyle: "short",
                timeZone: "UTC",
              })}
            </td>
            <td className="text-center py-2">
              {assignment.dueDate.toLocaleDateString("en-US", {
                dateStyle: "short",
                timeZone: "UTC",
              })}
            </td>
            <td className="text-center py-2">No</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentAssignmentsTable;