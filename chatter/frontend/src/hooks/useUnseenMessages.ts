import { useState, useEffect } from 'react';
import socket from '../utils/socket';
import { getUnseenMessages } from '../utils/Message';

export const useUnseenMessages = (senderId: string, contactId: string) => {
  const [unseenMessages, setUnseenMessages] = useState<number>(0);

  useEffect(() => {
    const fetchInitialUnseenMessages = async () => {
      try {
        console.log('Sender ID:', senderId + ' Contact ID:', contactId);
        const initialUnseenMessages = await getUnseenMessages(
          senderId,
          contactId
        );
        console.log('Initial unseen messages:', initialUnseenMessages);
        setUnseenMessages(initialUnseenMessages.count);
      } catch (error) {
        console.error('Failed to fetch initial unseen messages:', error);
      }
    };

    fetchInitialUnseenMessages();

    socket.on('connect', () => {
      console.log('Connected to socket with ID:', socket.id);
    });

    socket.on('message', ({ contactId }) => {
      console.log('Received message from:', contactId);
      setUnseenMessages((prev) => prev + 1);
    });

    return () => {
      socket.off('message');
    };
  }, [contactId]);

  const decreaseUnseenMessages = () => {
    setUnseenMessages((prev) => Math.max(0, prev - 1));
  };

  return { unseenMessages, decreaseUnseenMessages };
};
