import { useState, useEffect, useRef } from 'react';
import { getContactAvatar } from '../utils/User';

/**
 * Custom hook to fetch and manage the avatar URL for a given contact.
 *
 * @param contactId - The unique identifier of the contact whose avatar is being fetched.
 * @returns The URL of the contact's avatar as a string, or null if not available.
 */
export const useAvatar = (contactId: string) => {
  // State to hold the URL of the avatar image
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Ref to hold the previous avatar URL for cleanup purposes
  const previousAvatarUrl = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is still mounted

    /**
     * Function to fetch the avatar image as a blob, create an object URL, and set it in state.
     */
    const fetchAvatar = async () => {
      try {
        // Fetch the avatar file (assumed to be a Blob)
        const avatarFile = await getContactAvatar(contactId);
        const avatarBlob = avatarFile as unknown as Blob;

        // Create an object URL for the avatar image
        const avatarObjectUrl = URL.createObjectURL(avatarBlob);

        // If the component is still mounted, update the avatar URL state
        if (isMounted) {
          setAvatarUrl(avatarObjectUrl);
        }

        // Revoke the previous avatar URL to free up memory
        if (previousAvatarUrl.current) {
          URL.revokeObjectURL(previousAvatarUrl.current);
        }

        // Store the current avatar URL for later cleanup
        previousAvatarUrl.current = avatarObjectUrl;
      } catch (error) {
        // Log an error if the fetch fails and the component is still mounted
        if (isMounted) {
          console.error('Failed to fetch avatar:', error);
        }
      }
    };

    // Call the fetchAvatar function to initiate the fetch
    fetchAvatar();

    // Cleanup function to run when the component unmounts
    return () => {
      isMounted = false; // Mark the component as unmounted
      if (previousAvatarUrl.current) {
        URL.revokeObjectURL(previousAvatarUrl.current); // Revoke the last avatar URL to free up memory
      }
    };
  }, [contactId]);

  // Return the current avatar URL
  return avatarUrl;
};
