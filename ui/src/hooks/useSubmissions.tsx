import { Submission } from "@/types";
import { useEffect, useState } from "react";

const loadSubmissionsFromStorage = (): Submission[] => {
  const data = localStorage.getItem("submissions");
  return data ? JSON.parse(data) : [];
};

const saveSubmissionsToStorage = (submissions: Submission[]) => {
  localStorage.setItem("submissions", JSON.stringify(submissions));
};

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const loadedSubmissions = loadSubmissionsFromStorage();
    setSubmissions(loadedSubmissions);
  }, []);

  const submit = (userId: string, assignmentId: string, data: File) => {
    const submission: Submission = {
      submission_id: Date.now().toString(),
      user_id: userId,
      assignment_id: assignmentId,
      submitted_at: new Date(),
      grade: 0,
      status: "submitted",
      data,
    };

    const newSubmissions = [...submissions, submission];
    setSubmissions(newSubmissions);
    saveSubmissionsToStorage(newSubmissions);
  }

  const getLatestSubmission = (
    assignmentId: string,
    userId: string
  ): Submission | null => {
    return (
      submissions.find(
        (submission) =>
          submission.assignment_id === assignmentId &&
          submission.user_id === userId
      ) || null
    );
  };

  return {
    submissions,
    submit,
    getLatestSubmission,
  };
};
