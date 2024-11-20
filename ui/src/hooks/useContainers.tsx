import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';

interface ContainerHook {
  isContainerRunning: boolean;
  containerPort: number | null;
  isStoppingContainer: boolean;
  isRunningContainer: boolean;
  runContainer: (imageId: string | null, containerName: string | null) => Promise<void>;
  stopContainer: (containerName: string | null) => Promise<void>;
  checkContainerExists: (containerName: string) => Promise<{ exists: boolean; port: number }>;
}

export const useContainers = (): ContainerHook => {
  const { profile } = useProfile();
  const [isContainerRunning, setIsContainerRunning] = useState(false);
  const [containerPort, setContainerPort] = useState<number | null>(null);
  const [isStoppingContainer, setIsStoppingContainer] = useState(false);
  const [isRunningContainer, setIsRunningContainer] = useState(false);

  const checkContainerExists = async (containerName: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/containers/${containerName}`,
        { method: "GET" }
      );
      const data = await response.json();

      if (response.ok) {
        setIsContainerRunning(true);

        return { exists: true, port: data.port }; 
      } else {
        return { exists: false, port: 0 };  
      }
    } catch (error) {
      console.error("Error checking container existence:", error);
      return { exists: false, port: 0 };
    }
  };

  const runContainer = async (imageId: string | null, containerName: string | null) => {
    if (!imageId || !containerName) return;
    
    setIsRunningContainer(true);

    try {
      const response = await fetch("http://localhost:5000/containers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          container_name: containerName,
          docker_image_id: imageId,
          user_id: profile?.user_id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setContainerPort(data.port);
        setIsContainerRunning(true);
      } else {
        console.error("Error starting container:", data.error);
      }
    } catch (error) {
      console.error("Error running container:", error);
    } finally {
      setIsRunningContainer(false);
    }
  };

  const stopContainer = async (containerName: string | null) => {
    if (!containerName) return;
    
    setIsStoppingContainer(true);

    try {
      const response = await fetch(`http://localhost:5000/containers/${containerName}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setIsContainerRunning(false);
        setContainerPort(null);
      } else {
        const data = await response.json();
        console.error(`Error stopping container: ${data.error}`);
      }
    } catch (error) {
      console.error("Error stopping container:", error);
    } finally {
      setIsStoppingContainer(false);
    }
  };

  return {
    isContainerRunning,
    containerPort,
    isStoppingContainer,
    isRunningContainer,
    runContainer,
    stopContainer,
    checkContainerExists,
  };
};

