"use client";

import { useEffect, useState } from "react";
import { useContainers } from "@/hooks/useContainers";
import { Container } from "@/types";
import ContainerPageTerminal from "@/components/ContainerPageTerminal";

const ContainerPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { containers,checkContainerExists } = useContainers();
    const [container, setContainer] = useState<Container | null>(null);
    const [loading, setLoading] = useState(true); 
    const [notFound, setNotFound] = useState(false); 
    const [status, setStatus] = useState<string | null>(null);
    const [imageId, setImageId] = useState<string | null> (null);
    const [containerId, setContainerId] = useState<string | null>(null);
    const [containerPort, setContainerPort] = useState<number | null>(null);

    // type handling for containerid
    useEffect(() => {
        const fetchParams = async () => {
            const unwrappedParams = await params;
            const id = unwrappedParams.id;
            setContainerId(id);
        };
        fetchParams();
    }, [params]);

    useEffect(() => {
        if (containerId !== null) {
            const foundContainer = containers.find((c) => c.docker_container_id === containerId);

            if (foundContainer) {
                setContainer(foundContainer);
                setLoading(false);
                const getContainer = async () => {
                // Check if container exists
                const { docker_image_id, exists, port, status} = await checkContainerExists(container?.docker_container_name??"");
                if (exists) {
                  console.log("it exists,",port,docker_image_id,status);
                  setContainerPort(port);
                  setImageId(docker_image_id);
                  setStatus(status);
                }
        };

        getContainer();

            } else {
                const timeout = setTimeout(() => {
                    setLoading(false);
                    setNotFound(true);
                }, 5000);

                return () => clearTimeout(timeout);
            }
        }
    }, [containerId, containers]);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="font-bold text-4xl mb-6">Loading...</h1>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="container mx-auto p-4">
               <h1 className="font-bold text-4xl mb-6">Container not found</h1>
            </div>
        );
    }

    if (container) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="font-bold text-4xl mb-6">Container "{container.docker_container_name}"</h1>
                <br/>
              <span>{status} {imageId}</span>
                <ContainerPageTerminal 
                  isRunning={true}
                  containerPort={containerPort}
                />
            </div>
        );
    }

    return null;
};

export default ContainerPage;

