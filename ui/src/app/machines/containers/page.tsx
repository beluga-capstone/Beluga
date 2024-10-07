"use client";

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Container } from '@/types';
import { DEFAULT_CONTAINERS } from '@/constants';
import ContainerItem from '@/components/ContainerItem'

const loadContainersFromStorage = (): Container[] => {
  const data = localStorage.getItem('containers');
  return data ? JSON.parse(data) : DEFAULT_CONTAINERS;
};

const saveContainersToStorage = (containers: Container[]) => {
  localStorage.setItem('containers', JSON.stringify(containers));
};

const Containers: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainers, setSelectedContainers] = useState<number[]>([]);

  useEffect(() => {
    const loadedContainers = loadContainersFromStorage();
    setContainers(loadedContainers);
  }, []);

  const addContainer = () => {
    const newContainer: Container = {
      id: Date.now(),
      name: `Container ${containers.length + 1}`,
      status: 'stopped',
      launchTime: new Date().toLocaleString(),
    };
    const updatedContainers = [...containers, newContainer];
    setContainers(updatedContainers);
    saveContainersToStorage(updatedContainers);
  };

  const deleteContainer = (id: number) => {
    const updatedContainers = containers.filter(container => container.id !== id);
    setContainers(updatedContainers);
    setSelectedContainers(selectedContainers.filter(selectedId => selectedId !== id));
    saveContainersToStorage(updatedContainers);
  };

  const updateContainerStatus = (id: number, status: 'running' | 'paused' | 'stopped') => {
    const updatedContainers = containers.map(container =>
      container.id === id ? { ...container, status } : container
    );
    setContainers(updatedContainers);
    saveContainersToStorage(updatedContainers);
  };

  const toggleSelectContainer = (id: number) => {
    setSelectedContainers(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const performBulkAction = (action: 'running' | 'paused' | 'stopped' | 'delete') => {
    let updatedContainers = containers;
    if (action === 'delete') {
      updatedContainers = containers.filter(container => !selectedContainers.includes(container.id));
      setSelectedContainers([]);
    } else {
      updatedContainers = containers.map(container =>
        selectedContainers.includes(container.id)
          ? { ...container, status: action }
          : container
      );
    }
    setContainers(updatedContainers);
    saveContainersToStorage(updatedContainers);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Containers</h1>
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={addContainer}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="mr-2" /> Add Container
        </button>

        {/* bulk actions */}
        <div className="space-x-2">
          <button
            onClick={() => performBulkAction('paused')}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            disabled={selectedContainers.length === 0}
          >
            Pause Selected
          </button>
          <button
            onClick={() => performBulkAction('running')}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={selectedContainers.length === 0}
          >
            Run Selected
          </button>
          <button
            onClick={() => performBulkAction('stopped')}
            className="bg-red-500 text-white px-4 py-2 rounded"
            disabled={selectedContainers.length === 0}
          >
            Stop Selected
          </button>
          <button
            onClick={() => performBulkAction('delete')}
            className="bg-red-700 text-white px-4 py-2 rounded"
            disabled={selectedContainers.length === 0}
          >
            Delete Selected
          </button>
        </div>
      </div>

      {/* list the containers */}
      {containers.map(container => (
        <ContainerItem
          key={container.id}
          container={container}
          onDelete={deleteContainer}
          onPause={() => updateContainerStatus(container.id, 'paused')}
          onRun={() => updateContainerStatus(container.id, 'running')}
          onStop={() => updateContainerStatus(container.id, 'stopped')}
          onToggleSelect={toggleSelectContainer}
          isSelected={selectedContainers.includes(container.id)}
        />
      ))}
    </div>
  );
};

export default Containers;
