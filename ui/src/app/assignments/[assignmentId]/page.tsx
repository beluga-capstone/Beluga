"use client";

import Button from "@/components/Button";
import SubmissionZone from "@/components/SubmissionZone";
import { ROLES } from "@/constants";
import { useAssignments } from "@/hooks/useAssignments";
import { useImages } from "@/hooks/useImages";
import { useProfile } from "@/hooks/useProfile";
import { ArrowUpFromLine, Edit2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const format_date = (date:string) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});
const AssignmentPage = ({ params }: { params: { assignmentId: string } }) => {
  const { profile } = useProfile();
  const { assignments } = useAssignments();
  const assignment = assignments.find(
    (assignment) =>
      assignment.assignmentId === params.assignmentId
  );

  const { images } = useImages();
  const containerName=`${assignment?.imageId}`;

  const [submissionWindowIsOpen, setSubmissionWindowIsOpen] = useState(false);
  const [submitIsEnabled, setSubmitIsEnabled] = useState(false);
  const [zipFile, setZipFile] = useState<File | null>(null);

  return (
    <div className="container mx-auto p-4">
      <div
        className={`mb-8 flex items-center ${
          profile?.role_id === ROLES.STUDENT ? "justify-between" : ""
        }`}
      >
        <h1 className="font-bold text-4xl">{assignment?.title}</h1>
        {profile?.role_id !== ROLES.STUDENT && (
          <Link
            href={`/assignments/edit/${assignment?.assignmentId}`}
            className="px-6"
          >
            <Edit2 size={24} />
          </Link>
        )}
        {profile?.role_id === ROLES.STUDENT &&
          (submissionWindowIsOpen ? (
            <div className="flex">
              <div className="px-2">
                <Button
                  className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => setSubmissionWindowIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>
              <div className="px-2">
                <Button
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => {
                    setSubmissionWindowIsOpen(false);
                    setSubmitIsEnabled(false);
                    console.log(zipFile);
                  }}
                  disabled={!submitIsEnabled || !zipFile}
                >
                  Submit
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              onClick={() => setSubmissionWindowIsOpen(true)}
            >
              <ArrowUpFromLine className="mr-2" /> Upload Files
            </Button>
          ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-row">
          <h2 className="font-bold pb-4">
            Due Date:{" "}
            {assignment?.dueAt?
              format_date(assignment.dueAt.toISOString()): "not found"
            }
          </h2>
          <h2 className="font-bold pb-4">
            Available:{" "}
            {assignment?.publishAt?
              format_date(assignment.publishAt.toISOString()): "not found"
            }
          </h2>
        </div>
        {assignment?.imageId && (
          <h2 className="font-bold pb-4">
            Image ID:{" "}
            <Link href={`/machines/containers/${assignment.imageId}`}>
              {containerName}
            </Link>
          </h2>
        )}
      </div>
      {assignment?.description && (
        <>
          <h2 className="font-bold py-4">Description</h2>
          <p>
            {assignment?.description.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </>
      )}
      {profile?.role_id !== ROLES.STUDENT && (
        <p className="text-blue-500 py-8">
          <Link href={`/assignments/${assignment?.assignmentId}/submissions`}>
            View Submissions
          </Link>
        </p>
      )}
      {profile?.role_id === ROLES.STUDENT && submissionWindowIsOpen && (
        <SubmissionZone
          setSubmitIsEnabled={setSubmitIsEnabled}
          setZipFile={setZipFile}
        />
      )}
    </div>
  );
};

export default AssignmentPage;
