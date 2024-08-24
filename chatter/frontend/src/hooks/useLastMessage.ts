import { useState, useEffect } from "react";
import { Message, getLastMessage } from "../utils/Message";
import socket from "../utils/socket";

export const useLastMessage = (contactId: string): Message | null => {
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchLastMessage = async () => {
      try {
        const fetchedLastMessage = await getLastMessage(contactId);
        setLastMessage(fetchedLastMessage);
      } catch (error) {
        console.error("Failed to fetch last message:", error);
      }
    };

    fetchLastMessage();

    const handleNewMessage = ({ newMessage }: { newMessage: Message }) => {
      if (newMessage.contactId === contactId) {
        setLastMessage(newMessage);
      }
    };

    if (socket) {
      socket.on("newMessage", handleNewMessage);
    } else {
      console.error("Socket is not initialized.");
    }

    return () => {
      if (socket) {
        socket.off("newMessage", handleNewMessage);
      }
    };
  }, [contactId]);

  return lastMessage;
};
