import React from "react";
import Button from "@/components/Button";

interface BulkActionsProps {
  selectedCount: number;
  onPause: () => void;
  onRun: () => void;
  onStop: () => void;
  onDelete: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onPause,
  onRun,
  onStop,
  onDelete,
}) =>
  selectedCount > 0 ? (
    <div className="space-x-2">
      <Button
        onClick={onPause}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
        disabled={selectedCount === 0}
      >
        Pause Selected
      </Button>
      <Button
        onClick={onRun}
        className="bg-green-500 text-white px-4 py-2 rounded"
        disabled={selectedCount === 0}
      >
        Run Selected
      </Button>
      <Button
        onClick={onStop}
        className="bg-red-500 text-white px-4 py-2 rounded"
        disabled={selectedCount === 0}
      >
        Stop Selected
      </Button>
      <Button
        onClick={onDelete}
        className="bg-red-700 text-white px-4 py-2 rounded"
        disabled={selectedCount === 0}
      >
        Delete Selected
      </Button>
    </div>
  ) : null;

export default BulkActions;
