import { ASSIGNMENTS } from "@/constants";
import { Edit2 } from "lucide-react";

export default function Assignments() {
  return (
    <>
      <table className="table">
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
          {ASSIGNMENTS.map((assignment) => (
            <tr key={assignment.id}>
              <td className="text-center py-2">{assignment.title}</td>
              <td className="text-center py-2">{assignment.dueDate}</td>
              <td className="text-center py-2">{assignment.dueDate}</td>
              <td className="text-center py-2">0</td>
              <td className="text-center py-2">0</td>
              <td className="text-center py-2">0</td>
              <td>
                <Edit2 size={24} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
