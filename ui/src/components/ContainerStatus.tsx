// ContainerStatus.tsx

import React from 'react';
import { Pause, Play, Square } from 'lucide-react';

const ContainerStatus: React.FC<{ status: 'running' | 'paused' | 'stopped' }> = ({ status }) => {
  const statusIcons = {
    running: <Play className="text-green-500" />,
    paused: <Pause className="text-yellow-500" />,
    stopped: <Square className="text-red-500" />,
  };
  return statusIcons[status] || null;
};

export default ContainerStatus;
