import { useState, useEffect } from 'react';
import socket from '../utils/socket';
import { getContactRequests } from '../utils/Contact';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<number>(0);

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

    const notificationSound = new Audio('/sounds/notification.wav');
    if (notificationSound) {
      console.log('Notification sound loaded');
      notificationSound.volume = 0.5;
    }

    socket.on('connect', () => {
      console.log('Connected to socket with ID:', socket.id);
    });

    socket.on('contactRequest', ({ senderId }) => {
      console.log('Received contact request from:', senderId);
      setNotifications((prev) => prev + 1);
      notificationSound.play().catch(error => console.error('Error playing sound:', error));
    });

    return () => {
      socket.off('contactRequest');
    };
  }, []);

  const decreaseNotification = () => {
    setNotifications(prev => Math.max(0, prev - 1));
  };

  return { notifications, decreaseNotification };
};
