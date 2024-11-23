import React from "react";
import { useRouter } from "next/navigation";
import { Square, CheckSquare } from "lucide-react";
import { Container } from "@/types";

interface ContainerItemProps {
  container: Container;
  onToggleSelect: (id: string) => void;
  isSelected: boolean;
  containerStatus: string;
  children?: React.ReactNode;
}

const ContainerItem: React.FC<ContainerItemProps> = ({
  container,
  onToggleSelect,
  isSelected,
  containerStatus,
  children,
}) => {
  const router = useRouter();

  const handleContainerClick = () => {
    router.push(`/machines/containers/${container.docker_container_id}`);
  };

  return (
    <div className="border p-4 rounded-md mb-4 flex justify-between items-start shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        {/* Checkbox for selecting the container */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(container.docker_container_id);
          }}
          className="flex-shrink-0"
        >
          {isSelected ? (
            <CheckSquare className="text-blue-500 w-6 h-6" />
          ) : (
            <Square className="text-gray-500 w-6 h-6" />
          )}
        </button>

        {/* Container details */}
        <div className="flex flex-col justify-center">
          <h2
            className="font-semibold text-lg cursor-pointer hover:text-blue-600"
            onClick={handleContainerClick}
          >
            {container.docker_container_name ||
              `Container ID: ${container.docker_container_id}`}
          </h2>
          {container.description && (
            <p className="text-gray-500 text-sm mt-1">{container.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Container status */}
        <div
          className={`text-sm font-semibold ${
            containerStatus === "Running"
              ? "text-green-500"
              : containerStatus === "Stopped"
              ? "text-red-500"
              : "text-yellow-500"
          }`}
        >
          {containerStatus}
        </div>

        {/* Additional children components */}
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
};

export default ContainerItem;

