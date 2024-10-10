// ContainerItem.tsx

import React from "react";
import { Trash2, Pause, Play, Square, CheckSquare } from "lucide-react";
import ContainerStatus from "./ContainerStatus";
import { Container } from "@/types";
import IconButton from "./IconButton";

interface ContainerItemProps {
  container: Container;
  onDelete: (id: number) => void;
  onPause: (id: number) => void;
  onRun: (id: number) => void;
  onStop: (id: number) => void;
  onToggleSelect: (id: number) => void;
  isSelected: boolean;
}

const ContainerItem: React.FC<ContainerItemProps> = ({
  container,
  onDelete,
  onPause,
  onRun,
  onStop,
  onToggleSelect,
  isSelected,
}) => (
  <div className="flex items-center space-x-4 p-4 border rounded-lg mb-4">
    <button
      onClick={() => onToggleSelect(container.id)}
      className="focus:outline-none"
    >
      {isSelected ? (
        <CheckSquare className="text-blue-500" />
      ) : (
        <Square className="text-gray-400" />
      )}
    </button>
    <div className="flex-grow">
      <h3 className="font-semibold">
        {container.name}{" "}
        <span className={`px-1 py-0.25 rounded bg-on-surface text-light-surface`}>
          {container.status}
        </span>
      </h3>
      <p className="text-sm text-on-surface">
        Launch Time: {container.launchTime}
      </p>
    </div>
    <div className="flex items-center space-x-2">
      <IconButton
        title="Pause"
        onClick={() => onPause(container.id)}
        disabled={container.status == "paused" || container.status == "stopped"}
        icon={Pause}
        iconColor="yellow-500"
      />
      <IconButton
        title="Start"
        onClick={() => onRun(container.id)}
        disabled={container.status == "running"}
        icon={Play}
        iconColor="green-500"
      />
      <IconButton
        title="Stop"
        onClick={() => onStop(container.id)}
        disabled={container.status == "stopped"}
        icon={Square}
        iconColor="red-500"
      />
      <IconButton
        title="Delete"
        onClick={() => onDelete(container.id)}
        icon={Trash2}
        iconColor="red-500"
      />
    </div>
  </div>
);

export default ContainerItem;
