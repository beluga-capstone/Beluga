// ContainerItem.tsx

import React from 'react';
import { Trash2, Pause, Play, Square, CheckSquare } from 'lucide-react';
import ContainerStatus from './ContainerStatus';
import { Container } from '@/types';
import IconButton from './IconButton';

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
      <p className="text-sm text-on-surface">Launch Time: {container.launchTime}</p>
    </div>
    <div className="flex items-center space-x-2">
      <IconButton onClick={() => onPause(container.id)} className="p-1 rounded" title="Pause" disabled={container.status == "paused" || container.status == "stopped"}>
        <Pause className="text-yellow-500" />
      </IconButton>
      <IconButton onClick={() => onRun(container.id)} className="p-1 rounded" title="Play" disabled={container.status == "running"}>
        <Play className="text-green-500" />
      </IconButton>
      <IconButton onClick={() => onStop(container.id)} className="p-1 rounded" title="Stop" disabled={container.status == "stopped"}>
        <Square className="text-red-500" />
      </IconButton>
      <IconButton onClick={() => onDelete(container.id)} className="p-1 rounded" title="Delete">
        <Trash2 className="text-red-500" />
      </IconButton>
    </div>
  </div>
);

export default ContainerItem;
