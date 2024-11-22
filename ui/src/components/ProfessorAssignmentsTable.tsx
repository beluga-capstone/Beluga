import { useAssignments } from "@/hooks/useAssignments";
import { ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";

const format_date = (date:string) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

const ProfessorAssignmentsTable = () => {
  const { assignments, setPublished, setLateSubmissions } = useAssignments();

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
          <tr
            key={assignment.assignment_id}
            className="cursor-pointer hover:border hover:border-red-500"
            onClick={() =>
              window.location.href = `/assignments/${assignment.assignment_id}`
            }
          >
            <td className="text-center py-2">{assignment.title}</td>
            <td className="text-center py-2">
              {assignment.publish_at
                ? format_date(assignment.publish_at.toISOString())
                : "not found"}
            </td>
            <td className="text-center py-2">
              {assignment.due_at
                ? format_date(assignment.due_at.toISOString())
                : "not found"}
            </td>
            <td className="text-center py-2">0</td>
            <td className="py-2">
              <div className="flex justify-center items-center">
                {assignment.is_published ? (
                  <ToggleRight
                    size={32}
                    className="text-green-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPublished(assignment.assignment_id, false);
                    }}
                  />
                ) : (
                  <ToggleLeft
                    size={32}
                    className="text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPublished(assignment.assignment_id, true);
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setLateSubmissions(assignment.assignment_id, false);
                    }}
                  />
                ) : (
                  <ToggleLeft
                    size={32}
                    className="text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLateSubmissions(assignment.assignment_id, true);
                    }}
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
