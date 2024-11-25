"use client";

import React, { useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { ROLES } from "@/constants";
import Button from "@/components/Button"; // Ensure you have the Button component imported
import { useUsers } from "@/hooks/useUsers";

const ProfilePage: React.FC = () => {
  const { profile } = useProfile();
  const { users, insertUser } = useUsers();
  
  // TODO: Remove:
  // Adding profile to users for testing purposes
  useEffect(() => {
    if (profile) {
      insertUser({
        id: profile.user_id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        middleName: profile.middleName,
        email: profile.email,
        role_id: profile.role_id,
      });
      console.log(users);
    }
  }, [profile]);

  // Helper function to get the role name from role_id
  const getRoleName = (roleId: number | undefined) => {
    if (!roleId) return "Unknown Role";
    const roleEntry = Object.entries(ROLES).find(([_, id]) => id === roleId);
    return roleEntry ? roleEntry[0] : "Unknown Role";
  };

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
