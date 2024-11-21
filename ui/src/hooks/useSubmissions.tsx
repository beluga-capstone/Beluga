import { Submission } from "@/types";
import { useEffect, useState } from "react";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const loadSubmissionsFromStorage = async (): Promise<Submission[]> => {
  const data = localStorage.getItem("submissions");
  if (!data) return [];

  const submissions = JSON.parse(data) as Submission[];
  return Promise.all(
    submissions.map(async (submission) => ({
      ...submission,
      submitted_at: new Date(submission.submitted_at),
      data: base64ToFile(
        submission.data as unknown as string,
        "submission.zip"
      ),
    }))
  );
};

const saveSubmissionsToStorage = async (submissions: Submission[]) => {
  const submissionsWithBase64 = await Promise.all(
    submissions.map(async (submission) => ({
      ...submission,
      data: await fileToBase64(submission.data),
    }))
  );
  localStorage.setItem("submissions", JSON.stringify(submissionsWithBase64));
};

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const loadSubmissions = async () => {
      const loadedSubmissions = await loadSubmissionsFromStorage();
      setSubmissions(loadedSubmissions);
    };
    loadSubmissions();
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
  };

  const getLatestSubmission = (
    assignmentId: string,
    userId: string
  ): Submission | null => {
    const userSubmissions = submissions.filter(
      (submission) =>
        submission.assignment_id === assignmentId &&
        submission.user_id === userId
    );

    if (userSubmissions.length === 0) return null;

    return userSubmissions.reduce((latest, current) =>
      new Date(latest.submitted_at) > new Date(current.submitted_at)
        ? latest
        : current
    );
  };

  const getAllSubmissionsForAssignmentAndUser = (
    assignmentId: string,
    userId: string
  ): Submission[] => {
    const userSubmissions = submissions.filter(
      (submission) =>
        submission.assignment_id === assignmentId &&
        submission.user_id === userId
    );

    return userSubmissions.sort(
      (a, b) =>
        new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );
  };

  return {
    submissions,
    submit,
    getLatestSubmission,
    getAllSubmissionsForAssignmentAndUser,
  };
};
