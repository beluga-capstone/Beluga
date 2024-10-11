import React from 'react';
import Button from '@/components/Button';

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedCount, onDelete }) => (
  <div className="space-x-2">
    <Button
      onClick={onDelete}
      className="bg-red-700 text-white px-4 py-2 rounded"
      disabled={selectedCount === 0}
    >
      Delete Selected
    </Button>
  </div>
);

export default BulkActions;
