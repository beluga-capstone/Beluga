"use client";

import { useEffect, useState } from "react";
import { useContainers } from "@/hooks/useContainers";
import { Container } from "@/types";
import ContainerPageInfo from "@/components/ContainerPageInfo";
import ContainerPageTerminal from "@/components/ContainerPageTerminal";

const ContainerPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { containers } = useContainers();
    const [container, setContainer] = useState<Container | null>(null);
    const [loading, setLoading] = useState(true); 
    const [notFound, setNotFound] = useState(false); 
    const [containerId, setContainerId] = useState<number | null>(null);

    // type handling for containerid
    useEffect(() => {
        const fetchParams = async () => {
            const unwrappedParams = await params;
            const id = parseInt(unwrappedParams.id, 10);
            setContainerId(id);
        };
        fetchParams();
    }, [params]);

    useEffect(() => {
        if (containerId !== null) {
            const foundContainer = containers.find((c) => c.id === containerId);

            if (foundContainer) {
                setContainer(foundContainer);
                setLoading(false);
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
                <h1 className="font-bold text-4xl mb-6">Container "{container.name}"</h1>
                <ContainerPageInfo container={container} />
                <br/>
                <ContainerPageTerminal imageId={containerId}/>
            </div>
        );
    }

    return null;
};

export default ContainerPage;
