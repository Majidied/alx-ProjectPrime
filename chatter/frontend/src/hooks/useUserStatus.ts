import { useState, useEffect } from 'react';
import { getUserStatus } from '../utils/User';
import socket from '../utils/socket';

/**
 * Custom hook to manage and track the online status of a specific user.
 *
 * @param contactId - The unique identifier of the contact whose online status is being tracked.
 * @returns A boolean value indicating whether the user is online (`true`) or offline (`false`).
 */
export const useUserStatus = (contactId: string) => {
  // State to hold the online status of the user
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is still mounted
    const abortController = new AbortController(); // Create an AbortController instance to manage async operations

    /**
     * Function to check the initial online status of the user from the server.
     */
    const checkUserStatus = async () => {
      try {
        const onlineStatus = await getUserStatus(contactId);
        if (isMounted) setIsOnline(onlineStatus); // Update the online status if the component is still mounted
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error fetching user status:', error);
        }
      }
    };

    // Check the initial online status when the component mounts
    checkUserStatus();

    /**
     * Event handler for user status changes received via the socket.
     * Updates the online status based on the received data.
     *
     * @param userId - The ID of the user whose status has changed.
     * @param status - The new online status of the user (`true` for online, `false` for offline).
     */
    const handleUserStatusChange = ({ userId, status }: { userId: string; status: boolean }) => {
      if (isMounted && userId === contactId) {
        setIsOnline(status); // Update the online status if the user ID matches and the component is still mounted
      }
    };

    // Subscribe to user status changes via the socket
    socket.on('userOnline', (data) => handleUserStatusChange({ ...data, status: true }));
    socket.on('userOffline', (data) => handleUserStatusChange({ ...data, status: false }));

    // Cleanup function to run when the component unmounts
    return () => {
      isMounted = false; // Mark the component as unmounted
      abortController.abort(); // Cancel any ongoing async operations
      socket.off('userOnline', handleUserStatusChange); // Unsubscribe from the userOnline event
      socket.off('userOffline', handleUserStatusChange); // Unsubscribe from the userOffline event
    };
  }, [contactId]);

  // Return the current online status of the user
  return isOnline;
};
