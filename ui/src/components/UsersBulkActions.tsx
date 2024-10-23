import Button from "./Button";

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => null;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedCount, onDelete }) =>
  selectedCount > 0 && (
    <div className="flex items-center">
      <span className="mr-4">{selectedCount} users selected</span>
      <div className="ml-auto">
        <Button
          onClick={onDelete}
          className="bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected
        </Button>
      </div>
    </div>
  );

export default BulkActions;
