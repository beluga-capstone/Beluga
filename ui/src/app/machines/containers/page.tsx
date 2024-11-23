"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, CheckSquare, Square, Play, StopCircle } from "lucide-react";
import ContainerItem from "@/components/ContainerItem";
import Button from "@/components/Button";
import { useContainers } from "@/hooks/useContainers";
import Link from "next/link";

const Containers: React.FC = () => {
  const {
    containers,
    isStoppingContainer,
    isDeletingContainer,
    isLoading,
    error,
    deleteContainer,
    checkContainerExists,
    stopContainer,
    startContainer,
  } = useContainers();
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);
  const [containerStatus, setContainerStatus] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const fetchContainerStatuses = async () => {
      const statusMap = new Map<string, string>();
      for (const container of containers) {
        const { exists, port, status } = await checkContainerExists(container.docker_container_name);
        statusMap.set(container.docker_container_id, status);
      }
      setContainerStatus(statusMap);
    };

    if (containers.length > 0) {
      fetchContainerStatuses();
    }
  }, [containers]);

  const handleToggleSelect = (id: string) => {
    setSelectedContainers(prev =>
      prev.includes(id)
        ? prev.filter(containerId => containerId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedContainers.length === containers.length) {
      setSelectedContainers([]);
    } else {
      setSelectedContainers(containers.map(container => container.docker_container_id));
    }
  };

  const handleStartStop = async (containerId: string, action: "start" | "stop") => {
    try {
      if (action === "start") {
        await startContainer(containerId);
        setContainerStatus(prevStatus => new Map(prevStatus).set(containerId, "running"));
      } else {
        await stopContainer(containerId);
        setContainerStatus(prevStatus => new Map(prevStatus).set(containerId, "stopped"));
      }
    } catch (err) {
      console.error("Error managing container:", err);
    }
  };

  const handleStartStopSelected = async (action: "start" | "stop") => {
    for (const containerId of selectedContainers) {
      const status = containerStatus.get(containerId);
      if ((action === "start" && status === "running") || (action === "stop" && status === "stopped")) {
        continue; // Skip if the action is invalid (trying to start a running container or stop a stopped container)
      }
      await handleStartStop(containerId, action);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderDeletingButton = () => {
    return (
      <Button
        className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
        disabled
      >
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deleting...
        </div>
      </Button>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {isStoppingContainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-500 p-6 rounded-lg shadow-xl flex items-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <p>Stopping container(s)...</p>
          </div>
        </div>
      )}
      {isDeletingContainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-500 p-6 rounded-lg shadow-xl flex items-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <p>Deleting container(s)...</p>
          </div>
        </div>
      )}
      <h1 className="font-bold text-4xl mb-6">Containers</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <Link href="containers/new">
            <Button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create container
            </Button>
          </Link>
          {selectedContainers.length > 0 && (
            <>
              <div className="flex space-x-2">
                <Button
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => handleStartStopSelected("start")}
                >
                  Start Selected
                </Button>
                <Button
                  className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => handleStartStopSelected("stop")}
                >
                  Stop Selected
                </Button>
              </div>
              {isDeletingContainer ? renderDeletingButton() : (
                <Button
                  className="bg-red-700 text-white px-4 py-2 rounded flex items-center"
                  onClick={() => {
                    selectedContainers.forEach(id => deleteContainer(id));
                    setSelectedContainers([]);
                  }}
                >
                  Delete Container(s)
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div>
        {containers.length > 0 && (
          <Button
            className="mb-4"
            onClick={handleSelectAll}
          >
            {selectedContainers.length === containers.length ? (
              <div className="flex items-center">
                <CheckSquare className="mr-2 text-blue-500" /> Deselect All
              </div>
            ) : (
              <div className="flex items-center">
                <Square className="mr-2 text-gray-500" /> Select All
              </div>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {containers.map(container => {
          const status = containerStatus.get(container.docker_container_id) || "stopped";
          return (
            <ContainerItem
              key={container.docker_container_id}
              container={container}
              onToggleSelect={handleToggleSelect}
              isSelected={selectedContainers.includes(container.docker_container_id)}
              containerStatus={status}
            >
              <div className="flex space-x-4">
                {status === "running" ? (
                  <Button
                    className="bg-red-600 text-white px-4 py-3 rounded-md flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    onClick={() => handleStartStop(container.docker_container_id, "stop")}
                  >
                    <StopCircle className="h-6 w-6" />
                  </Button>
                ) : (
                  <Button
                    className="bg-green-600 text-white px-4 py-3 rounded-md flex items-center justify-center hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    onClick={() => handleStartStop(container.docker_container_id, "start")}
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                )}
              </div>
            </ContainerItem>
          );
        })}
      </div>
    </div>
  );
};

export default Containers;

