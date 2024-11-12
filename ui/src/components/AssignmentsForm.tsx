import { useContainers } from "@/hooks/useContainers";
import { ToggleLeft, ToggleRight } from "lucide-react";
import FormInput from "./FormInput";
import FormTextArea from "./FormTextArea";
import FormDateInput from "./FormDateInput";

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
      <FormInput title="Assignment Name" value={title} onChange={setTitle} />

      <FormTextArea
        title="Description"
        value={description}
        onChange={setDescription}
      />

      <FormDateInput
        title="Unlock at"
        value={unlockAt}
        onChange={setUnlockAt}
      />

      <FormDateInput
        title="Publish at"
        value={publishAt}
        onChange={setPublishAt}
      />

      <FormDateInput title="Due at" value={dueAt} onChange={setDueAt} />

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
        <FormDateInput title="Lock at" value={lockAt} onChange={setLockAt} />
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
