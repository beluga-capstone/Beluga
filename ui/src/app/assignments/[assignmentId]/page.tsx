"use client";

import Button from "@/components/Button";
import SubmissionZone from "@/components/SubmissionZone";
import { ROLES } from "@/constants";
import { useAssignments } from "@/hooks/useAssignments";
import { useProfile } from "@/hooks/useProfile";
import { ArrowUpFromLine, Edit2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ContainerPageTerminal from "@/components/ContainerPageTerminal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Assignment, Submission } from "@/types";
import { useImageData } from "@/hooks/useImageData";
import { useSubmissions } from "@/hooks/useSubmissions";
import { shortDate, shortTime } from "@/lib/utils";

const AssignmentPage = ({ params }: { params: { assignmentId: string } }) => {
  const { profile } = useProfile();
  const { assignments } = useAssignments();
  const { getLatestSubmission, submit } = useSubmissions();
  const [isContainerRunning, setIsContainerRunning] = useState(false);
  const [containerPort, setContainerPort] = useState<number | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [containerName, setContainerName] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const router = useRouter();
  const [latestSubmission, setLatestSubmission] = useState<Submission | null>(
    null
  );

  useEffect(() => {
    if (!assignment || !profile) return;
    const submission = getLatestSubmission(
      assignment.assignment_id,
      profile.user_id
    );
    if ((submission.length === 0) || (submission.length === undefined)){
      setLatestSubmission(null);
    }
    else {
      setLatestSubmission(submission);
    }
  }, [assignment, profile]);

  // New state for container stop loading
  const [isStoppingContainer, setIsStoppingContainer] = useState(false);
  const [isRunningContainer, setIsRunningContainer] = useState(false);

  const [submissionWindowIsOpen, setSubmissionWindowIsOpen] = useState(false);
  const [submitIsEnabled, setSubmitIsEnabled] = useState(false);
  const [zipFile, setZipFile] = useState<File | null>(null);

  const checkContainerExists = async (containerName: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/containers/${containerName}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      if (response.ok) {
        console.log("Container exists");
        return { exists: true, port: data.port };
      } else {
        console.log("Container does not exist");
        return { exists: false, port: 0 };
      }
    } catch (error) {
      console.error("Error checking container existence:", error);
      return { exists: false, port: 0 };
    }
  };

  const normalizeDockerName = (name: string) => {
    return name
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9_.-]+/g, "_") // Replace invalid characters with '_'
      .replace(/^[_.-]+|[_.-]+$/g, ""); // Remove leading or trailing '_', '.', '-'
  };

  // get the assignment and check if the container is running on startup
  useEffect(() => {
    const { assignmentId } = params;
    if (assignmentId) {
      const found = assignments.find(
        (assignment) => assignment.assignment_id === params.assignmentId
      );
      setAssignment(found || null);

      const name = normalizeDockerName(`${found?.title}_con`);
      setContainerName(name);

      // check if container exist
      if (found && name) {
        const check_exist_startup = async () => {
          if (!name) return;
          let { exists, port } = await checkContainerExists(name);
          if (exists) {
            setIsContainerRunning(true);
            setContainerPort(port);
          }
        };
        check_exist_startup();
      }
    }
  }, [assignments, params]);

  const { imageData } = useImageData(assignment?.docker_image_id ?? null);

  useEffect(() => {
    if (!assignment) return;

    const name = normalizeDockerName(`${assignment.title}_con`);
    setContainerName(name);

    const checkContainer = async () => {
      if (!name) return;
      const { exists, port } = await checkContainerExists(name);
      if (exists) {
        setIsContainerRunning(true);
        setContainerPort(port);
      }
    };

    checkContainer();
  }, [assignment]);

  useEffect(() => {
    if (imageData?.tag?.[0]) {
      setImageName(imageData.tag[0]);
    }
  }, [imageData]);

  const runContainer = async (imageId: string | null) => {
    if (!imageId) return;

    setIsRunningContainer(true);

    try {
      // If container not exist, create a new container
      const response = await fetch("http://localhost:5000/containers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          container_name: containerName,
          docker_image_id: imageId,
          user_id: profile?.user_id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setContainerPort(data.port);
        setIsContainerRunning(true);
        //alert(`Container started successfully on port ${data.port}`);
      } else {
        //alert(`Error starting container: ${data.error}`);
        console.error("error starting container");
      }
    } catch (error) {
      console.error("Error running container:", error);
      //alert("An error occurred while starting the container.");
    } finally {
      setIsRunningContainer(false);
    }
  };

  const stopContainer = async (containerName: string | null) => {
    if (!containerName) return;

    // Set loading state before making the request
    setIsStoppingContainer(true);

    try {
      const response = await fetch(
        `http://localhost:5000/containers/${containerName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsContainerRunning(false);
        setContainerPort(null);
        //alert("Container stopped successfully.");
        router.refresh();
      } else {
        const data = await response.json();
        //alert(`Error stopping container: ${data.error}`);
      }
    } catch (error) {
      console.error("Error stopping container:", error);
      //alert("An error occurred while stopping the container.");
    } finally {
      // Always reset loading state
      setIsStoppingContainer(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Overlay when stopping container */}
      {isStoppingContainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-500 p-6 rounded-lg shadow-xl flex items-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <p>Stopping container...</p>
          </div>
        </div>
      )}

      <div
        className={`mb-8 flex items-center ${
          profile?.role_id === ROLES.STUDENT ? "justify-between" : ""
        }`}
      >
        <h1 className="font-bold text-4xl">{assignment?.title}</h1>
        {profile?.role_id !== ROLES.STUDENT && (
          <Link
            href={`/assignments/edit/${assignment?.assignment_id}`}
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
                    submit(
                      profile.user_id,
                      assignment?.assignment_id ?? "",
                      zipFile!
                    );
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

        {assignment?.publish_at && assignment?.lock_at && (
          <h2 className="font-bold pb-4">
            Available {shortDate(assignment.publish_at)} at{" "}
            {shortTime(assignment.publish_at)} to{" "}
            {shortDate(assignment.lock_at)} at {shortTime(assignment.lock_at)}
          </h2>
        )}

        {assignment?.description && (
          <h2 className="font-bold pb-4">
            Description:{" "}
            {assignment?.description.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </h2>
        )}

        <h2 className="font-bold pb-4">
          {assignment?.docker_image_id ? `Image name: ${imageName}` : null}
        </h2>

        {profile?.role_id === ROLES.STUDENT && latestSubmission && (
          <p className="text-blue-500 pb-8">
            <Link
              href={`/assignments/${assignment?.assignment_id}/submissions/0`}
            >
              View Submission
            </Link>
          </p>
        )}

        {assignment?.docker_image_id ? (
          <Button
            className={`${
              isContainerRunning ? "bg-red-500" : "bg-blue-500"
            } text-white px-4 py-2 mb-4 rounded`}
            onClick={() =>
              isContainerRunning
                ? stopContainer(containerName)
                : runContainer(assignment.docker_image_id ?? null)
            }
            // Disable the button while stopping or running the container
            disabled={isStoppingContainer || isRunningContainer}
          >
            {isStoppingContainer ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Stopping...
              </div>
            ) : isRunningContainer ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </div>
            ) : isContainerRunning ? (
              "Stop Container"
            ) : (
              "Run Container"
            )}
          </Button>
        ) : null}
      </div>

      <div className="flex justify-between items-center">
        {assignment ? (
          <ContainerPageTerminal
            isRunning={isContainerRunning}
            containerPort={containerPort}
          />
        ) : null}
      </div>

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
