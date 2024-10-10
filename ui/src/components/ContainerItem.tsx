// ContainerItem.tsx

import React from 'react';
import { Trash2, Pause, Play, Square, CheckSquare } from 'lucide-react';
import ContainerStatus from './ContainerStatus';
import { Container } from '@/types';

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
}) => (
  <div className="flex items-center space-x-4 p-4 border rounded-lg mb-4">
    <button onClick={() => onToggleSelect(container.id)} className="focus:outline-none">
      {isSelected ? <CheckSquare className="text-blue-500" /> : <Square className="text-gray-400" />}
    </button>
    <div className="flex-grow">
      <h3 className="font-semibold">{container.name} - {container.status}</h3>
      <p className="text-sm text-gray-600">Launch Time: {container.launchTime}</p>
    </div>
    <div className="flex items-center space-x-2">
      <button onClick={() => onPause(container.id)} className="p-1 hover:bg-gray-100 rounded" title="Pause">
        <Pause className="text-yellow-500" />
      </button>
      <button onClick={() => onRun(container.id)} className="p-1 hover:bg-gray-100 rounded" title="Run">
        <Play className="text-green-500" />
      </button>
      <button onClick={() => onStop(container.id)} className="p-1 hover:bg-gray-100 rounded" title="Stop">
        <Square className="text-red-500" />
      </button>
      <button onClick={() => onDelete(container.id)} className="p-1 hover:bg-gray-100 rounded" title="Delete">
        <Trash2 className="text-red-500" />
      </button>
    </div>
  </div>
);

export default ContainerItem;
