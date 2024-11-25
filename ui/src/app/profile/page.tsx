"use client";

import React from "react";
import { useProfile } from "@/hooks/useProfile";
import Button from "@/components/Button"; // Ensure you have the Button component imported
import { getRoleName } from "@/lib/utils";

const ProfilePage: React.FC = () => {
  const { profile } = useProfile();

  // Function to handle downloading the private key
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center">
        <h1 className="font-bold text-4xl">Profile</h1>
      </div>
      <h2 className="font-bold py-4">
        Name: {profile?.firstName} {profile?.middleName} {profile?.lastName}
      </h2>
      <h2 className="font-bold pb-4">Email: {profile?.email}</h2>
      <h2 className="font-bold pb-4">Role: {getRoleName(profile?.role_id)}</h2>

      {/* Download Private Key Button */}
      <div className="mt-4">
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleDownloadPrivateKey}
          disabled={!profile?.private_key}
        >
          Download Private Key
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
