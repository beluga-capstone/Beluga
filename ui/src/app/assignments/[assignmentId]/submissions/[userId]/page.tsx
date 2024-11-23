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
import Button from "@/components/Button";
import { shortDate, shortTime } from "@/lib/utils";
import GradeEntry from "@/components/GradeEntry";

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
  const [zipFile, setZipfile] = useState<JSZip | null>(null);
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
        setZipfile(zip);
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
          {latestSubmission?.submitted_at && (
            <>
              <div className="flex flex-col mr-16 pt-2">
                <Button
                  className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => {
                    if (zipFile) {
                      zipFile
                        .generateAsync({ type: "blob" })
                        .then((content) => {
                          const link = document.createElement("a");
                          link.href = URL.createObjectURL(content);
                          if (profile?.role_id === ROLES.STUDENT) {
                            link.download = `${assignment?.title}.zip`;
                          } else {
                            link.download = `${assignment?.title} ${
                              student?.firstName
                            } ${
                              student?.middleName
                                ? `${student.middleName} `
                                : ""
                            }${student?.lastName}.zip`;
                          }
                          link.click();
                        });
                    }
                  }}
                >
                  Download Files
                </Button>
              </div>
              {allSubmissions.length > 1 && (
                <div className="flex flex-col mr-16">
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
                        {shortDate(submission.submitted_at)} at{" "}
                        {shortTime(submission.submitted_at)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col">
            {assignment?.due_at && (
              <h2>
                Due: {shortDate(assignment?.due_at)} at{" "}
                {shortTime(assignment?.due_at)}
              </h2>
            )}

            <h2>
              {latestSubmission?.submitted_at ? (
                <>
                  Submitted: {shortDate(latestSubmission.submitted_at)} at{" "}
                  {shortTime(latestSubmission.submitted_at)}
                </>
              ) : (
                "Not yet submitted"
              )}
            </h2>

            <div className="flex flex-row items-center">
              <h2 className="pr-2">Grade:</h2>
              <GradeEntry userId={profile?.user_id ?? ""} />
            </div>
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
