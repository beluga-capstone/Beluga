import { useAssignments } from "@/hooks/useAssignments";
import { ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";

const ProfessorAssignmentsTable = () => {
  const {assignments, setPublished, setLateSubmissions} = useAssignments();

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
            <td className="text-center py-2">0</td>
            <td className="py-2">
              <div className="flex justify-center items-center">
                {assignment.isPublished ? (
                  <ToggleRight
                    size={32}
                    className="text-green-500"
                    onClick={() => setPublished(assignment.id, false)}
                  />
                ) : (
                  <ToggleLeft
                    size={32}
                    className="text-red-500"
                    onClick={() => setPublished(assignment.id, true)}
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
                    onClick={() => setLateSubmissions(assignment.id, false)}
                  />
                ) : (
                  <ToggleLeft
                    size={32}
                    className="text-red-500"
                    onClick={() => setLateSubmissions(assignment.id, true)}
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
