import { useContainers } from "@/hooks/useContainers";
import { ToggleLeft, ToggleRight } from "lucide-react";

interface AssignmentFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  publishAt: string;
  setPublishAt: (value: string) => void;
  dueAt: string;
  setDueAt: (value: string) => void;
  lockAt: string;
  setLockAt: (value: string) => void;
  unlockAt: string;
  setUnlockAt: (value: string) => void;
  allowsLateSubmissions: boolean;
  setAllowsLateSubmissions: (value: boolean) => void;
  containerId: number;
  setContainerId: (value: number) => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  publishAt: publishAt,
  setPublishAt: setPublishAt,
  dueAt: dueAt,
  setDueAt: setDueAt,
  lockAt: lockAt,
  setLockAt: setLockAt,
  unlockAt: unlockAt,
  setUnlockAt: setUnlockAt,
  allowsLateSubmissions,
  setAllowsLateSubmissions,
  containerId,
  setContainerId,
}) => {
  const { containers } = useContainers();

  return (
    <>
      <h2>Assignment Name</h2>
      <div className="pt-2 pb-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="border rounded p-1 bg-surface"
          placeholder="Assignment name"
          aria-label="Assignment name"
        />
      </div>
      <h2>Description</h2>
      <div className="pt-2 pb-8">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-1 bg-surface w-3/4"
          placeholder="Description"
          aria-label="Description"
          rows={5}
        />
      </div>
      <h2>Unlock at:</h2>
      <div className="pt-2 pb-8">
        <input
          value={unlockAt}
          onChange={(e) => setUnlockAt(e.target.value)}
          type="date"
          className="border rounded p-1 bg-surface dark:[color-scheme:dark]"
          placeholder="Unlock at"
          aria-label="Unlock at"
        />
      </div>
      <h2>Publish at:</h2>
      <div className="pt-2 pb-8">
        <input
          value={publishAt}
          onChange={(e) => setPublishAt(e.target.value)}
          type="date"
          className="border rounded p-1 bg-surface dark:[color-scheme:dark]"
          placeholder="Release at"
          aria-label="Release at"
        />
      </div>
      <h2>Due at:</h2>
      <div className="pt-2 pb-8">
        <input
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          type="date"
          className="border rounded p-1 bg-surface dark:[color-scheme:dark]"
          placeholder="Due at"
          aria-label="Due at"
        />
      </div>
      <div className="flex items-center pb-8">
        {allowsLateSubmissions ? (
          <ToggleRight
            size={32}
            className="text-green-500"
            onClick={() => setAllowsLateSubmissions(false)}
          />
        ) : (
          <ToggleLeft
            size={32}
            className="text-red-500"
            onClick={() => setAllowsLateSubmissions(true)}
          />
        )}
        <h2 className="px-4">Allow late submissions</h2>
      </div>
      {allowsLateSubmissions && (
        <>
          <h2>Lock at:</h2>
          <div className="pt-2 pb-8">
            <input
              value={lockAt}
              onChange={(e) => setLockAt(e.target.value)}
              type="date"
              className="border rounded p-1 bg-surface dark:[color-scheme:dark]"
              placeholder="Lock at"
              aria-label="Lock at"
            />
          </div>
        </>
      )}
      <h2>Container</h2>
      <div className="pt-2 pb-8">
        <select
          title="Container"
          value={containerId}
          onChange={(e) => setContainerId(parseInt(e.target.value))}
          className="border rounded p-1 bg-surface"
        >
          <option value={-1}>Select a container</option>
          {containers.map((container) => (
            <option key={container.id} value={container.id}>
              {container.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default AssignmentForm;
