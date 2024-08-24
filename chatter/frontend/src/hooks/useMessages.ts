import { useState, useEffect } from 'react';
import { Message, getMessages } from '../utils/Message';
import socket from '../utils/socket';

export const useMessages = (contactId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessages(contactId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    const handleNewMessage = ({ newMessage }: { newMessage: Message }) => {
      if (newMessage.contactId === contactId) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [contactId]);

  const addMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return {
    messages,
    addMessage,
  };
};
