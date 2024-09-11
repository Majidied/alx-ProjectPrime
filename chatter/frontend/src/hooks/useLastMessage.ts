import { useState, useEffect, useCallback } from "react";
import { Message, getLastMessage } from "../utils/Message";
import socket from "../utils/socket";

/**
 * Custom hook to fetch and manage the last message in a conversation for a given contact.
 *
 * @param contactId - The unique identifier of the contact whose last message is being tracked.
 * @returns The last `Message` object in the conversation, or `null` if there is no message.
 */
export const useLastMessage = (contactId: string): Message | null => {
  // State to hold the last message
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  /**
   * Function to fetch the last message from the server.
   * This function is memoized using `useCallback` to prevent unnecessary re-fetching.
   */
  const fetchLastMessage = useCallback(async () => {
    try {
      // Fetch the last message for the given contact ID
      const fetchedLastMessage = await getLastMessage(contactId);
      // Update the state with the fetched last message
      setLastMessage(fetchedLastMessage);
    } catch (error) {
      // Log an error if fetching the last message fails
      console.error("Failed to fetch last message:", error);
    }
  }, [contactId]);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is still mounted

    /**
     * Event handler for new messages received via the socket.
     * Updates the last message if the new message belongs to the same contact.
     *
     * @param newMessage - The new message received.
     */
    const handleNewMessage = ({ newMessage }: { newMessage: Message }) => {
      if (newMessage.contactId === contactId && isMounted) {
        setLastMessage(newMessage); // Update the last message state
      }
    };

    // Fetch the initial last message when the component mounts
    fetchLastMessage();

    // Subscribe to new messages via the socket
    if (socket) {
      socket.on("newMessage", handleNewMessage);
    } else {
      console.error("Socket is not initialized.");
    }

    // Cleanup function to run when the component unmounts
    return () => {
      isMounted = false; // Mark the component as unmounted
      if (socket) {
        socket.off("newMessage", handleNewMessage); // Unsubscribe from the new message event
      }
    };
  }, [contactId, fetchLastMessage]); // The effect depends on contactId and fetchLastMessage

  // Return the current last message
  return lastMessage;
};
