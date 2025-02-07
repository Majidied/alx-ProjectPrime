import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserStatus } from '../api/userApi';
import socket from '../utils/socket';
import { useEffect } from 'react';

/**
 * Custom hook to manage and track the online status of a specific user.
 *
 * @param contactId - The unique identifier of the contact whose online status is being tracked.
 * @returns A boolean value indicating whether the user is online (`true`) or offline (`false`).
 */
export const useUserStatus = (contactId: string) => {
  const queryClient = useQueryClient();

  // Fetch the initial online status using React Query
  const { data: isOnline = false } = useQuery<boolean, Error>({
    queryKey: ['userStatus', contactId],
    queryFn: () => getUserStatus(contactId),
    enabled: !!contactId,
  });

  useEffect(() => {
    /**
     * Event handler for user status changes received via the socket.
     * Updates the online status based on the received data.
     *
     * @param userId - The ID of the user whose status has changed.
     * @param status - The new online status of the user (`true` for online, `false` for offline).
     */
    const handleUserStatusChange = ({ userId, status }: { userId: string; status: boolean }) => {
      if (userId === contactId) {
        queryClient.setQueryData(['userStatus', contactId], status);
      }
    };

    // Subscribe to user status changes via the socket
    socket.on('userOnline', (data) => handleUserStatusChange({ ...data, status: true }));
    socket.on('userOffline', (data) => handleUserStatusChange({ ...data, status: false }));

    // Cleanup function to run when the component unmounts
    return () => {
      socket.off('userOnline', handleUserStatusChange); // Unsubscribe from the userOnline event
      socket.off('userOffline', handleUserStatusChange); // Unsubscribe from the userOffline event
    };
  }, [contactId, queryClient]);

  // Return the current online status of the user
  return isOnline;
};