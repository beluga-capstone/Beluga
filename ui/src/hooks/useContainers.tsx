import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';
import { Container } from '@/types';
import { useRouter } from 'next/navigation';

const API_BASE_URL = "http://localhost:5000";

interface ContainerHook {
  containers: Container[];
  isLoading: boolean;
  error: string | null;
  isContainerRunning: boolean;
  otherContainerPort: number | null;
  otherContainerId: string | null;
  isDeletingContainer: boolean;
  isRunningContainer: boolean;
  isStoppingContainer: boolean;
  runContainer: (
    imageId: string | null,
    containerName: string | null
  ) => Promise<{ container_id: string | null; container_port: number | null } | null>;
  stopContainer: (containerName: string | null) => Promise<void>;
  startContainer: (containerName: string | null) => Promise<void>;
  deleteContainer: (containerId: string | null) => Promise<void>;
  checkContainerExists: (
    containerName: string
  ) => Promise<{ docker_image_id:string; exists: boolean; port: number; status:string }>;
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
  const [otherContainerPort, setOtherContainerPort] = useState<number | null>(null);
  const [otherContainerId, setOtherContainerId] = useState<string | null>(null);
  const router = useRouter();

  const updateState = (partialState: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...partialState }));

  const handleFetch = async (url: string, options: RequestInit) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `Failed: ${response.statusText}`);
    }
    return response.json();
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const fetchContainers = async () => {
    try {
      const data = await handleFetch(`${API_BASE_URL}/containers`, { method: "GET" });
      setContainers(data);
    } catch (err) {
      updateState({ error: err instanceof Error ? err.message : "An error occurred" });
    } finally {
      updateState({ isLoading: false });
    }
  };

  const checkContainerExists = async (containerName: string) => {
    try {
      const data = await handleFetch(`${API_BASE_URL}/containers/${containerName}`, {
        method: "GET",
      });
      updateState({ isContainerRunning: true });
      return { docker_image_id:data.docker_image_id, exists: true, port: data.port, status: data.status };
    } catch {
      return { docker_image_id: "", exists: false, port: 0, status:"" };
    }
  };

  const runContainer = async (
    imageId: string | null,
    containerName: string | null
  ): Promise<{ container_id: string | null; container_port: number | null } | null> => {
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
        }),
      });
      setOtherContainerPort(data.port);
      setOtherContainerId(data.docker_container_id);
      updateState({ isContainerRunning: true });
      await fetchContainers();
      return { container_id: data.docker_container_id, container_port: data.port };
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
      setOtherContainerPort(null);
      setOtherContainerId(null);
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
    otherContainerPort,
    otherContainerId,
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

