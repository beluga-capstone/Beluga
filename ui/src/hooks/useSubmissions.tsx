import { Submission } from "@/types";
import { useEffect, useState, useCallback } from "react";

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

const makeSubmissionList = async (res: Response): Promise<Submission[]> => {
  try {
      const submissions = await res.json();
      const itemList: Submission[] = submissions.map(
        (submission: Submission) => ({
          submission_id: submission.submission_id,
          user_id: submission.user_id,
          assignment_id: submission.assignment_id,
          submitted_at: submission.submitted_at
            ? new Date(submission.submitted_at)
            : null,
          grade: submission.grade,
          status: submission.status,
          data: base64ToFile(submission.data, `${submission.submission_id}.zip`),
        })
      );
      return itemList;
  } catch (error) {
    console.log("error make submission list:", error);
    return [];
  }
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
      data:
        submission.data instanceof File
          ? await fileToBase64(submission.data)
          : submission.data,
    }))
  );
  localStorage.setItem("submissions", JSON.stringify(submissionsWithBase64));
};

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const loadSubmissions = async () => {
      const response = await fetch("http://localhost:5000/submissions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const submissions = await makeSubmissionList(response);
      if (submissions) {
        setSubmissions(submissions);
      }
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

    const pushSubmissionDB = async (submission: Submission) => {
      try {
        const fileBase64_data = await fileToBase64(submission.data);

        const res = await fetch("http://localhost:5000/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...submission,
            data: fileBase64_data,
          }),
        });

        if (!res.ok) {
          throw new Error("reponse error");
        }
        const responseData = await res.json();
        console.log("Submission successful:", responseData);
      } catch (error) {
        console.log("error in pushSubmissionDB:", error);
      }
    };

    pushSubmissionDB(submission);

    const newSubmissions = [...submissions, submission];
    setSubmissions(newSubmissions);
    saveSubmissionsToStorage(newSubmissions);
  };

  const getLatestSubmission = async (
    assignmentId: string,
    userId: string
  ): Promise<Submission | null> => {
    const fetchSubmissions = async (): Promise<Submission | null> => {
      try {
        const res = await fetch(
          `http://localhost:5000/submissions/user/${userId}/assignment/${assignmentId}/latest`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch submissions: ${res.status}`);
        }
        console.log("getLatestSubmission");
        const jsonResponse = await res.json();
        if (jsonResponse.submission_id === undefined) {
          return null;
        }
        jsonResponse.data = base64ToFile(jsonResponse.data, `${jsonResponse.submission_id}.zip`)
        jsonResponse.submitted_at= jsonResponse.submission_date ? new Date(jsonResponse.submission_date) : null
        return jsonResponse;
      } catch (error) {
        console.error("Error in fetching submissions:", error);
        return null;
      }
    };

    const result = await fetchSubmissions();
    return result;
  };

  const getSubmission = (submissionId: string): Submission | null => {
    return (
      submissions.find(
        (submission) => submission.submission_id === submissionId
      ) || null
    );
  };

  const getLatestSubmissionForUser = async (
    userId: string
  ): Promise<Submission | null> => {
    const userSubmissionsFunc = (): Promise<Submission | null> => {
      return fetch(`http://localhost:5000/submissions/user/${userId}/latest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch submissions: ${res.status}`);
          }
          const jsonResponse = await res.json();
          if (jsonResponse.submission_id === undefined) {
            return null;
          }
          return jsonResponse;
        })
        .catch((error) => {
          console.error("Error fetching latest submission:", error);
          return null;
        });
    };

    return await userSubmissionsFunc();
  };

  const getAllSubmissionsForAssignmentAndUser = (
    assignmentId: string,
    userId: string
  ): Promise<Submission[]> => {
    const fetchSubmissions = async (): Promise<Submission[]> => {
      return fetch(
        //`http://localhost:5000/submissions/search?assignment_id=${assignmentId}&user_id=${userId}`,
          `http://localhost:5000/submissions/user/${userId}/assignment/${assignmentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then( (data) => {
          return makeSubmissionList(data);
        })
        .catch((error) => {
          console.error(
            "Error in getAllSubmissionsForAssignmentAndUser:",
            error
          );
          return [];
        });
    };

    return fetchSubmissions().then((submissions) => {
      return submissions.sort(
        (a, b) =>
          new Date(b.submitted_at).getTime() -
          new Date(a.submitted_at).getTime()
      );
    });
  };

  const setGrade = (submissionId: string, grade: number) => {
    const updateGradeInAPI = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/submissions/${submissionId}/update/var`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              grade: grade,
            }),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Failed to update submission:", errorData.error);
          return;
        }
      } catch (error) {
        console.error("Error updating submission:", error);
      }
    };
    updateGradeInAPI();
  };

  const setStatus = (submissionId: string, status: string) => {
    const updateStatusInAPI = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/submissions/${submissionId}/update/var`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: status,
            }),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Failed to update submission:", errorData.error);
          return;
        }
      } catch (error) {
        console.error("Error updating submission:", error);
      }
    };
    updateStatusInAPI();
  };

  const getSubmissionCountForAssignment = useCallback(
    async (assignmentId: string): Promise<number> => {
      try {
        const res = await fetch(
          `http://localhost:5000/submissions/assignment/${assignmentId}/count`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch submission count: ${res.status}`);
        }

        const data = await res.json();
        return data.submission_count;
      } catch (error) {
        console.error("Error in getSubmissionCountForAssignment:", error);
        return 0;
      }
    },
    [] // Empty array means the function will be memoized and only created once
  );

  const assignmentIsSubmitted = async (assignmentId: string, userId: string): Promise<boolean> => {
  try {
    const res = await fetch(`http://localhost:5000/submissions/user/${userId}/assignment/${assignmentId}/latest`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Error fetching latest submission: ${res.status}`);
      return false;
    }

    const data = await res.json();

    // Check if a valid submission ID exists
    return data.submission_id !== '';
  } catch (error) {
    console.error("Error in assignmentIsSubmitted:", error);
    return false;
  }
};


  return {
    submissions,
    submit,
    getSubmission,
    getLatestSubmission,
    getLatestSubmissionForUser,
    getAllSubmissionsForAssignmentAndUser,
    setGrade,
    setStatus,
    getSubmissionCountForAssignment,
    assignmentIsSubmitted,
  };
};
