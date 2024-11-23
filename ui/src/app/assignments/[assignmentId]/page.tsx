"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpFromLine, Edit2, Loader2 } from "lucide-react";

import Button from "@/components/Button";
import SubmissionZone from "@/components/SubmissionZone";
import ContainerPageTerminal from "@/components/ContainerPageTerminal";
import { ROLES } from "@/constants";
import { useAssignments } from "@/hooks/useAssignments";
import { useProfile } from "@/hooks/useProfile";
import { useContainers } from "@/hooks/useContainers";
import { useImageData } from "@/hooks/useImageData";
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
  params: { 
    assignmentId: string 
  };
}

const AssignmentPage = ({ params }: AssignmentPageProps) => {
  // Hooks
  const router = useRouter();
  const { profile } = useProfile();
  const { assignments } = useAssignments();
  const {
    isContainerRunning,
    isDeletingContainer,
    isRunningContainer,
    runContainer,
    deleteContainer,
    checkContainerExists,
  } = useContainers();

  // State
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [containerName, setContainerName] = useState<string | null>(null);
  const [containerId, setContainerId] = useState<string | null>(null);
  const [containerPort, setContainerPort] = useState<number | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [submissionWindowIsOpen, setSubmissionWindowIsOpen] = useState(false);
  const [submitIsEnabled, setSubmitIsEnabled] = useState(false);
  const [zipFile, setZipFile] = useState<File | null>(null);

  // Get image data for the current assignment
  const { imageData } = useImageData(assignment?.docker_image_id ?? null);

  // Effects
  useEffect(() => {
    const initializeAssignment = async () => {
      const foundAssignment = assignments.find(
        (a) => a.assignment_id === params.assignmentId
      );
      
      if (foundAssignment) {
        setAssignment(foundAssignment);
        const name = normalizeDockerName(`${foundAssignment.title}_con`);
        setContainerName(name);

        // Check if container exists
        const { exists, port } = await checkContainerExists(name);
        if (exists) {
          setContainerPort(port);
        }
      }
    };

    initializeAssignment();
  }, [assignments, params.assignmentId, checkContainerExists]);

  useEffect(() => {
    if (imageData?.tag?.[0]) {
      setImageName(imageData.tag[0]);
    }
  }, [imageData]);
  

  useEffect(()=>{
    console.log("port and id ",containerPort,containerId);
  },[containerId,containerPort]);

  // Handlers
  const handleContainerAction = async () => {
    if (isContainerRunning) {
      await deleteContainer(containerId);
      console.log("stopping",containerId);
      setContainerPort(null);
    } else {
      const result = await runContainer(assignment?.docker_image_id ?? null, containerName);

      if (result) {
        console.log("appi return ",result);
        const { container_port: port, container_id: id } = result;
        console.log(`Container running on port: ${port}, ID: ${id}`);
        setContainerPort(port);
        setContainerId(id);
      } else {
        console.error("Failed to run the container.");
      }
    }
  };

  const handleSubmit = () => {
    setSubmissionWindowIsOpen(false);
    setSubmitIsEnabled(false);
    console.log("Submitting file:", zipFile);
    // Implement your submission logic here
  };

  // Render helpers
  const renderDescription = () => {
    if (!assignment?.description) return null;
    return assignment.description.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const renderContainerButton = () => {
    if (!assignment?.docker_image_id) return null;

    return (
      <Button
        className={`${
          isContainerRunning ? "bg-red-500" : "bg-blue-500"
        } text-white px-4 py-2 mb-4 rounded`}
        onClick={handleContainerAction}
        disabled={isDeletingContainer || isRunningContainer}
      >
        {isDeletingContainer ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Stopping...
          </div>
        ) : isRunningContainer ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Starting...
          </div>
        ) : (
          isContainerRunning ? "Stop Container" : "Create Container"
        )}
      </Button>
    );
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
        <ArrowUpFromLine className="mr-2" /> Upload Files
      </Button>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Loading Overlay */}
      {isDeletingContainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-500 p-6 rounded-lg shadow-xl flex items-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <p>Stopping container...</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div
        className={`mb-8 flex items-center ${
          profile?.role_id === ROLES.STUDENT ? "justify-between" : ""
        }`}
      >
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

      {/* Assignment Details Section */}
      <div className="flex justify-between items-center">
        <div className="flex-row">
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

          <h2 className="font-bold pb-4">
            {assignment?.docker_image_id
              ? `Image name: ${imageName}`
              : null}
          </h2>

          {renderContainerButton()}
        </div>
      </div>

      {/* xterm */}
      <div className="flex justify-between items-center">
        {assignment && (
          <ContainerPageTerminal
            isRunning={isContainerRunning}
            containerPort={containerPort}
          />
        )}
      </div>

      {/* Submissions Link for non-students */}
      {profile?.role_id !== ROLES.STUDENT && (
        <p className="text-blue-500 py-8">
          <Link href={`/assignments/${assignment?.assignment_id}/submissions`}>
            View Submissions
          </Link>
        </p>
      )}

      {/* Submission Zone */}
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
