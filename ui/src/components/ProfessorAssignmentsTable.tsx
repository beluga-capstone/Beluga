import { useAssignments } from "@/hooks/useAssignments";
import { ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";

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
          <tr key={assignment.assignmentId}>
            <td className="text-center py-2">
              <Link href={`/assignments/${assignment.assignmentId}`}>
                {assignment.title}
              </Link>
            </td>
            <td className="text-center py-2">
              {assignment.publishAt.toLocaleDateString("en-US", {
                dateStyle: "short",
                timeZone: "UTC",
              })}
            </td>
            <td className="text-center py-2">
              {assignment.dueAt.toLocaleDateString("en-US", {
                dateStyle: "short",
                timeZone: "UTC",
              })}
            </td>
            <td className="text-center py-2">0</td>
            <td className="py-2">
              <div className="flex justify-center items-center">
                {assignment.isPublished ? (
                  <ToggleRight
                    size={32}
                    className="text-green-500"
                    onClick={() => setPublished(assignment.assignmentId, false)}
                  />
                ) : (
                  <ToggleLeft
                    size={32}
                    className="text-red-500"
                    onClick={() => setPublished(assignment.assignmentId, true)}
                  />
                )}
              </div>
            </td>
            <td className="py-2">
              <div className="flex justify-center items-center">
                {assignment.allowsLateSubmissions ? (
                  <ToggleRight
                    size={32}
                    className="text-green-500"
                    onClick={() =>
                      setLateSubmissions(assignment.assignmentId, false)
                    }
                  />
                ) : (
                  <ToggleLeft
                    size={32}
                    className="text-red-500"
                    onClick={() =>
                      setLateSubmissions(assignment.assignmentId, true)
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
