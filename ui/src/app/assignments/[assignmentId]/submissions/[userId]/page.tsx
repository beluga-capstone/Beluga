"use client";

import FilesPreview from "@/components/FilesPreview";
import { useAssignments } from "@/hooks/useAssignments";
import { useProfile } from "@/hooks/useProfile";
import { useSubmissions } from "@/hooks/useSubmissions";
import { Submission, User } from "@/types";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { ROLES } from "@/constants";
import { useUsers } from "@/hooks/useUsers";

const SubmissionPage = ({
  params,
}: {
  params: { assignmentId: string; userId: string };
}) => {
  const { profile } = useProfile();
  const { assignments } = useAssignments();
  const {
    getLatestSubmission,
    getLatestSubmissionForUser,
    getAllSubmissionsForAssignmentAndUser,
  } = useSubmissions();
  const { getUser } = useUsers();
  const student = getUser(params.userId);
  const assignment = assignments.find(
    (assignment) => assignment.assignment_id === params.assignmentId
  );
  const [latestSubmission, setLatestSubmission] = useState<Submission | null>(
    null
  );
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (profile && profile.role_id === ROLES.STUDENT) {
      setLatestSubmission(
        getLatestSubmission(params.assignmentId, profile.user_id)
      );
      setAllSubmissions(
        getAllSubmissionsForAssignmentAndUser(
          params.assignmentId,
          profile.user_id
        )
      );
    } else if (profile) {
      setLatestSubmission(getLatestSubmissionForUser(params.userId));
      setAllSubmissions(
        getAllSubmissionsForAssignmentAndUser(
          params.assignmentId,
          params.userId
        )
      );
    }
  }, [assignments, params.assignmentId]);

  useEffect(() => {
    if (latestSubmission) {
      const unzipFiles = async (zipData: ArrayBuffer) => {
        const zip = await JSZip.loadAsync(zipData);
        const files: File[] = [];

        for (const relativePath of Object.keys(zip.files)) {
          const file = zip.files[relativePath];
          const fileData = await file.async("blob");
          files.push(new File([fileData], relativePath));
        }

        return files;
      };

      latestSubmission.data
        .arrayBuffer()
        .then((buffer) => unzipFiles(buffer))
        .then((unzippedFiles) => {
          setFiles(unzippedFiles);
        });
    }
  }, [latestSubmission]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">{assignment?.title}</h1>

        <div className="flex">
          <div className="flex flex-col mr-16">
            {latestSubmission?.submitted_at && (
              <>
                <h2>Viewing Submission:</h2>
                <select
                  className="border rounded p-1 bg-surface dark:[color-scheme:dark]"
                  onChange={(e) => {
                    const selectedSubmission = allSubmissions.find(
                      (submission) =>
                        submission.submission_id === e.target.value
                    );
                    if (selectedSubmission) {
                      setLatestSubmission(selectedSubmission);
                    }
                  }}
                  value={latestSubmission?.submission_id || ""}
                  title="Viewing Submission"
                >
                  {allSubmissions.map((submission) => (
                    <option
                      key={submission.submission_id}
                      value={submission.submission_id}
                    >
                      {submission.submitted_at.toLocaleDateString("en-US", {
                        dateStyle: "short",
                        timeZone: "UTC",
                      })}{" "}
                      at{" "}
                      {submission.submitted_at.toLocaleTimeString("en-US", {
                        timeStyle: "short",
                        timeZone: "UTC",
                      })}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div className="flex flex-col">
            <h2>
              Due:{" "}
              {assignment?.due_at
                ? assignment.due_at.toLocaleDateString("en-US", {
                    dateStyle: "short",
                    timeZone: "UTC",
                  })
                : "No due date"}
            </h2>

            <h2>
              {latestSubmission?.submitted_at ? (
                <>
                  Submitted:{" "}
                  {latestSubmission?.submitted_at.toLocaleTimeString("en-US", {
                    timeStyle: "short",
                    timeZone: "UTC",
                  })}
                </>
              ) : (
                "Not yet submitted"
              )}
            </h2>

            <h2>
              {latestSubmission?.submitted_at &&
                (latestSubmission?.status === "graded" ? (
                  <>Grade: {latestSubmission?.grade}</>
                ) : (
                  "Not yet graded"
                ))}
            </h2>
          </div>
        </div>
      </div>

      {profile?.role_id !== ROLES.STUDENT && (
        <h2 className="text-2xl pb-8">
          {student?.firstName} {student?.lastName}
        </h2>
      )}

      {files && files.length > 0 && <FilesPreview files={files} />}
    </div>
  );
};

export default SubmissionPage;
