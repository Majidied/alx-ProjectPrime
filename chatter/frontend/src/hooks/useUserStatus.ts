import { useState, useEffect } from 'react';
import { getUserStatus } from '../utils/User';
import socket from '../utils/socket';

export const useUserStatus = (contactId: string) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      const onlineStatus = await getUserStatus(contactId);
      setIsOnline(onlineStatus);
    };

    checkUserStatus();

    // Listen for online and offline events
    socket.on('userOnline', ({ userId }) => {
      if (userId === contactId) {
        setIsOnline(true);
        console.log(`User ${userId} is online`);
      }
    });

    socket.on('userOffline', ({ userId }) => {
      if (userId === contactId) {
        setIsOnline(false);
        console.log(`User ${userId} is offline`);
      }
    });

    return () => {
      socket.off('userOnline');
      socket.off('userOffline');
    };
  }, [contactId]);

  return isOnline;
};
