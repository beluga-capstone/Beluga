import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import CopyTextBox from "@/components/CopyTextBox";
import { useContainers } from "@/hooks/useContainers";
import ContainerPageTerminal from "./ContainerPageTerminal";
import { useImageData } from "@/hooks/useImageData";
import Link from 'next/link';
import NoCopyTextBox from "./NoCopyTextBox";
import { useProfile } from "@/hooks/useProfile";

interface ContainerControlsProps {
  containerName: string | null;
  dockerImageId: string | null;
  description: string | null;
}

interface ContainerStatus {
  exists: boolean;
  appPort: number | null;
  sshPort: number | null;
  status: string;
}

const TerminalMaxxing = ({
  containerName = null,
  dockerImageId = null,
  description = null,
}: ContainerControlsProps) => {
  const router = useRouter();
  const [containerStatus, setContainerStatus] = useState<string>("none");
  const [isProcessing, setIsProcessing] = useState(false);
  const [socketPort, setSocketPort] = useState<number | null>(null);
  const [sshPort, setSshPort] = useState<number | null>(null);
  const { checkContainerExists, runContainer, startContainer, stopContainer} = useContainers();
  const [imageName, setImageName] = useState<string |  null>(null);
  const {profile} = useProfile();

  const { imageData } = useImageData(dockerImageId ?? null);
  useEffect(() => {
    if (imageData?.tag?.[0]) {
      setImageName(imageData.tag[0]);
    }
  }, [imageData]);

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      if (!containerName) return;

      try {
        const status: ContainerStatus = await checkContainerExists(containerName);
        
        if (!isMounted) return;

        if (status.exists) {
          setContainerStatus(status.status === "running" ? "running" : "stopped");
          setSocketPort(status.appPort);
          setSshPort(status.sshPort);
        } else {
          setContainerStatus("none");
          setSocketPort(null);
          setSshPort(null);
        }
      } catch (error) {
        console.error("Error checking container status:", error);
        if (isMounted) {
          setContainerStatus("error");
          setSocketPort(null);
          setSshPort(null);
        }
      }
    };

    const intervalId = setInterval(checkStatus, 5000);
    checkStatus();

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [containerName]);

  const handleDownloadPrivateKey = () => {
    if (profile?.private_key) {
      const element = document.createElement("a");
      const file = new Blob([profile.private_key], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "id_rsa"; // You can customize the file name
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      document.body.removeChild(element);
    } else {
      alert("No private key available to download.");
    }
  };

  const handleContainerAction = async () => {
    if (isProcessing || !containerName || !dockerImageId) return;

    setIsProcessing(true);

    try {
      switch (containerStatus) {
        case "none": {
          const result = await runContainer(
            dockerImageId,
            containerName,
            description
          );
          if (result?.appPort && result?.sshPort) {
            setSocketPort(result.appPort);
            setSshPort(result.sshPort);
            setContainerStatus("running");
            showToast("Container created successfully");
          } else {
            throw new Error("Failed to create the container");
          }
          break;
        }

        case "stopped": {
          await startContainer(containerName);
          const status = await checkContainerExists(containerName);
          if (status.exists) {
            setContainerStatus("running");
            setSocketPort(status.appPort);
            setSshPort(status.sshPort);
            showToast("Container started successfully");
          }
          break;
        }

        case "running": {
          await stopContainer(containerName);
          setContainerStatus("stopped");
          setSocketPort(null);
          setSshPort(null);
          showToast("Container stopped successfully");
          break;
        }
      }
      router.refresh();
    } catch (error) {
      console.error("Container action failed:", error);
      showToast(`Failed to ${getActionText(containerStatus)}`, true);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionText = (status: string) => {
    switch (status) {
      case "none":
        return "create";
      case "running":
        return "stop";
      case "stopped":
        return "start";
      default:
        return "manage";
    }
  };

  const showToast = (message: string, isError = false) => {
    const toastFn = isError ? toast.error : toast.success;
    toastFn(message);
  };

  const getButtonConfig = () => {
    switch (containerStatus) {
      case "stopped":
        return {
          text: "Start Container",
          bgColor: "bg-green-500 rounded",
          loadingText: "Starting...",
        };
      case "running":
        return {
          text: "Stop Container",
          bgColor: "bg-red-500 rounded",
          loadingText: "Stopping...",
        };
      default:
        return {
          text: "Create Container",
          bgColor: "bg-blue-500 rounded",
          loadingText: "Creating...",
        };
    }
  };

  if (!dockerImageId) {
    return null;
  }

  const buttonConfig = getButtonConfig();

  return (
    <>
    <div className="">
      <h2 className="font-bold pb-4">
      <ul className="pb-4 flex space-x-1">
        <li key={dockerImageId}>
          <span>Using Image: </span>
          <Link href={`/machines/images/${dockerImageId}`}>
            <NoCopyTextBox overlayText={imageName??""} />
          </Link>
        </li>
      </ul>
      </h2>
      {dockerImageId && containerStatus === "running" && socketPort && (
        <ContainerPageTerminal 
          isRunning={containerStatus === "running"} 
          containerPort={socketPort} 
        />
      )}
      
      <div className="mt-4 flex space-x-6">
        <span>{description}</span>
        <div className="flex items-center">
          <Button
            className={`${buttonConfig.bgColor} px-4 py-2 mb-4`}
            onClick={handleContainerAction}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {buttonConfig.loadingText}
              </div>
            ) : (
              buttonConfig.text
            )}
          </Button>
        </div>
        
        {sshPort && (
          <h2 className="font-bold pb-4 flex items-center">
            <CopyTextBox overlayText={`SSH Port`} copyText={sshPort.toString()} />
          </h2>
        )}

        <h2 onClick={() => handleDownloadPrivateKey()} className="font-bold pb-4 flex items-center">
          <NoCopyTextBox overlayText={`Download Private Key`} />
        </h2>
      </div>
    </div>
    </>
  );
};

export default TerminalMaxxing;
