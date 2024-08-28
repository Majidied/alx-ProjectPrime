import { useState, useEffect, useCallback } from 'react';
import socket from '../utils/socket';
import { getUnseenMessages, Message } from '../utils/Message';

/**
 * Custom hook to manage and track the number of unseen messages from a specific sender in a conversation.
 *
 * @param senderId - The unique identifier of the sender whose messages are being tracked.
 * @param contactId - The unique identifier of the contact associated with the conversation.
 * @returns An object containing:
 * - `unseenMessages`: The current count of unseen messages.
 * - `resetUnseenMessages`: A function to reset the unseen messages count to zero.
 */
export const useUnseenMessages = (senderId: string, contactId: string) => {
  // State to hold the number of unseen messages
  const [unseenMessages, setUnseenMessages] = useState<number>(0);

  /**
   * Function to fetch the initial number of unseen messages from the server.
   * This function is memoized using `useCallback` to prevent unnecessary re-fetching.
   */
  const fetchInitialUnseenMessages = useCallback(async () => {
    try {
      // Fetch the count of unseen messages for the given sender and contact
      const initialUnseenMessages = await getUnseenMessages(senderId, contactId);
      setUnseenMessages(initialUnseenMessages.count);
    } catch (error) {
      console.error('Failed to fetch initial unseen messages:', error);
    }
  }, [senderId, contactId]);

  /**
   * Event handler for new messages received via the socket.
   * Increases the unseen messages count if the message is from the specified sender and contact.
   *
   * @param newMessage - The new message received.
   */
  const handleNewMessage = useCallback(
    ({ newMessage }: { newMessage: Message }) => {
      if (newMessage.senderId === senderId && newMessage.contactId === contactId) {
        setUnseenMessages((prev) => prev + 1);
      }
    },
    [senderId, contactId]
  );

  useEffect(() => {
    // Fetch the initial unseen messages when the component mounts
    fetchInitialUnseenMessages();

    // Subscribe to new messages via the socket
    socket.on('newMessage', handleNewMessage);

    // Cleanup function to run when the component unmounts
    return () => {
      socket.off('newMessage', handleNewMessage); // Unsubscribe from the new message event
    };
  }, [fetchInitialUnseenMessages, handleNewMessage]);

  /**
   * Function to reset the unseen messages count to zero.
   * This function is memoized using `useCallback` to prevent unnecessary re-creations.
   */
  const resetUnseenMessages = useCallback(() => {
    setUnseenMessages(0);
  }, []);

  // Return the current unseen messages count and the function to reset it
  return { unseenMessages, resetUnseenMessages };
};
