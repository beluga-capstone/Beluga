"use client";

import { useEffect, useState } from "react";
import { useContainers } from "@/hooks/useContainers";
import { Container } from "@/types";
import { Play, StopCircle, Loader2 } from "lucide-react";
import TerminalMaxxing from "@/components/TerminalMaxxing";

const ContainerPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { containers, checkContainerExists, startContainer, stopContainer, isStoppingContainer, isDeletingContainer} = useContainers();
  const [container, setContainer] = useState<Container | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [containerId, setContainerId] = useState<string | null>(null);

  // type handling for containerId
  useEffect(() => {
    const fetchParams = async () => {
      const unwrappedParams = await params;
      const id = unwrappedParams.id;
      setContainerId(id);
    };
    fetchParams();
  }, [params]);

  useEffect(() => {
    if (containerId !== null) {
      const foundContainer = containers.find((c) => c.docker_container_id === containerId);

      if (foundContainer) {
        setContainer(foundContainer);
        setLoading(false);
        let retryCount = 0;

        const getContainer = async () => {
          // If no container is found initially, exit early
          if (!container) {
            console.log("No container found in state, containers: ", containers);
            const found = containers.find((c) => c.docker_container_id === containerId);
            if (found) {
              setContainer(found); // Update state if found
              setLoading(false);
            }
            return; // Exit function if no container is found
          }

          if (retryCount >= 10) {
            setLoading(false);
            setNotFound(true); // Mark as not found after 10 retries
            return;
          }
          const { docker_image_id, exists, appPort, sshPort, status } = await checkContainerExists(container.docker_container_name ?? "");

          if (exists) {
            console.log("Container exists,", appPort, docker_image_id, status);
            setImageId(docker_image_id);
          } else {
            retryCount++;
            console.log(`Retrying... Attempt ${retryCount}`);
            setTimeout(getContainer, 1000); // Retry after 1 second
          }
        };

        getContainer();
      }
    }
  }, [containerId, containers, container]);


  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="font-bold text-4xl mb-6">Loading...</h1>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="font-bold text-4xl mb-6">Container not found</h1>
      </div>
    );
  }

  if (container) {
    return (
      <div className="container mx-auto p-4">
      {(isStoppingContainer || isDeletingContainer) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="p-6 rounded-lg shadow-xl flex items-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <p>{isDeletingContainer ? "Deleting" : "Stopping"} container(s)...</p>
          </div>
        </div>
      )}
        <h1 className="font-bold text-4xl mb-6">Container "{container.docker_container_name}"</h1>
        <br />
        {/*<span>{status} {imageId}</span>

        <div className="mt-4 flex space-x-4">
          <Button
            className={`px-4 py-3 rounded-md flex items-center justify-center transition-all ${
              status === "running"
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
            } text-white focus:outline-none focus:ring-2`}
            onClick={() => handleStartStop(status === "running" ? "stop" : "start")}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : status === "running" ? (
              <StopCircle className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
            {status === "running" ? "" : ""}
          </Button>
        </div>
        
        <ContainerPageTerminal isRunning={status === "running"} containerPort={socketPort} />*/}
        <TerminalMaxxing 
          containerName={container?.docker_container_name}
          dockerImageId={imageId}
          description={"ex"}
        />
      </div>
    );
  }

  return null;
};

export default ContainerPage;
