import { useState, useEffect } from 'react';
import { getUserAvatar } from '../utils/User';

/**
 * Custom hook to fetch and manage the user's avatar.
 *
 * @returns The URL of the user's avatar as a string, or `null` if not available.
 */
export const useUserAvatar = () => {
  // State to hold the URL of the user's avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Function to fetch the user's avatar from the server.
     * Converts the fetched blob into a URL and updates the state.
     */
    const fetchUserAvatar = async () => {
      try {
        if (!avatarUrl) {
          const avatarBlob = await getUserAvatar();
          const url = URL.createObjectURL(avatarBlob);
          setAvatarUrl((prevUrl) => {
            if (prevUrl) {
              URL.revokeObjectURL(prevUrl);
            }
            return url;

          });
        }
      } catch (error) {
        // Log an error if fetching the avatar fails
        console.error('Failed to fetch user avatar:', error);
      }
    };

    // Fetch the avatar when the component mounts
    fetchUserAvatar();

    // Cleanup function to revoke the avatar URL when the component unmounts
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl); // Revoke the avatar URL to free up memory
      }
    };
  }, [avatarUrl]);

  // Return the current avatar URL
  return avatarUrl;
};
