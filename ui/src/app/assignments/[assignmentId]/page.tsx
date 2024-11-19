"use client";

import Button from "@/components/Button";
import SubmissionZone from "@/components/SubmissionZone";
import { ROLES } from "@/constants";
import { useAssignments } from "@/hooks/useAssignments";
import { useProfile } from "@/hooks/useProfile";
import { ArrowUpFromLine, Edit2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ContainerPageTerminal from "@/components/ContainerPageTerminal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Assignment } from "@/types";

// Function to format the date
const format_date = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const AssignmentPage = ({ params }: { params: { assignmentId: string } }) => {
  const { profile } = useProfile();
  const { assignments } = useAssignments();
  const [isContainerRunning, setIsContainerRunning] = useState(false);
  const [containerPort, setContainerPort] = useState<number | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [containerName, setContainerName] = useState<string | null>(null);
  const router = useRouter();

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

  // get the assignment and check if the container is running on startup
  useEffect(() => {
    const { assignmentId } = params;  
    if (assignmentId) {
      const found = assignments.find(
        (assignment) =>
          assignment.assignment_id === params.assignmentId
      );
      setAssignment(found || null);
      setContainerName(`${assignment?.title}_con`)

      // todo, get the tag from the api
      // const imageName=`${assignment?.docker_image_id}`;

      // check if container exist
      if (assignment && containerName) {
        const check_exist_startup = async() =>{
          if (!containerName) return;
          let {exists, port}= await checkContainerExists(containerName);
          if (exists) {
            alert("Container already exists and is running.");
            setIsContainerRunning(true);
            setContainerPort(port);
          }
        };
        check_exist_startup();
        console.log("inside",assignment.title);
      }
    }
  }, [assignment, assignments]);


  const runContainer = async (imageId: string|null) => {
    if (!imageId) return;
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
        alert(`Container started successfully on port ${data.port}`);
      } else {
        alert(`Error starting container: ${data.error}`);
      }
    } catch (error) {
      console.error("Error running container:", error);
      alert("An error occurred while starting the container.");
    }
  };

  const stopContainer = async (containerName: string | null | undefined) => {
    try {
      const response = await fetch(`http://localhost:5000/containers/${containerName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsContainerRunning(false);
        setContainerPort(null);
        alert("Container stopped successfully.");
        router.refresh();
      } else {
        const data = await response.json();
        alert(`Error stopping container: ${data.error}`);
      }
    } catch (error) {
      console.error("Error stopping container:", error);
      alert("An error occurred while stopping the container.");
    }
  };

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
            {assignment?.due_at
              ? format_date(assignment.due_at.toISOString())
              : "not found"}
          </h2>
          <h2 className="font-bold pb-4">
            Available:{" "}
            {assignment?.publish_at
              ? format_date(assignment.publish_at.toISOString())
              : "not found"}
          </h2>

          {assignment?.description && (
            <h2 className="font-bold pb-4">Description:{" "}
              {assignment?.description.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </h2>
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
            >
              {isContainerRunning ? "Stop Container" : "Run Container"}
            </Button>
          ):null}
        </div>
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


