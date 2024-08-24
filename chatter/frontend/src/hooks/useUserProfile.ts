import { useState, useEffect } from 'react';
import { User, getUserProfile } from '../utils/User';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getUserProfile();
        setUserProfile(user);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return userProfile;
};
