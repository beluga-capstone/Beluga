"use client";

import { useEffect, useState } from "react";
import { Container, Image } from "@/types";
import { DEFAULT_CONTAINERS } from "@/constants";

const loadContainersFromStorage = (): Container[] => {
  const data = localStorage.getItem("containers");
  return data ? JSON.parse(data) : DEFAULT_CONTAINERS;
};

const saveContainersToStorage = (containers: Container[]) => {
  localStorage.setItem("containers", JSON.stringify(containers));
};

export const useContainers = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainers, setSelectedContainers] = useState<number[]>([]);

  useEffect(() => {
    const loadedContainers = loadContainersFromStorage();
    setContainers(loadedContainers);
  }, []);

  const addContainer = (
    name: string,
    image: Image,
    cpuCores: number,
    memoryGBs: number,
    storageGBs: number
  ) => {
    const newContainer: Container = {
      id: Date.now(),
      name: name,
      status: "stopped",
      launchTime: new Date().toLocaleString(),
      image: image,
      cpuCores: cpuCores,
      memoryGBs: memoryGBs,
      storageGBs: storageGBs,
    };
    
    console.log(newContainer["id"]);

    const updatedContainers = [...containers, newContainer];
    setContainers(updatedContainers);
    saveContainersToStorage(updatedContainers);
  };

  const deleteContainer = (id: number) => {
    const updatedContainers = containers.filter(
      (container) => container.id !== id
    );
    setContainers(updatedContainers);
    setSelectedContainers(
      selectedContainers.filter((selectedId) => selectedId !== id)
    );
    saveContainersToStorage(updatedContainers);
  };

  const updateContainerStatus = (
    id: number,
    status: "running" | "paused" | "stopped"
  ) => {
    const updatedContainers = containers.map((container) =>
      container.id === id ? { ...container, status } : container
    );
    setContainers(updatedContainers);
    saveContainersToStorage(updatedContainers);
  };

  const toggleSelectContainer = (id: number) => {
    setSelectedContainers((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const performBulkAction = (
    action: "running" | "paused" | "stopped" | "delete"
  ) => {
    let updatedContainers = containers;
    if (action === "delete") {
      updatedContainers = containers.filter(
        (container) => !selectedContainers.includes(container.id)
      );
      setSelectedContainers([]);
    } else {
      updatedContainers = containers.map((container) =>
        selectedContainers.includes(container.id)
          ? { ...container, status: action }
          : container
      );
    }
    setContainers(updatedContainers);
    saveContainersToStorage(updatedContainers);
  };

  return {
    containers,
    selectedContainers,
    addContainer,
    deleteContainer,
    updateContainerStatus,
    toggleSelectContainer,
    performBulkAction,
  };
};
