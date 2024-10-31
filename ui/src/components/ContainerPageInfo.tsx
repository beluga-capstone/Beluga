import { Container } from "@/types";

export default function ContainerPageInfo({ container }: { container: Container }) {
  return (
    <div>
      <ul>
        <li>Container ID: {container.id}</li>
        <li>Status: {container.status}</li>
        <li>Launch Time: {container.launchTime}</li>
        <li>CPU Cores: {container.cpuCores}</li>
        <li>Memory (GBs): {container.memoryGBs}</li>
        <li>Storage (GBs): {container.storageGBs}</li>
      </ul>
    </div>
  );
}
