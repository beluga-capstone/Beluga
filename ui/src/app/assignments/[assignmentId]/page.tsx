"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpFromLine, Edit2 } from "lucide-react";
import Button from "@/components/Button";
import SubmissionZone from "@/components/SubmissionZone";
import TerminalMaxxing from "@/components/TerminalMaxxing";
import { ROLES } from "@/constants";
import { useAssignments } from "@/hooks/useAssignments";
import { useProfile } from "@/hooks/useProfile";
import { Assignment, Submission } from "@/types";
import { useSubmissions } from "@/hooks/useSubmissions";
import { shortDate, shortTime } from "@/lib/utils";

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
  const { getLatestSubmission, submit } = useSubmissions();
  const [containerName, setContainerName] = useState<string | null>(null);
  const [submissionWindowIsOpen, setSubmissionWindowIsOpen] = useState(false);
  const [submitIsEnabled, setSubmitIsEnabled] = useState(false);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [latestSubmission, setLatestSubmission] = useState<Submission | null>(
    null
  );

  const handleSubmit = () => {
    if (profile && assignment && zipFile) {
      setSubmissionWindowIsOpen(false);
      setSubmitIsEnabled(false);
      console.log(zipFile);
      submit(profile.user_id, assignment?.assignment_id ?? "", zipFile!);
      setZipFile(null);

      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  };

  useEffect(() => {
    if (!assignment || !profile) return;
    const submission = getLatestSubmission(
      assignment.assignment_id,
      profile.user_id
    );
    setLatestSubmission(submission);
  }, [assignment, profile, zipFile]);

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

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-bold text-4xl">{assignment?.title}</h1>
        {profile?.role_id !== ROLES.STUDENT ? (
          <Link
            href={`/assignments/edit/${assignment?.assignment_id}`}
            className="px-6"
          >
            <Edit2 size={24} />
          </Link>
        ) : null}
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
                  onClick={handleSubmit}
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
              <ArrowUpFromLine className="mr-2" />
              {latestSubmission ? "Reupload files" : "Upload files"}
            </Button>
          ))}
      </div>

      <div className="flex-row">
        <div className="flex justify-between">
          <h2 className="font-bold pb-4">
            {assignment?.due_at
              ? `Due: ${shortDate(assignment?.due_at)} at ${shortTime(
                  assignment?.due_at
                )}`
              : "No due date"}
          </h2>

          {profile?.role_id === ROLES.STUDENT && latestSubmission && (
            <div className="flex flex-col">
              <h2 className="font-bold">
                {latestSubmission?.submitted_at
                  ? `Submitted: ${shortDate(
                      latestSubmission?.submitted_at
                    )} at ${shortTime(latestSubmission?.submitted_at)}`
                  : "Not yet submitted"}
              </h2>
              <h2 className="font-bold">
                {latestSubmission?.status === "graded"
                  ? `Grade: ${latestSubmission?.grade}`
                  : "Not yet graded"}
              </h2>
            </div>
          )}
        </div>

        <div>
          {assignment?.publish_at && assignment?.lock_at && (
            <h2 className="font-bold pb-4">
              Available {shortDate(assignment.publish_at)} at{" "}
              {shortTime(assignment.publish_at)} to{" "}
              {shortDate(assignment.lock_at)} at {shortTime(assignment.lock_at)}
            </h2>
          )}

          {assignment?.description && (
            <div className="font-bold pb-4">
              <h2>Description:</h2>
              {assignment.description.split("\n").map((line, index) => (
                <p key={index} className="mt-2">
                  {line}
                </p>
              ))}
            </div>
          )}

          {profile?.role_id === ROLES.STUDENT && latestSubmission && (
            <p className="text-blue-500 pb-8">
              <Link
                href={`/assignments/${assignment?.assignment_id}/submissions/0`}
              >
                View Submission
              </Link>
            </p>
          )}
        </div>
      </div>

      {profile?.role_id !== ROLES.STUDENT && (
        <p className="text-blue-500 py-8">
          <Link href={`/assignments/${assignment?.assignment_id}/submissions`}>
            View Submissions
          </Link>
        </p>
      )}

      {!submissionWindowIsOpen && (
        <TerminalMaxxing
          containerName={containerName}
          dockerImageId={assignment?.docker_image_id ?? null}
          description={`Container for Assignment ${assignment?.title}`}
        />
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
