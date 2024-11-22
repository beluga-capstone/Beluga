import { useSubmissions } from "@/hooks/useSubmissions";
import { Assignment, Submission, User } from "@/types";
import Link from "next/link";
import { useState } from "react";

interface StudentListingForSubmissionProps {
  student: User;
  assignment: Assignment | undefined;
  latestSubmission: Submission | undefined;
}

const StudentListingForSubmission: React.FC<
  StudentListingForSubmissionProps
> = ({ student, assignment, latestSubmission }) => {
  const { setGrade } = useSubmissions();
  const [isEditingGrade, setIsEditingGrade] = useState(false);
  const [newGrade, setNewGrade] = useState<number | null>(null);

  return (
    <tr key={student.id}>
      <td className="py-2">
        <Link
          href={`/assignments/${assignment?.assignment_id}/submissions/${student.id}`}
        >
          {student.lastName}
        </Link>
      </td>
      <td className="py-2">
        <Link
          href={`/assignments/${assignment?.assignment_id}/submissions/${student.id}`}
        >
          {student.firstName}
        </Link>
      </td>
      <td className="py-2">{student.middleName}</td>
      <td className="py-2 text-center">{latestSubmission ? "Yes" : "No"}</td>
      <td>
        <div
          className="w-16 text-center cursor-pointer mx-auto"
          onClick={() => setIsEditingGrade(true)}
        >
          {isEditingGrade ? (
            <input
              type="number"
              placeholder="Grade"
              value={newGrade ?? ""}
              className="border rounded p-1 bg-surface w-16"
              onChange={(e) => setNewGrade(parseInt(e.target.value))}
              onBlur={() => {
                if (newGrade !== null && latestSubmission) {
                  setGrade(latestSubmission.submission_id, newGrade);
                }
                setIsEditingGrade(false);
              }}
              autoFocus
            />
          ) : latestSubmission?.status === "graded" ? (
            latestSubmission?.grade
          ) : (
            "-"
          )}
        </div>
      </td>
      <td className="py-2 text-center">
        {latestSubmission?.status === "graded" ? "Yes" : "No"}
      </td>
      <td className="py-2 text-center">
        {latestSubmission?.submitted_at ? (
          <>
            {latestSubmission.submitted_at.toLocaleDateString("en-US", {
              dateStyle: "short",
              timeZone: "UTC",
            })}{" "}
            at{" "}
            {latestSubmission.submitted_at.toLocaleTimeString("en-US", {
              timeStyle: "short",
              timeZone: "UTC",
            })}
          </>
        ) : (
          "-"
        )}
      </td>
    </tr>
  );
};

export default StudentListingForSubmission;
