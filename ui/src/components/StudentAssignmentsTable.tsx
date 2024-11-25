import { useAssignments } from "@/hooks/useAssignments";
import ListingForSubmission from "./ListingForSubmission";

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
          <th>Score/100</th>
          <th>Graded?</th>
          <th>Submission Time</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={7}>
            <hr />
          </td>
        </tr>
        {assignments.map((assignment) => (
          <ListingForSubmission key={assignment.assignment_id} assignment={assignment} />
        ))}
      </tbody>
    </table>
  );
};

export default StudentAssignmentsTable;
