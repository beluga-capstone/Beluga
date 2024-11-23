"use client";

import { useEffect, useState } from "react";
import { useContainers } from "@/hooks/useContainers";
import { Container } from "@/types";
import { Play, StopCircle, Loader2 } from "lucide-react";
import Button from "@/components/Button";
import ContainerPageTerminal from "@/components/ContainerPageTerminal";
import { toast } from "sonner";

const ContainerPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { containers, checkContainerExists, startContainer, stopContainer } = useContainers();
  const [container, setContainer] = useState<Container | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [containerId, setContainerId] = useState<string | null>(null);
  const [containerPort, setContainerPort] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // type handling for containerId
  useEffect(() => {
    const fetchParams = async () => {
      const unwrappedParams = await params;
      const id = unwrappedParams.id;
      setContainerId(id);
    };
    fetchParams();
  }, [params]);

  useEffect(()=>{
    const startup = async() => {
      const {exists, port} = await checkContainerExists(container?.docker_container_name ?? "");
      if (exists) {
        setContainerPort(port);
      }
    };
    startup();

  },[]);

  useEffect(() => {
    if (containerId !== null) {
      const foundContainer = containers.find((c) => c.docker_container_id === containerId);

      if (foundContainer) {
        setContainer(foundContainer);
        setLoading(false);
        const getContainer = async () => {
          // Check if container exists
          const { docker_image_id, exists, port, status } = await checkContainerExists(container?.docker_container_name ?? "");
          if (exists) {
            //console.log("it exists,", port, docker_image_id, status);
            setContainerPort(port);
            setImageId(docker_image_id);
            setStatus(status);
          }
        };

        getContainer();
      } else {
        const timeout = setTimeout(() => {
          setLoading(false);
          setNotFound(true);
        }, 5000);

        return () => clearTimeout(timeout);
      }
    }
  }, [containerId, containers]);

  const handleStartStop = async (action: "start" | "stop") => {
    if (isProcessing || !containerId) return;

    setIsProcessing(true);
    try {
      const actionFn = action === "start" ? startContainer : stopContainer;
      await actionFn(containerId);
      const { exists, port} = await checkContainerExists(container?.docker_container_name ?? "");
      if (exists) {
        setContainerPort(port);
      }

      // Update status immediately
      setStatus(action === "start" ? "running" : "stopped");
      toast.success(`Container ${action === "start" ? "started" : "stopped"} successfully`);
    } catch (err) {
      console.error(`Error ${action}ing container:`, err);
      toast.error(`Failed to ${action} container. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

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
        <h1 className="font-bold text-4xl mb-6">Container "{container.docker_container_name}"</h1>
        <br />
        <span>{status} {imageId}</span>
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
            {status === "running" ? "Stop" : "Start"}
          </Button>
        </div>
        <br/>
        <ContainerPageTerminal isRunning={status === "running"} containerPort={containerPort} />
      </div>
    );
  }

  return null;
};

export default ContainerPage;

