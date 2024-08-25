import { useState, useEffect, useCallback } from "react";
import { Message, getLastMessage } from "../utils/Message";
import socket from "../utils/socket";

export const useLastMessage = (contactId: string): Message | null => {
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  const fetchLastMessage = useCallback(async () => {
    try {
      const fetchedLastMessage = await getLastMessage(contactId);
      setLastMessage(fetchedLastMessage);
    } catch (error) {
      console.error("Failed to fetch last message:", error);
    }
  }, [contactId]);

  useEffect(() => {
    let isMounted = true;

    const handleNewMessage = ({ newMessage }: { newMessage: Message }) => {
      if (newMessage.contactId === contactId && isMounted) {
        setLastMessage(newMessage);
      }
    };

    fetchLastMessage();

    if (socket) {
      socket.on("newMessage", handleNewMessage);
    } else {
      console.error("Socket is not initialized.");
    }

    return () => {
      isMounted = false;
      if (socket) {
        socket.off("newMessage", handleNewMessage);
      }
    };
  }, [contactId, fetchLastMessage]);

  return lastMessage;
};
