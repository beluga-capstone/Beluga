"use client";

import { useEffect, useState } from "react";
import { Container, Image } from "@/types";
import { DEFAULT_CONTAINERS } from "@/constants";

const fetchContainers = async (): Promise<Container[]> => {
  try {
    const response = await fetch("http://localhost:5000/api/containers");
    if (!response.ok) {
      throw new Error("Failed to fetch containers");
    }
    const data = await response.json();
    return data.containers; 
  } catch (error) {
    console.error("Error fetching containers:", error);
    return DEFAULT_CONTAINERS;
  }
};

const saveContainer = async (newContainer: Container) => {
  try {
    const response = await fetch("http://localhost:5000/api/containers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContainer),
    });
    if (!response.ok) {
      throw new Error("Failed to add container");
    }
    const data = await response.json();
    return data.container; // Assuming the API returns the newly created container
  } catch (error) {
    console.error("Error saving container:", error);
  }
};

export const useContainers = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainers, setSelectedContainers] = useState<number[]>([]);

  const fetchContainers = async () => {
    try {
      const response = await fetch('http://localhost:5000/containers');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setContainers(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchContainers();
  }, []);

  const addContainer = async (
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

    // Save to the API
    const savedContainer = await saveContainer(newContainer);
    if (savedContainer) {
      setContainers((prev) => [...prev, savedContainer]);
    }
  };

  const deleteContainer = (id: number) => {
    // API delete logic here (if needed)
    const updatedContainers = containers.filter(
      (container) => container.id !== id
    );
    setContainers(updatedContainers);
    setSelectedContainers(
      selectedContainers.filter((selectedId) => selectedId !== id)
    );
  };

  const updateContainerStatus = (
    id: number,
    status: "running" | "paused" | "stopped"
  ) => {
    const updatedContainers = containers.map((container) =>
      container.id === id ? { ...container, status } : container
    );
    setContainers(updatedContainers);
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

