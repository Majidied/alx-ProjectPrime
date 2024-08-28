import { useState, useEffect } from 'react';
import { User, getUserProfile } from '../utils/User';

/**
 * Custom hook to fetch and manage the user's profile.
 *
 * @returns The user's profile as a `User` object, or `null` if not available or an error occurs.
 */
export const useUserProfile = () => {
  // State to hold the user's profile data
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    /**
     * Function to fetch the user's profile from the server.
     * Updates the state with the fetched user profile.
     */
    const fetchUserProfile = async () => {
      try {
        // Fetch the user's profile
        const user = await getUserProfile();
        // Update the userProfile state with the fetched data
        setUserProfile(user);
      } catch (error) {
        // Log an error if fetching the user profile fails
        console.error('Failed to fetch user profile:', error);
      }
    };

    // Fetch the user profile when the component mounts
    fetchUserProfile();
  }, []); // Empty dependency array ensures this effect runs only once

  // Return the current user profile
  return userProfile;
};
