"use client";

import Button from "@/components/Button";
import SubmissionZone from "@/components/SubmissionZone";
import { ROLES } from "@/constants";
import { useAssignments } from "@/hooks/useAssignments";
import { useContainers } from "@/hooks/useContainers";
import { useProfile } from "@/hooks/useProfile";
import { ArrowUpFromLine, Edit2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const AssignmentPage = ({ params }: { params: { assignmentId: string } }) => {
  const { profile } = useProfile();
  const { assignments } = useAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(params.assignmentId, 10)
  );
  const { containers } = useContainers();
  const containerName = containers.find(
    (container) => container.id === assignment?.containerId
  )?.name;
  const [submissionWindowIsOpen, setSubmissionWindowIsOpen] = useState(false);
  const [submitIsEnabled, setSubmitIsEnabled] = useState(false);
  const [zipFile, setZipFile] = useState<File | null>(null);

  return (
    <div className="container mx-auto p-4">
      <div
        className={`mb-8 flex items-center ${
          profile?.role === ROLES.STUDENT ? "justify-between" : ""
        }`}
      >
        <h1 className="font-bold text-4xl">{assignment?.title}</h1>
        {profile?.role !== ROLES.STUDENT && (
          <Link href={`/assignments/edit/${assignment?.id}`} className="px-6">
            <Edit2 size={24} />
          </Link>
        )}
        {profile?.role === ROLES.STUDENT &&
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
            {assignment?.dueDate.toLocaleDateString("en-US", {
              dateStyle: "short",
              timeZone: "UTC",
            })}
          </h2>
          <h2 className="font-bold pb-4">
            Available:{" "}
            {assignment?.releaseDate.toLocaleDateString("en-US", {
              dateStyle: "short",
              timeZone: "UTC",
            })}{" "}
            to{" "}
            {assignment?.dueDate.toLocaleDateString("en-US", {
              dateStyle: "short",
              timeZone: "UTC",
            })}
          </h2>
        </div>
        {assignment?.containerId && assignment.containerId !== -1 && (
          <h2 className="font-bold pb-4">
            Container:{" "}
            <Link href={`/machines/containers/${assignment.containerId}`}>
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
      {profile?.role !== ROLES.STUDENT && (
        <p className="text-blue-500 py-8">
          <Link href={`/assignments/${assignment?.id}/submissions`}>
            View Submissions
          </Link>
        </p>
      )}
      {profile?.role === ROLES.STUDENT && submissionWindowIsOpen && (
        <SubmissionZone
          setSubmitIsEnabled={setSubmitIsEnabled}
          setZipFile={setZipFile}
        />
      )}
    </div>
  );
};

export default AssignmentPage;
