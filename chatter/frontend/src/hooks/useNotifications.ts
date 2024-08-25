import { useState, useEffect, useMemo } from 'react';
import socket from '../utils/socket';
import { getContactRequests } from '../utils/Contact';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<number>(0);

  // Memoize the Audio object to ensure it's not recreated on every render
  const notificationSound = useMemo(() => {
    const sound = new Audio('/sounds/notification.wav');
    sound.volume = 0.5;
    sound.addEventListener('canplaythrough', () => {
      console.log('Notification sound loaded');
    }, { once: true });
    sound.addEventListener('error', (error) => {
      console.error('Failed to load notification sound:', error);
    });
    return sound;
  }, []);

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      try {
        const initialNotifications = await getContactRequests();
        setNotifications(initialNotifications.length);
      } catch (error) {
        console.error('Failed to fetch initial notifications:', error);
      }
    };

    fetchInitialNotifications();

    const handleContactRequest = ({ senderId }: { senderId: string }) => {
      console.log('Received contact request from:', senderId);
      setNotifications((prev) => prev + 1);
      notificationSound.play().catch((error) => {
        console.error('Error playing sound:', error);
      });
    };

    socket.on('connect', () => {
      console.log('Connected to socket with ID:', socket.id);
    });

    socket.on('contactRequest', handleContactRequest);

    return () => {
      socket.off('contactRequest', handleContactRequest);
    };
  }, [notificationSound]);

  const decreaseNotification = () => {
    setNotifications((prev) => Math.max(0, prev - 1));
  };

  return { notifications, decreaseNotification };
};
