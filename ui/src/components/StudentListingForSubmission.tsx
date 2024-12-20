import { useSubmissions } from "@/hooks/useSubmissions";
import { shortDate, shortTime } from "@/lib/utils";
import { Assignment, User } from "@/types";
import Link from "next/link";
import { useState } from "react";

interface StudentListingForSubmissionProps {
  student: User;
  assignment: Assignment | undefined;
}

const StudentListingForSubmission: React.FC<
  StudentListingForSubmissionProps
> = ({ student, assignment }) => {
  const { getLatestSubmissionForUser, setGrade, setStatus } = useSubmissions();
  const [isEditingGrade, setIsEditingGrade] = useState(false);
  const [newGrade, setNewGrade] = useState<string>("");
  const latestSubmission = getLatestSubmissionForUser(student.id);

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
          className={`w-16 text-center mx-auto ${
            latestSubmission ? "cursor-pointer" : ""
          }`}
          onClick={() => latestSubmission && setIsEditingGrade(true)}
        >
          {isEditingGrade ? (
            <input
              type="number"
              placeholder="Grade"
              value={newGrade ?? ""}
              className="border rounded p-1 bg-surface w-16"
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === "" ||
                  (parseInt(value) >= 0 && parseInt(value) <= 100)
                ) {
                  setNewGrade(value);
                }
              }}
              onBlur={() => {
                if (latestSubmission) {
                  if (newGrade === "") {
                    setGrade(latestSubmission.submission_id, 0);
                    setStatus(latestSubmission.submission_id, "");
                  } else {
                    setGrade(
                      latestSubmission.submission_id,
                      parseInt(newGrade)
                    );
                  }
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
        {latestSubmission?.submitted_at
          ? `${shortDate(latestSubmission.submitted_at)} at ${shortTime(
              latestSubmission.submitted_at
            )}`
          : "-"}
      </td>
    </tr>
  );
};

export default StudentListingForSubmission;
