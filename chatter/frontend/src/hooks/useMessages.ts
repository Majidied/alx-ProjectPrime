import { useState, useEffect, useCallback, useMemo } from 'react';
import { Message, getMessages } from '../utils/Message';
import socket from '../utils/socket';

export const useMessages = (contactId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const notificationSound = useMemo(() => {
    const sound = new Audio('/sounds/notification.mp3');
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
        notificationSound.play().catch((error) => {
          console.error('Error playing sound:', error);
        });
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
