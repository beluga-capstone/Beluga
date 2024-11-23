import { useSubmissions } from "@/hooks/useSubmissions";
import { useState } from "react";

interface GradeEntryProps {
  userId: string;
}

const GradeEntry = ({ userId }: GradeEntryProps) => {
  const { getLatestSubmissionForUser, setGrade, setStatus } = useSubmissions();
  const [isEditingGrade, setIsEditingGrade] = useState(false);
  const [newGrade, setNewGrade] = useState<string>("");
  const latestSubmission = getLatestSubmissionForUser(userId);

  return (
    <>
      <div
        className={latestSubmission ? "cursor-pointer" : ""}
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
                  setGrade(latestSubmission.submission_id, parseInt(newGrade));
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
    </>
  );
};

export default GradeEntry;
