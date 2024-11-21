import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';
import { Container } from '@/types';
import { useRouter } from 'next/navigation';

interface ContainerHook {
  containers: Container[];
  isLoading: boolean;
  error: string | null;
  isContainerRunning: boolean;
  otherContainerPort: number | null;
  otherContainerId: string | null;
  isDeletingContainer: boolean;
  isRunningContainer: boolean;
  runContainer: (imageId: string | null, containerName: string | null) => Promise<{ container_id: string | null; container_port: number | null } | null>;
  deleteContainer: (containerName: string | null) => Promise<void>;
  checkContainerExists: (containerName: string) => Promise<{ exists: boolean; port: number }>;
}

export const useContainers = (): ContainerHook => {
  const { profile } = useProfile();
  const [containers, setContainers] = useState<Container[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContainerRunning, setIsContainerRunning] = useState(false);
  const [otherContainerPort, setContainerPort] = useState<number | null>(null);
  const [otherContainerId, setContainerId] = useState<string | null>(null);
  const [isDeletingContainer, setIsDeletingContainer] = useState(false);
  const [isRunningContainer, setIsRunningContainer] = useState(false);
  const router=useRouter();

  useEffect(() => {
    fetchContainers();
  }, []);

  const fetchContainers = async () => {
    try {
      const response = await fetch('http://localhost:5000/containers');
      if (!response.ok) throw new Error('Failed to fetch containers');
      const data = await response.json();
      setContainers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Existing functions from the original hook...
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

  const runContainer = async (
    imageId: string | null,
    containerName: string | null
  ): Promise<{ container_id: string | null; container_port: number | null } | null> => {
    if (!imageId || !containerName) return null;

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
        setContainerId(data.docker_container_id);
        await fetchContainers(); // Refresh the list
        return { container_id: data.docker_container_id, container_port: data.port };
      } else {
        console.error("Error starting container:", data.error);
        return { container_id: null, container_port: null };
      }
    } catch (error) {
      console.error("Error running container:", error);
      return { container_id: null, container_port: null };
    } finally {
      setIsRunningContainer(false);
    }
  };

  const deleteContainer = async (containerId: string | null) => {
    if (!containerId) return;
    
    setIsDeletingContainer(true);
    console.log("deleting",containerId);
    try {
      const response = await fetch(`http://localhost:5000/containers/${containerId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setIsContainerRunning(false);
        setContainerPort(null);
        await fetchContainers(); // Refresh the list
      } else {
        const data = await response.json();
        console.error(`Error deleting container: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting container:", error);
    } finally {
      setIsDeletingContainer(false);
      router.refresh();
    }
  };

  return {
    containers,
    isLoading,
    error,
    isContainerRunning,
    otherContainerPort,
    otherContainerId,
    isDeletingContainer,
    isRunningContainer,
    runContainer,
    deleteContainer,
    checkContainerExists,
  };
};
