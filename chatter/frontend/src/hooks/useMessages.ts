import { useState, useEffect, useCallback, useMemo } from 'react';
import { Message, getMessages } from '../utils/Message';
import socket from '../utils/socket';

/**
 * Custom hook to manage and fetch messages in a conversation for a given contact.
 *
 * @param contactId - The unique identifier of the contact whose messages are being tracked.
 * @returns An object containing:
 * - `messages`: An array of `Message` objects representing the conversation.
 * - `addMessage`: A function to manually add a new message to the conversation.
 */
export const useMessages = (contactId: string) => {
  // State to hold the list of messages in the conversation
  const [messages, setMessages] = useState<Message[]>([]);

  /**
   * Memoized notification sound to play when a new message arrives.
   * The sound is preloaded and its volume is set to 0.5.
   */
  const notificationSound = useMemo(() => {
    const sound = new Audio('/sounds/notification.mp3');
    sound.volume = 0.5;

    // Preload the sound and handle potential loading errors
    sound.addEventListener('canplaythrough', () => {}, { once: true });
    sound.addEventListener('error', (error) => {
      console.error('Failed to load notification sound:', error);
    });

    return sound;
  }, []);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is still mounted

    /**
     * Function to fetch the messages for the given contact ID.
     */
    const fetchMessages = async () => {
      try {
        // Fetch the messages from the server
        const fetchedMessages = await getMessages(contactId);
        // If the component is still mounted, update the messages state
        if (isMounted) {
          setMessages(fetchedMessages);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    // Fetch the initial messages when the component mounts
    fetchMessages();

    /**
     * Event handler for new messages received via the socket.
     * Plays a notification sound and updates the messages state if the message belongs to the same contact.
     *
     * @param newMessage - The new message received.
     */
    const handleNewMessage = ({ newMessage }: { newMessage: Message }) => {
      if (newMessage.contactId === contactId && isMounted) {
        // Play notification sound on new message
        notificationSound.play().catch((error) => {
          console.error('Error playing sound:', error);
        });
        // Update the messages state with the new message
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    // Subscribe to new messages via the socket
    socket.on('newMessage', handleNewMessage);

    // Cleanup function to run when the component unmounts
    return () => {
      isMounted = false; // Mark the component as unmounted
      socket.off('newMessage', handleNewMessage); // Unsubscribe from the new message event
    };
  }, [contactId, notificationSound]);

  /**
   * Callback function to manually add a new message to the messages state.
   *
   * @param newMessage - The new message to add to the conversation.
   */
  const addMessage = useCallback((newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  // Return the messages state and the addMessage function
  return {
    messages,
    addMessage,
  };
};
