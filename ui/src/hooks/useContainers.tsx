import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';
import { Container } from '@/types';
import { useRouter } from 'next/navigation';
import test from 'node:test';

const API_BASE_URL = "http://localhost:5000";

interface ContainerHook {
  containers: Container[];
  isLoading: boolean;
  error: string | null;
  isContainerRunning: boolean;
  isDeletingContainer: boolean;
  isRunningContainer: boolean;
  isStoppingContainer: boolean;
  runContainer: (
    imageId: string | null,
    containerName: string | null,
    description: string | null
  ) => Promise<{ container_id: string | null; appPort: number | null, sshPort: number | null } | null>;
  stopContainer: (containerName: string | null) => Promise<void>;
  startContainer: (containerName: string | null) => Promise<void>;
  deleteContainer: (containerId: string | null) => Promise<void>;
  checkContainerExists: (
    containerName: string
  ) => Promise<{ 
    docker_image_id: string;
    exists: boolean; 
    appPort: number | null;
    sshPort: number | null;
    status: string 
  }>;
}

export const useContainers = (): ContainerHook => {
  const { profile } = useProfile();
  const [containers, setContainers] = useState<Container[]>([]);
  const [state, setState] = useState({
    isLoading: true,
    isDeletingContainer: false,
    isStoppingContainer: false,
    isRunningContainer: false,
    isContainerRunning: false,
    error: null as string | null,
  });
  const router = useRouter();

  const updateState = (partialState: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...partialState }));

  const handleFetch = async (url: string, options: RequestInit) => {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `Failed: ${response.statusText}`);
    }
    return response.json();
  };
  

  useEffect(() => {
    if (profile?.user_id) {
      fetchContainers();
    }
  }, [profile?.user_id]);

  const fetchContainers = async () => {
    updateState({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (profile?.user_id) {
        queryParams.append('user_id', profile.user_id);
      }
      const url = `${API_BASE_URL}/containers/search`;
      const data = await handleFetch(url, { method: "GET" });
      setContainers(data);
    } catch (err) {
      updateState({ error: err instanceof Error ? err.message : "An error occurred" });
    } finally {
      updateState({ isLoading: false });
    }
  };

  const checkContainerExists = async (containerName: string): Promise<{ 
    docker_image_id: string;
    exists: boolean; 
    appPort: number | null;
    sshPort: number | null;
    status: string 
  }> => {
    try {
      const data = await handleFetch(`${API_BASE_URL}/containers/${containerName}`, {
        method: "GET",
      });
  
      updateState({ isContainerRunning: true });

      console.log(data.ports)

      // Extract ports from the response
      const ports = data.ports as { [key: string]: string };

      // For example, get the host port mapped to '5000/tcp'
      const appPort = ports['5000/tcp'] ? parseInt(ports['5000/tcp']) : null;
      const sshPort = ports['22/tcp'] ? parseInt(ports['22/tcp']) : null;

      return {
        docker_image_id: data.docker_image_id,
        exists: true,
        appPort: appPort,
        sshPort: sshPort,
        status: data.status
      };
    } catch {
      return { docker_image_id: "", exists: false, appPort: null, sshPort: null, status: "" };
    }
  };

  const runContainer = async (
    imageId: string | null,
    containerName: string | null,
    description: string | null,
  ): Promise<{ container_id: string | null; appPort: number | null, sshPort: number | null } | null>  => {
    if (!imageId || !containerName) return null;
    updateState({ isRunningContainer: true });

    try {
      const data = await handleFetch(`${API_BASE_URL}/containers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          container_name: containerName,
          docker_image_id: imageId,
          user_id: profile?.user_id,
          description: description,
        }),
      });
      const ports = data.ports as { [key: string]: string };

      // For example, get the host port mapped to '5000/tcp'
      const appPort = ports['5000/tcp'] ? parseInt(ports['5000/tcp']) : null;
      const sshPort = ports['22/tcp'] ? parseInt(ports['22/tcp']) : null;

      updateState({ isContainerRunning: true });
      await fetchContainers();
      return { container_id: data.docker_container_id, appPort: appPort, sshPort: sshPort };
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      updateState({ isRunningContainer: false });
    }
  };

  const stopContainer = async (containerName: string | null): Promise<void> => {
    if (!containerName) throw new Error("Container name is required");

    updateState({ isStoppingContainer: true });
    try {
      await handleFetch(`${API_BASE_URL}/containers/${containerName}/stop`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      await fetchContainers();  // Refresh the container list and statuses
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      updateState({ isStoppingContainer: false });
    }
  };

  const startContainer = async (containerName: string | null): Promise<void> => {
    if (!containerName) throw new Error("Container name is required");

    try {
      await handleFetch(`${API_BASE_URL}/containers/${containerName}/start`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      await fetchContainers();  // Optionally refresh containers after starting
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      router.refresh();
    }
  };

  const deleteContainer = async (containerId: string | null): Promise<void> => {
    if (!containerId) return;
    updateState({ isDeletingContainer: true });

    try {
      await handleFetch(`${API_BASE_URL}/containers/${containerId}`, { method: "DELETE" });
      updateState({ isContainerRunning: false });
      await fetchContainers();
    } catch (err) {
      console.error(err);
    } finally {
      updateState({ isDeletingContainer: false });
      router.refresh();
    }
  };

  return {
    containers,
    isLoading: state.isLoading,
    error: state.error,
    isContainerRunning: state.isContainerRunning,
    isDeletingContainer: state.isDeletingContainer,
    isRunningContainer: state.isRunningContainer,
    isStoppingContainer: state.isStoppingContainer,
    runContainer,
    stopContainer,
    startContainer,
    deleteContainer,
    checkContainerExists,
  };
};
