"use client";

import { useParams } from 'next/navigation';

const ContainerPage = () => {
  const params = useParams();

    //   todo: check if container exists
  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Container {params.id}</h1>
    </div>
  );
};

export default ContainerPage;