"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Edit2 } from "lucide-react";
import Link from "next/link";

export default function ImageDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const imageId = searchParams.get("id");

    const [selectedImage, setSelectedImage] = useState<any | null>(null);

    useEffect(() => {
        if (imageId) {
            const storedImages = JSON.parse(localStorage.getItem("images") || "[]");
            const image = storedImages.find((img: any) => img.id === parseInt(imageId));
            setSelectedImage(image);
        }
    }, [imageId]);

    if (!selectedImage) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto p-4">

            <div className="mb-4 flex justify-between items-center">
                <h1 className="font-bold text-4xl mb-6">{selectedImage.title}</h1>
                <Link href={`/machines/images/edit?id=${selectedImage.id}`}>
                    <Edit2 size={24} />
                </Link>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex-row">
                    <h2 className="font-bold pb-4">
                        Courses Assigned to: {' '}
                        {selectedImage.courses.join(", ")}
                    </h2>
                    <h2 className="font-bold pb-4">
                        Packages Chosen: {' '}
                        {selectedImage.packages.join(", ")}
                    </h2>
                </div>
            </div>

            <div className="mt-4">
                <h2 className="font-bold pb-4">Dockerfile Content:</h2>
                <textarea
                    className="border rounded p-1 w-1/2 h-60 bg-surface"
                    value={selectedImage.dockerfileContent}
                    readOnly
                />
            </div>
        </div>
    );
}
