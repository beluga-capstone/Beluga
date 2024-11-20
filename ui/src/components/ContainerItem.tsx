import React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pause, Play, Square, CheckSquare } from "lucide-react";
import IconButton from "./IconButton";
import ContainerStatus from "./ContainerStatus";

interface Container {
  id: number;
  name: string;
  status: string;
  // Add other container properties as needed
}

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
}) => {
  const router = useRouter();

  const handleContainerClick = () => {
    router.push(`/machines/containers/${container.id}`);
  };

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg mb-4 hover:bg-gray-50">
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
        <h3 
          className="font-semibold cursor-pointer hover:text-blue-600" 
          onClick={handleContainerClick}
        >
          {container.name}
        </h3>
        <ContainerStatus status={container.status} />
      </div>
      <div className="flex space-x-2">
        {container.status === 'running' ? (
          <>
            <IconButton
              icon={<Pause className="h-4 w-4" />}
              onClick={() => onPause(container.id)}
              tooltip="Pause"
            />
            <IconButton
              icon={<Square className="h-4 w-4" />}
              onClick={() => onStop(container.id)}
              tooltip="Stop"
            />
          </>
        ) : (
          <IconButton
            icon={<Play className="h-4 w-4" />}
            onClick={() => onRun(container.id)}
            tooltip="Run"
          />
        )}
        <IconButton
          icon={<Trash2 className="h-4 w-4" />}
          onClick={() => onDelete(container.id)}
          tooltip="Delete"
        />
      </div>
    </div>
  );
};

export default ContainerItem;

