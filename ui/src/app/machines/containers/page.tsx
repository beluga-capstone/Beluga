"use client";

import React from "react";
import { Plus } from "lucide-react";
import ContainerItem from "@/components/ContainerItem";
import Button from "@/components/Button";
import { useContainers } from "@/hooks/useContainers";

const Containers: React.FC = () => {
  const {
  } = useContainers();

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Containers</h1>
      <div className="mb-4 flex justify-between items-center">

      </div>

      {/* List the containers */}
    </div>
  );
};

export default Containers;
