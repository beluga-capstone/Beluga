import {
  CheckCircleIcon,
  EllipsisVerticalIcon,
  PauseIcon,
  PlayIcon,
  PowerIcon,
  StopCircleIcon,
} from "@heroicons/react/24/solid";

interface Container {
  name: string;
  status: string;
  launchTime: string;
}

const containers: Container[] = [
  {
    name: "Assignment 2",
    status: "stopped",
    launchTime: "2024/09/10 12:00:00",
  },
  {
    name: "Assignment 1",
    status: "running",
    launchTime: "2024/08/30 12:00:00",
  },
];

export default function Containers() {
  return (
    <div>
      <h1 className="text-2xl p-4">Containers</h1>
      <table>
        <thead>
          <tr>
            <th className="px-4">Name</th>
            <th className="px-4">Status</th>
            <th className="px-4">Launch Time</th>
            <th className="px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((container, index) => (
            <tr key={index}>
              <td className="text-center px-4">{container.name}</td>
              <td className="text-center px-4">
                <div className="flex justify-center items-center">
                  {container.status === "running" ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                  <StopCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </td>
              <td className="text-center px-4">{container.launchTime}</td>
              <td className="text-center px-4">
                <div className="flex">
                  <div className="px-2">
                    {container.status === "running" ? (
                      <PauseIcon className="h-5 w-5 cursor-pointer" />
                    ) : (
                      <PlayIcon className="h-5 w-5 cursor-pointer" />
                    )}
                  </div>
                  <div className="px-2">
                    <PowerIcon className="h-5 w-5 cursor-pointer" />
                  </div>
                </div>
              </td>
              <td>
                <EllipsisVerticalIcon className="h-5 w-5 cursor-pointer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
