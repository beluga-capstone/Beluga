"use client";

import { useEffect, useState } from "react";
import { useContainers } from "@/hooks/useContainers";
import { Container } from "@/types";

import ContainerPageInfo from "@/components/ContainerPageInfo";

const ContainerPage = ({ params }: { params: { id: string } }) => {
    const { containers } = useContainers();
    const [container, setContainer] = useState<Container | null>(null);
    const [loading, setLoading] = useState(true); 
    const [notFound, setNotFound] = useState(false); 
    const containerId = parseInt(params.id, 10);

    useEffect(() => {
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

                {/* display container component here */}

            </div>
        );
    }
};

export default ContainerPage;
