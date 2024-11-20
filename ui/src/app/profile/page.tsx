"use client";

import { useProfile } from "@/hooks/useProfile";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import { ROLES } from "@/constants";

const ProfilePage: React.FC = () => {
  const { profile } = useProfile();

  // Helper function to get the role name from role_id
  const getRoleName = (roleId: number | undefined) => {
    if (!roleId) return "Unknown Role";
    const roleEntry = Object.entries(ROLES).find(([_, id]) => id === roleId);
    console.log(roleId);
    return roleEntry ? roleEntry[0] : "Unknown Role";
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center">
        <h1 className="font-bold text-4xl">Profile</h1>
        <Link href="/profile/edit" className="px-6">
          <Edit2 size={24} />
        </Link>
      </div>
      <h2 className="font-bold py-4">
        {profile?.firstName} {profile?.middleName} {profile?.lastName}
      </h2>
      <h2 className="font-bold pb-4">{profile?.email}</h2>
      <h2 className="font-bold pb-4">Role: {getRoleName(profile?.role_id)}</h2>
    </div>
  );
};

export default ProfilePage;

