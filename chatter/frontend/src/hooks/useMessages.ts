import { useState, useEffect, useCallback } from 'react';
import { Message, getMessages } from '../utils/Message';
import socket from '../utils/socket';

export const useMessages = (contactId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessages(contactId);
        if (isMounted) {
          setMessages(fetchedMessages);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    const handleNewMessage = ({ newMessage }: { newMessage: Message }) => {
      if (newMessage.contactId === contactId && isMounted) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      isMounted = false;
      socket.off('newMessage', handleNewMessage);
    };
  }, [contactId]);

  const addMessage = useCallback((newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  return {
    messages,
    addMessage,
  };
};
