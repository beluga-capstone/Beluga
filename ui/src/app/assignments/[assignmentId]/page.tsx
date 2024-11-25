"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";
import Button from "@/components/Button";
import SubmissionZone from "@/components/SubmissionZone";
import TerminalMaxxing from "@/components/TerminalMaxxing";
import { ROLES } from "@/constants";
import { useAssignments } from "@/hooks/useAssignments";
import { useProfile } from "@/hooks/useProfile";
import { Assignment } from "@/types";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const normalizeDockerName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_.-]+/g, "_")
    .replace(/^[_.-]+|[_.-]+$/g, "");
};

interface AssignmentPageProps {
  params: { assignmentId: string };
}

const AssignmentPage = ({ params }: AssignmentPageProps) => {
  const router = useRouter();
  const { profile } = useProfile();
  const { assignments } = useAssignments();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [containerName, setContainerName] = useState<string | null>(null);
  const [submissionWindowIsOpen, setSubmissionWindowIsOpen] = useState(false);
  const [submitIsEnabled, setSubmitIsEnabled] = useState(false);
  const [zipFile, setZipFile] = useState<File | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [router]);

  // Initialize assignment and container name
  useEffect(() => {
    const initializeAssignment = async () => {
      const foundAssignment = assignments.find(
        (a) => a.assignment_id === params.assignmentId
      );

      if (foundAssignment) {
        setAssignment(foundAssignment);
        const name = normalizeDockerName(`${foundAssignment.title}_con`);
        setContainerName(name);
      }
    };

    initializeAssignment();
  }, [assignments, params.assignmentId]);

  const renderDescription = () => {
    if (!assignment?.description) return null;
    return assignment.description.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const handleSubmit = () => {
    setSubmissionWindowIsOpen(false);
    setSubmitIsEnabled(false);
    console.log("Submitting file:", zipFile);
  };

  const renderSubmissionControls = () => {
    if (!profile || profile.role_id !== ROLES.STUDENT) return null;

    if (submissionWindowIsOpen) {
      return (
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
              onClick={handleSubmit}
              disabled={!submitIsEnabled || !zipFile}
            >
              Submit
            </Button>
          </div>
        </div>
      );
    }

    return (
      <Button
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        onClick={() => setSubmissionWindowIsOpen(true)}
      >
        Submit Assignment
      </Button>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center">
        <h1 className="font-bold text-4xl">{assignment?.title}</h1>
        {profile?.role_id !== ROLES.STUDENT ? (
          <Link
            href={`/assignments/edit/${assignment?.assignment_id}`}
            className="px-6"
          >
            <Edit2 size={24} />
          </Link>
        ) : (
          renderSubmissionControls()
        )}
      </div>

      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="font-bold pb-4">
            Due Date:{" "}
            {assignment?.due_at
              ? formatDate(assignment.due_at.toISOString())
              : "not found"}
          </h2>
          <h2 className="font-bold pb-4">
            Available:{" "}
            {assignment?.publish_at
              ? formatDate(assignment.publish_at.toISOString())
              : "not found"}
          </h2>

          {assignment?.description && (
            <h2 className="font-bold pb-4">
              Description: {renderDescription()}
            </h2>
          )}

        </div>
      </div>

      <TerminalMaxxing 
        containerName={containerName}
        dockerImageId={assignment?.docker_image_id ?? null}
        description={assignment?.description ?? null}
      />

      {profile?.role_id !== ROLES.STUDENT && (
        <p className="text-blue-500 py-8">
          <Link href={`/assignments/${assignment?.assignment_id}/submissions`}>
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
