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

const makeSubmissionList = async (res: Response): Promise<Submission[]> => {
  let submissions = res
  if (!res.bodyUsed) {
    submissions = await res.json();
  }
  const itemList = submissions.map(submission => ({
    submissionId: submission.submission_id,
    userId: submission.user_id,
    assignmentId: submission.assignment_id,
    submissionDate: submission.submissionDate,
    grade: submission.grade,
    status: submission.status,
    data: submission.data,
  }));

  return itemList
}

const saveSubmissionsToStorage = async (submissions: Submission[]) => {
  const submissionsWithBase64 = await Promise.all(
    submissions.map(async (submission) => ({
      ...submission,
      data: await fileToBase64(submission.data),
    }))
  );
  localStorage.setItem("submissions", JSON.stringify(submissionsWithBase64));
};

const pushSubmissionDB = async (submission) => {
  try {
      const fileBase64_data = await fileToBase64(submission.data)
      submission.data = fileBase64_data

      const res = await fetch("http://localhost:5000/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submission),
        });

      if (!res.ok) {
        throw new Error('reponse error');
      }
      const responseData = await res.json();
      console.log('Submission successful:', responseData);
    } catch (error) {
      console.log("error in pushSubmissionDB:", error)
    }
}

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const loadSubmissions = async () => {
      //const loadedSubmissions = await loadSubmissionsFromStorage();
      // setSubmissions(loadedSubmissions);
      const response = await fetch("http://localhost:5000/submissions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
      if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const submissions = await makeSubmissionList(response)
    setSubmissions(submissions)
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

    pushSubmissionDB(submission)

    const newSubmissions = [...submissions, submission];
    setSubmissions(newSubmissions);
    saveSubmissionsToStorage(newSubmissions);
  };

  const getAllSubmissionPerUser = async (userID: string): Promise<Submission[]> => {
    const loadSubmissions = async () => {
      const response = await fetch(`http://localhost:5000/submissions/user/${userID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return await makeSubmissionList(response)
    }
    return loadSubmissions()

  }

  const getLatestSubmission = (
    assignmentId: string,
    userId: string
  ):Promise<Submission | null> => {

    // const userSubmissions = submissions.filter(
    //   (submission) =>
    //     submission.assignment_id === assignmentId &&
    //     submission.user_id === userId
    // );

   const fetchSubmissions = (): Promise<Submission> => {
    return fetch(
      `http://localhost:5000/submissions/user/${userId}/assignment/${assignmentId}/latest`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch submissions: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const submissions = makeSubmissionList(data); // Ensure makeSubmissionList is defined
        return submissions.length > 0 ? submissions[0] : null;
      })
      .catch((error) => {
        console.error("Error in fetching submissions:", error);
        return [];
      });
  };

  return fetchSubmissions();

  }


  const getLatestSubmissionForUser = (userId: string): Promise<Submission | null> => {
    // const userSubmissions = submissions.filter(
    //   (submission) => submission.user_id === userId
    // );

    const userSubmissionsFunc = (): Promise<Submission | null> => {
    return fetch(`http://localhost:5000/submissions/user/${userId}/latest`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch submissions: ${res.status}`);
        }
        return res.json(); // Assuming `makeSubmissionList` expects parsed JSON
      })
      .then((data) => {
        const submissions = makeSubmissionList(data);
        return submissions.length > 0 ? submissions[0] : null;
      })
      .catch((error) => {
        console.error("Error fetching latest submission:", error);
        return null;
      });
  };

  return userSubmissionsFunc();

  };

const getAllSubmissionsForAssignmentAndUser = (
  assignmentId: string,
  userId: string
): Promise<Submission[]> => {
  const fetchSubmissions = (): Promise<Submission[]> => {
    return fetch(
      `http://localhost:5000/submissions/search?assignment_id=${assignmentId}&user_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch submissions: ${res.status}`);
        }
        return res;
      })
      .then((data) => {
        return makeSubmissionList(data);
      })
      .catch((error) => {
        console.error("Error in getAllSubmissionsForAssignmentAndUser:", error);
        return [];
      });
  };

  return fetchSubmissions().then((submissions) => {
    return submissions.sort(
      (a, b) =>
        new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );
  });
};

  const setGrade = (submissionId: string, grade: number) => {
    const updateGradeInAPI = async () => {
    try {
      const res = await fetch(`http://localhost:5000/submissions/${submissionId}/update/var`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'grade': grade,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to update submission:', errorData.error);
        return;
      }
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };
  updateGradeInAPI();
  };

  const setStatus = (submissionId: string, status: string) => {
    const updateStatusInAPI = async () => {
    try {
      const res = await fetch(`http://localhost:5000/submissions/${submissionId}/update/var`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'status': status,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to update submission:', errorData.error);
        return;
      }
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };
  updateStatusInAPI();
  };

  const getSubmissionCountForAssignment = useCallback(
    async (assignmentId: string): Promise<number> => {
      try {
        const res = await fetch(`http://localhost:5000/submissions/assignment/${assignmentId}/count`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

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


  return {
    submissions,
    submit,
    getLatestSubmission,
    getLatestSubmissionForUser,
    getAllSubmissionsForAssignmentAndUser,
    setGrade,
    setStatus,
    getSubmissionCountForAssignment,
  };
};
