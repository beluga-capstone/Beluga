"use client";

import { useProfile } from "@/hooks/useProfile";
import { Edit2 } from "lucide-react";
import Link from "next/link";

const ProfilePage: React.FC = () => {
  const { profile } = useProfile();
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
      <h2 className="font-bold pb-4">Role: {profile?.role}</h2>
    </div>
  );
};

export default ProfilePage;
