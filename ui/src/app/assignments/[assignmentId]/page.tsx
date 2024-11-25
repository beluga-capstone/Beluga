"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpFromLine, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CopyTextBox from "@/components/CopyTextBox";

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
  params: { assignmentId: string };
}

const AssignmentPage = ({ params }: AssignmentPageProps) => {
  const router = useRouter();
  const { profile } = useProfile();
  const { assignments } = useAssignments();
  const {
    runContainer,
    startContainer,
    stopContainer,
    checkContainerExists,
  } = useContainers();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [containerName, setContainerName] = useState<string | null>(null);
  const [containerStatus, setContainerStatus] = useState<string>("none"); // "none" | "created" | "running" | "stopped"
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageName, setImageName] = useState<string | null>(null);
  const [submissionWindowIsOpen, setSubmissionWindowIsOpen] = useState(false);
  const [submitIsEnabled, setSubmitIsEnabled] = useState(false);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [socketPort, setSocketPort] = useState<number | null>(null);
  const [sshPort, setSshPort] = useState<number | null>(null);


  const { imageData } = useImageData(assignment?.docker_image_id ?? null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [router]);

  // Initialize container and check status
  useEffect(() => {
    const initializeAssignment = async () => {
      const foundAssignment = assignments.find(
        (a) => a.assignment_id === params.assignmentId
      );

      if (foundAssignment) {
        setAssignment(foundAssignment);
        const name = normalizeDockerName(`${foundAssignment.title}_con`);
        setContainerName(name);

        try {
          const { exists, appPort, sshPort, status } = await checkContainerExists(name);
          if (exists && appPort) {
            // Extract the ports
            setSocketPort(appPort);
            setSshPort(sshPort);
            setContainerStatus(status === "running" ? "running" : "stopped");
          } else {
            setContainerStatus("none");
          } 
        } catch (error) {
          console.error("Error checking container:", error);
          toast.error("Failed to check container status");
        }
      } 
    };

    initializeAssignment();
  }, [assignments, params.assignmentId]);

  // Set up periodic status checking
  useEffect(() => {
    if (!containerName) return;

    const checkStatus = async () => {
      try {
        const { exists, appPort, sshPort, status } = await checkContainerExists(containerName);
        if (exists) {
          setContainerStatus(status === "running" ? "running" : "stopped");
          setSocketPort(appPort);
          setSshPort(sshPort);
        } else {
          setContainerStatus("none");
          setSocketPort(null);
          setSshPort(null);
        }
      } catch (error) {
        console.error("Error checking container status:", error);
      }
    };

    checkStatus();
  }, [containerName]);

  useEffect(() => {
    if (imageData?.tag?.[0]) {
      setImageName(imageData.tag[0]);
    }
  }, [imageData]);

  const handleContainerAction = async () => {
    if (isProcessing || !containerName) return;

    setIsProcessing(true);

    try {
      switch (containerStatus) {
        case "none":
          // Create container
          const result = await runContainer(
            assignment?.docker_image_id ?? null,
            containerName,
            assignment?.description??null
          );
          if (result) {
            setSocketPort(result.appPort);
            setSshPort(result.sshPort);
            setContainerStatus("running");
            toast.success("Container created successfully");
            router.refresh();
          } else {
            throw new Error("Failed to create the container");
          }
          break;

        case "stopped":
          // Start container
          await startContainer(containerName);
          setContainerStatus("running");
          const { exists, appPort, sshPort, status } = await checkContainerExists(containerName);
          if (exists) {
            setSocketPort(appPort);
            setSshPort(sshPort);
          }
          toast.success("Container started successfully");
          router.refresh();
          break;

        case "running":
          // Stop container
          await stopContainer(containerName);
          setContainerStatus("stopped");
          setSocketPort(null);
          setSshPort(null);
          toast.success("Container stopped successfully");
          break;
      }
      router.refresh();
    } catch (error) {
      console.error("Container action failed:", error);
      toast.error(`Failed to ${
        containerStatus === "none" 
          ? "create" 
          : containerStatus === "running" 
            ? "stop" 
            : "start"
      } container`);
    } finally {
      setIsProcessing(false);
    }
  };

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

    let buttonConfig = {
      text: "Create Container",
      bgColor: "bg-blue-500",
      loadingText: "Creating..."
    };

    switch (containerStatus) {
      case "stopped":
        buttonConfig = {
          text: "Start Container",
          bgColor: "bg-green-500",
          loadingText: "Starting..."
        };
        break;
      case "running":
        buttonConfig = {
          text: "Stop Container",
          bgColor: "bg-red-500",
          loadingText: "Stopping..."
        };
        break;
    }

    return (
      <Button
        className={`${buttonConfig.bgColor} text-white px-4 py-2 mb-4 rounded`}
        onClick={handleContainerAction}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {buttonConfig.loadingText}
          </div>
        ) : (
          buttonConfig.text
        )}
      </Button>
    );
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
  }

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
        ) : (
          renderSubmissionControls()
        )}
      </div>

      <div className="flex justify-between items-center">
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

          <h2 className="font-bold pb-4">
            {assignment?.docker_image_id
              ? `Image name: ${imageName}`
              : null}
          </h2>

          <div className="flex space-x-6">
            {renderContainerButton()}

            {/*
            <h2 className="font-bold pb-4">
              {socketPort ? (
                <>
                Socket port: <CopyTextBox text={socketPort.toString()} />
                </>
              ) : null}
            </h2>*/}

            <h2 className="font-bold pb-4">
              {sshPort ? (
                <>
                  SSH port: <CopyTextBox text={sshPort.toString()} />
                </>
              ) : null}
            </h2>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {assignment && (
          <ContainerPageTerminal
            isRunning={containerStatus === "running"}
            containerPort={socketPort}
          />
        )}
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
