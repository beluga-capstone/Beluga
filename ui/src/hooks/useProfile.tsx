import { ROLES } from "@/constants";
import { Profile } from "@/types";
import { useEffect, useState } from "react";

const loadProfileFromStorage = (): Profile | null => {
  const data = localStorage.getItem("profile");
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
};

const saveProfileToStorage = (profile: Profile) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // gets the user data
  const getProfile = async() => {
    const response = await fetch('http://localhost:5000/users/profile', {
      cache: 'no-store',
      credentials: "include"
    });
    const data = await response.json();

    setProfile({
      firstName: data['first_name'],
      lastName: data['last_name'],
      middleName: data['middle_name'],
      username:data['username'],
      email: data['email'],
      role_id: data['role_id'],
      user_id:data['user_id'],
      created_at:data['created_at'],
      updated_at:data['updated_at']
    });
  }

  useEffect(() => {
    const loadedProfile = loadProfileFromStorage();
    if (loadedProfile) {
      setProfile(loadedProfile);
    } else {
      getProfile();
    }
  }, []);


  // const updateProfile = (
  //   firstName: string,
  //   middleName: string | undefined,
  //   lastName: string,
  //   email: string,
  //   role: string
  // ) => {
  //   const updatedProfile = {
  //     ...profile,
  //     firstName,
  //     middleName,
  //     lastName,
  //     email,
  //     role,
  //   };
  //   setProfile(updatedProfile);
  //   saveProfileToStorage(updatedProfile);
  // };

  return {
    profile,
    // updateProfile,
  };
};
