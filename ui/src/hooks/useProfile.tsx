import { ROLES } from "@/constants";
import { Profile } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useProfile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null); // Add error state

  // Gets the user data
  const getProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/users/profile', {
        cache: 'no-store',
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      const profile = {
        firstName: data['first_name'],
        lastName: data['last_name'],
        middleName: data['middle_name'],
        username: data['username'],
        email: data['email'],
        role_id: data['role_id'],
        user_id: data['user_id'],
        created_at: data['created_at'],
        updated_at: data['updated_at'],
        private_key: data['private_key'],
      };

      setProfile(profile);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setProfile(null); // Ensure the profile is null on error
      router.push('/login');
      setError(err instanceof Error ? err.message : 'Unknown error'); // Set the error message
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return {
    profile,
    error, // Expose the error state
  };
};

