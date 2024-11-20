"use client";

import FilesPreview from "@/components/FilesPreview";
import { useAssignments } from "@/hooks/useAssignments";
import { useProfile } from "@/hooks/useProfile";
import { useSubmissions } from "@/hooks/useSubmissions";
import { Submission } from "@/types";
import { useEffect, useState } from "react";
import JSZip from "jszip";

const SubmissionPage = ({
  params,
}: {
  params: { assignmentId: string; submissionId: string };
}) => {
  const { profile } = useProfile();
  const { assignments } = useAssignments();
  const { getLatestSubmission } = useSubmissions();
  const assignment = assignments.find(
    (assignment) => assignment.assignment_id === params.assignmentId
  );
  const studentFirstName = "Bode";
  const studentLastName = "Raymond";
  const [latestSubmission, setLatestSubmission] = useState<Submission | null>(
    null
  );
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (profile) {
      setLatestSubmission(
        getLatestSubmission(params.assignmentId, profile.user_id)
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

      latestSubmission.data.arrayBuffer().then((buffer) => unzipFiles(buffer)).then((unzippedFiles) => {
        setFiles(unzippedFiles);
      });
    }
  }, [latestSubmission]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">{assignment?.title}</h1>
        <h2>
          Due:{" "}
          {assignment?.due_at
            ? assignment.due_at.toLocaleDateString("en-US", {
                dateStyle: "short",
                timeZone: "UTC",
              })
            : "No due date"}
        </h2>
      </div>
      <h2 className="text-2xl pb-8">
        {studentFirstName} {studentLastName}
      </h2>
      <FilesPreview
        files={files}
      />
    </div>
  );
};

export default SubmissionPage;
