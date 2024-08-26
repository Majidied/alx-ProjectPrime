import { useState, useEffect } from 'react';
import { getUserStatus } from '../utils/User';
import socket from '../utils/socket';

export const useUserStatus = (contactId: string) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    let isMounted = true; // To check if the component is still mounted
    const abortController = new AbortController(); // Create an AbortController instance

    const checkUserStatus = async () => {
      try {
        const onlineStatus = await getUserStatus(contactId);
        if (isMounted) setIsOnline(onlineStatus);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error fetching user status:', error);
        }
      }
    };

    checkUserStatus();

    const handleUserStatusChange = ({ userId, status }: { userId: string; status: boolean }) => {
      if (isMounted && userId === contactId) {
        setIsOnline(status);
      }
    };

    socket.on('userOnline', (data) => handleUserStatusChange({ ...data, status: true }));
    socket.on('userOffline', (data) => handleUserStatusChange({ ...data, status: false }));

    return () => {
      isMounted = false; // Set isMounted to false when the component unmounts
      abortController.abort(); // Cancel any ongoing async operation
      socket.off('userOnline', handleUserStatusChange); // Clean up event listeners
      socket.off('userOffline', handleUserStatusChange);
    };
  }, [contactId]);

  return isOnline;
};
