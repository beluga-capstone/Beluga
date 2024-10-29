import { useContainers } from "@/hooks/useContainers";

interface AssignmentFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  releaseDate: string;
  setReleaseDate: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  containerId: number;
  setContainerId: (value: number) => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  releaseDate,
  setReleaseDate,
  dueDate,
  setDueDate,
  containerId,
  setContainerId,
}) => {
  const { containers } = useContainers();
  
  return (
    <>
      {" "}
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
      <h2>Release Date</h2>
      <div className="pt-2 pb-8">
        <input
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          type="date"
          className="border rounded p-1 bg-surface dark:[color-scheme:dark]"
          placeholder="Release Date"
          aria-label="Release Date"
        />
      </div>
      <h2>Due Date</h2>
      <div className="pt-2 pb-8">
        <input
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          type="date"
          className="border rounded p-1 bg-surface dark:[color-scheme:dark]"
          placeholder="Due Date"
          aria-label="Due Date"
        />
      </div>
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
