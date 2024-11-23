"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import { useImageData } from "@/hooks/useImageData";

export default function ImageDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dockerImageId = searchParams.get("id");

    // get the image data
    const { imageData, loading, error } = useImageData(dockerImageId);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="font-bold text-4xl mb-6">{imageData?.tag[0]}</h1>
                <Link href={`/machines/images/edit?id=${dockerImageId}`}>
                </Link>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex-row">
                    <h2 className="font-bold pb-4">
                        Courses Assigned to: {" "}
                        {imageData?.courses?.join(", ") || "None"}
                    </h2>
                    <h2 className="font-bold pb-4">
                        Packages Chosen: {" "}
                        {imageData?.packages?.join(", ") || "None"}
                    </h2>
                </div>
            </div>
        </div>
    );
}

