"use client";

import React, { useEffect, useState } from "react";
import { useImageData } from "@/hooks/useImageData";
import { useImages } from "@/hooks/useImages";
import ImageAssignmentList from "@/components/ImageAssignmentList";

export default function ImageDetailsPage({ params }: { params: { id: string } }) {
  const { getAssignmentsForImage } = useImages();
  const [assignments, setAssignments] = useState<{ assignment_id: string; title: string }[] | null>(null);

  const dockerImageId = params.id;

  const { imageData, loading, error } = useImageData(dockerImageId || "");

  useEffect(() => {
    const startup = async () => {
      if (dockerImageId) {
        const fetchedAssignments = await getAssignmentsForImage(dockerImageId);
        setAssignments(fetchedAssignments);
      }
    };
    startup();
  }, [dockerImageId, getAssignmentsForImage]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">{imageData?.tag[0]}</h1>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-row">
          <ImageAssignmentList assignments={assignments} /> {/* Using the new AssignmentsList component */}
          <h2 className="font-bold pb-4">
            Packages Chosen: {imageData?.packages || "None"}
          </h2>
        </div>
      </div>
    </div>
  );
}

