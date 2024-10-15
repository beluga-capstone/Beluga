"use client";

import React from "react";
import { Plus } from "lucide-react";
import ContainerItem from "@/components/ContainerItem";
import BulkActions from "@/components/ContainersBulkActions";
import Button from "@/components/Button";
import { useContainers } from "@/hooks/useContainers";
import Link from "next/link";

const Containers: React.FC = () => {
  const {
    containers,
    selectedContainers,
    addContainer,
    deleteContainer,
    updateContainerStatus,
    toggleSelectContainer,
    performBulkAction,
  } = useContainers();

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Containers</h1>
      <div className="mb-4 flex justify-between items-center">
        <Link href="/machines/containers/new">
          <Button
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus className="mr-2" /> Add Container
          </Button>
        </Link>

        <BulkActions
          selectedCount={selectedContainers.length}
          onPause={() => performBulkAction("paused")}
          onRun={() => performBulkAction("running")}
          onStop={() => performBulkAction("stopped")}
          onDelete={() => performBulkAction("delete")}
        />
      </div>

      {/* List the containers */}
      {containers.map((container) => (
        <ContainerItem
          key={container.id}
          container={container}
          onDelete={deleteContainer}
          onPause={() => updateContainerStatus(container.id, "paused")}
          onRun={() => updateContainerStatus(container.id, "running")}
          onStop={() => updateContainerStatus(container.id, "stopped")}
          onToggleSelect={toggleSelectContainer}
          isSelected={selectedContainers.includes(container.id)}
        />
      ))}
    </div>
  );
};

export default Containers;
