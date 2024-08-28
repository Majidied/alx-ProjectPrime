import { useState, useEffect, useMemo } from 'react';
import socket from '../utils/socket';
import { getContactRequests } from '../utils/Contact';

/**
 * Custom hook to manage notifications for incoming contact requests.
 *
 * @returns An object containing:
 * - `notifications`: The current number of notifications.
 * - `decreaseNotification`: A function to decrease the notification count.
 */
export const useNotifications = () => {
  // State to hold the number of notifications
  const [notifications, setNotifications] = useState<number>(0);

  /**
   * Memoized notification sound to play when a new contact request is received.
   * The sound is preloaded and its volume is set to 0.5.
   */
  const notificationSound = useMemo(() => {
    const sound = new Audio('/sounds/notification.wav');
    sound.volume = 0.5;

    // Preload the sound and handle potential loading errors
    sound.addEventListener('canplaythrough', () => {}, { once: true });
    sound.addEventListener('error', (error) => {
      console.error('Failed to load notification sound:', error);
    });

    return sound;
  }, []);

  useEffect(() => {
    /**
     * Function to fetch the initial number of contact request notifications.
     */
    const fetchInitialNotifications = async () => {
      try {
        const initialNotifications = await getContactRequests();
        setNotifications(initialNotifications.length);
      } catch (error) {
        console.error('Failed to fetch initial notifications:', error);
      }
    };

    // Fetch the initial notifications when the component mounts
    fetchInitialNotifications();

    /**
     * Event handler for new contact requests received via the socket.
     * Increases the notification count and plays a notification sound.
     *
     * @param senderId - The ID of the user sending the contact request.
     */
    const handleContactRequest = ({ senderId }: { senderId: string }) => {
      if (senderId) {
        // Increase the notification count by 1
        setNotifications((prev) => prev + 1);
        // Play the notification sound
        notificationSound.play().catch((error) => {
          console.error('Error playing sound:', error);
        });
      }
    };

    // Subscribe to the contactRequest event via the socket
    socket.on('contactRequest', handleContactRequest);

    // Cleanup function to run when the component unmounts
    return () => {
      socket.off('contactRequest', handleContactRequest); // Unsubscribe from the event
    };
  }, [notificationSound]);

  /**
   * Function to decrease the notification count by 1.
   * Ensures that the count does not go below 0.
   */
  const decreaseNotification = () => {
    setNotifications((prev) => Math.max(0, prev - 1));
  };

  // Return the current notification count and the function to decrease it
  return { notifications, decreaseNotification };
};
