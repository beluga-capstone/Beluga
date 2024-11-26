"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, CheckSquare, Square, Play, StopCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
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
  const [processingContainers, setProcessingContainers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchContainerStatuses = async () => {
      try {
        const statusMap = new Map<string, string>();
        for (const container of containers) {
          const { status } = await checkContainerExists(container.docker_container_name);
          statusMap.set(container.docker_container_id, status);
        }
        setContainerStatus(statusMap);
      } catch (error) {
        toast.error("Failed to fetch container statuses");
        console.error("Error fetching container statuses:", error);
      }
    };

    if (containers.length > 0) {
      fetchContainerStatuses();
      const intervalId = setInterval(fetchContainerStatuses, 30000);
      return () => clearInterval(intervalId);
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
    setSelectedContainers(prev => 
      prev.length === containers.length ? [] : containers.map(c => c.docker_container_id)
    );
  };

  const handleStartStop = async (containerId: string, action: "start" | "stop") => {
    console.log(`Attempting to ${action} container ${containerId}`);
    
    if (processingContainers.has(containerId)) {
      toast.error("Operation already in progress for this container");
      return;
    }

    setProcessingContainers(prev => new Set(prev).add(containerId));
    
    try {
      const actionFn = action === "start" ? startContainer : stopContainer;
      await actionFn(containerId);
      
      // Update status immediately
      setContainerStatus(prev => new Map(prev).set(containerId, action === "start" ? "running" : "stopped"));
      toast.success(`Container ${action === "start" ? "started" : "stopped"} successfully`);
    } catch (err) {
      console.error(`Error ${action}ing container:`, err);
      toast.error(`Failed to ${action} container. Please try again.`);
    } finally {
      setProcessingContainers(prev => {
        const updated = new Set(prev);
        updated.delete(containerId);
        return updated;
      });
    }
  };

  const handleStartStopSelected = async (action: "start" | "stop") => {
    console.log(`handleStartStopSelected called with action: ${action}`);
    console.log('Selected containers:', selectedContainers);
    console.log('Current container statuses:', Object.fromEntries(containerStatus));

    if (selectedContainers.length === 0) {
      toast.error("No containers selected");
      return;
    }

    const validContainers = selectedContainers.filter(containerId => {
      const status = containerStatus.get(containerId);
      const isValid = (action === "start" && status === "stopped") || 
                     (action === "stop" && status === "running");
      console.log(`Container ${containerId} status: ${status}, valid for ${action}: ${isValid}`);
      return true;
    });

    console.log(`Valid containers for ${action}:`, validContainers);

    if (validContainers.length === 0) {
      toast.error(`No containers available to ${action}`);
      return;
    }

    const promises = validContainers.map(containerId => handleStartStop(containerId, action));
    
    try {
      await Promise.all(promises);
      toast.success(`Successfully ${action}ed ${validContainers.length} containers`);
    } catch (err) {
      console.error(`Error during batch ${action}:`, err);
      toast.error(`Some containers failed to ${action}. Check the status of individual containers.`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading containers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <AlertCircle className="h-8 w-8 mr-2" />
        <span>Error: {error}</span>
      </div>
    );
  }

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

      <h1 className="font-bold text-4xl mb-6">Containers</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <Link href="containers/new">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
              <Plus className="mr-2" />
              Create container
            </Button>
          </Link>
          
          {selectedContainers.length > 0 && (
            <div className="flex space-x-2">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
                onClick={() => handleStartStopSelected("start")}
              >
                <Play className="mr-2" />
                Start Selected ({selectedContainers.length})
              </Button>
              
              <Button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
                onClick={() => handleStartStopSelected("stop")}
              >
                <StopCircle className="mr-2" />
                Stop Selected ({selectedContainers.length})
              </Button>
              
              <Button
                className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded flex items-center"
                onClick={() => {
                  selectedContainers.forEach(id => deleteContainer(id));
                  setSelectedContainers([]);
                }}
                disabled={isDeletingContainer}
              >
                <Trash2 className="mr-2" />
                {isDeletingContainer ? "Deleting..." : `Delete Selected (${selectedContainers.length})`}
              </Button>
            </div>
          )}
        </div>
      </div>

      <br/>
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

      <div className="space-y-4">
        {containers.map(container => {
          const status = containerStatus.get(container.docker_container_id) || "stopped";
          const isProcessing = processingContainers.has(container.docker_container_id);
          
          return (
            <ContainerItem
              key={container.docker_container_id}
              container={container}
              onToggleSelect={handleToggleSelect}
              isSelected={selectedContainers.includes(container.docker_container_id)}
              containerStatus={status}
            >
              <div className="flex space-x-4">
                <Button
                  className={`px-4 py-3 rounded-md flex items-center justify-center transition-all ${
                    status === "running"
                      ? "focus:ring-red-500"
                      : "focus:ring-green-500"
                  } focus:outline-none focus:ring-2`}
                  onClick={() => handleStartStop(
                    container.docker_container_id,
                    status === "running" ? "stop" : "start"
                  )}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : status === "running" ? (
                    <StopCircle className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </ContainerItem>
          );
        })}
      </div>
    </div>
  );
};

export default Containers;
