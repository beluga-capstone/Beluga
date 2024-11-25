import { useSubmissions } from "@/hooks/useSubmissions";
import { useState } from "react";

interface GradeEntryProps {
  submissionId: string;
}

const GradeEntry = ({ submissionId }: GradeEntryProps) => {
  const { getSubmission, setGrade, setStatus } = useSubmissions();
  const [isEditingGrade, setIsEditingGrade] = useState(false);
  const [newGrade, setNewGrade] = useState<string>("");
  const submission = getSubmission(submissionId);

  return (
    <>
      <div
        className={submission ? "cursor-pointer" : ""}
        onClick={() => submission && setIsEditingGrade(true)}
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
              if (submission) {
                if (newGrade === "") {
                  setGrade(submission.submission_id, 0);
                  setStatus(submission.submission_id, "");
                } else {
                  setGrade(submission.submission_id, parseInt(newGrade));
                }
              }
              setIsEditingGrade(false);
            }}
            autoFocus
          />
        ) : submission?.status === "graded" ? (
          submission?.grade
        ) : (
          "-"
        )}
      </div>
    </>
  );
};

export default GradeEntry;
