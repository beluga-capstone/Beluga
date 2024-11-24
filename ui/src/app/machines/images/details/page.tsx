"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useImageData } from "@/hooks/useImageData";
import { useImages } from "@/hooks/useImages";

export default function ImageDetailsPage() {
  const { getAssignmentsForImage } = useImages();
  const [assignments, setAssignments] = useState<{ assignment_id: string, title: string }[] | null>(null);
  const searchParams = useSearchParams();
  const dockerImageId = searchParams.get("id");

  const { imageData, loading, error } = useImageData(dockerImageId);

  useEffect(() => {
    const startup = async () => {
      if (dockerImageId) {
        const fetchedAssignments = await getAssignmentsForImage(dockerImageId);
        setAssignments(fetchedAssignments);
      }
    };
    startup();
  }, [dockerImageId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="font-bold text-4xl mb-6">{imageData?.tag[0]}</h1>
        <Link href={`/machines/images/edit?id=${dockerImageId}`} />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-row">
          <h2 className="font-bold pb-4">Assignments assigned to this image:</h2>
          {assignments ? (
            <ul className="pb-4">
              {assignments.map((assignment) => (
                <li key={assignment.assignment_id}>
                  <Link href={`/assignment/${assignment.assignment_id}`}>
                    {assignment.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No assignments available.</p>
          )}
          <h2 className="font-bold pb-4">
            Packages Chosen: {imageData?.packages || "None"}
          </h2>
        </div>
      </div>
    </div>
  );
}

