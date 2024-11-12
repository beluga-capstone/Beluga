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

  useEffect(() => {
    const loadedProfile = loadProfileFromStorage();
    if (loadedProfile) {
      setProfile(loadedProfile);
    } else {
      setProfile({
        firstName: "",
        lastName: "",
        email: "",
        role: ROLES.STUDENT,
      });
    }
  }, []);

  const updateProfile = (
    firstName: string,
    middleName: string | undefined,
    lastName: string,
    email: string,
    role: string
  ) => {
    const updatedProfile = {
      ...profile,
      firstName,
      middleName,
      lastName,
      email,
      role,
    };
    setProfile(updatedProfile);
    saveProfileToStorage(updatedProfile);
  };

  return {
    profile,
    updateProfile,
  };
};
