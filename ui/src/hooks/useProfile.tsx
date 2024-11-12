import { ROLES } from "@/constants";
import { Profile } from "@/types";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // gets the user data
  const getProfile = async() => {
    const response = await fetch('http://localhost:5000/users/profile', {
      cache: 'no-store',
      credentials: "include"
    });
    const data = await response.json();

    const profile = {
      firstName: data['first_name'],
      lastName: data['last_name'],
      middleName: data['middle_name'],
      username:data['username'],
      email: data['email'],
      role_id: data['role_id'],
      user_id:data['user_id'],
      created_at:data['created_at'],
      updated_at:data['updated_at']
    } 

    setProfile(profile);
  }

  useEffect(() => {
    getProfile();
  }, []);

  const updateProfile = (
    profile: Profile
  ) => {
    const updatedProfile = {
      ...profile,
    };
    setProfile(updatedProfile);
  };

  return {
    profile,
    updateProfile,
  };
};
