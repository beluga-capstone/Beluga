import React from "react";
import { useRouter } from "next/navigation";
import { Square, CheckSquare } from "lucide-react";
import IconButton from "./IconButton";
import { Container } from "@/types";

interface ContainerItemProps {
  container: Container;
  onToggleSelect: (id: string) => void;
  isSelected: boolean;
}

const ContainerItem: React.FC<ContainerItemProps> = ({
  container,
  onToggleSelect,
  isSelected,
}) => {
  const router = useRouter();

  const handleContainerClick = () => {
    router.push(`/machines/containers/${container.docker_container_id}`);
  };

  return (
    <div className="border p-4 rounded mb-4 flex justify-between items-center">
      <div className="flex items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(container.docker_container_id);
          }}
          className="mr-4"
        >
          {isSelected ? (
            <CheckSquare className="text-blue-500" />
          ) : (
            <Square className="text-gray-500" />
          )}
        </button>

        <div>
          <h2
            className="font-bold flex items-center cursor-pointer hover:text-blue-600"
            onClick={handleContainerClick}
          >
            {container.docker_container_name || `Container ID: ${container.docker_container_id}`}
          </h2>
          {container.description && (
            <p className="text-gray-500">{container.description}</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default ContainerItem;

