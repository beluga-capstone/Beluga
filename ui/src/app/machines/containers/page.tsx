"use client";
import React, { useState } from "react";
import { Plus, Trash2,Loader2 } from "lucide-react";
import ContainerItem from "@/components/ContainerItem";
import Button from "@/components/Button";
import { useContainers } from "@/hooks/useContainers";

const Containers: React.FC = () => {
  const {
    containers,
    isStoppingContainer,
    isLoading,
    error,
    stopContainer,
  } = useContainers();

  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);

  const handleToggleSelect = (id: string) => {
    setSelectedContainers(prev =>
      prev.includes(id)
        ? prev.filter(containerId => containerId !== id)
        : [...prev, id]
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderStoppingButton = () => {
    return (
      <Button
        className="bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
        disabled
      >
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Stopping...
        </div>
      </Button>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Loading Overlay */}
      {isStoppingContainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-500 p-6 rounded-lg shadow-xl flex items-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <p>Stopping container(s)...</p>
          </div>
        </div>
      )}

      <h1 className="font-bold text-4xl mb-6">Containers</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Container
          </Button>
          {selectedContainers.length > 0 && (
            <>
              {isStoppingContainer ? renderStoppingButton() : (
                <Button
                  className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                  onClick={()=> {
                    selectedContainers.forEach(id => stopContainer(id));
                    setSelectedContainers([]);
                  }}
                >
                  Stop Container
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {containers.map(container => (
          <ContainerItem
            key={container.docker_container_id}
            container={container}
            onToggleSelect={handleToggleSelect}
            isSelected={selectedContainers.includes(container.docker_container_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Containers;
