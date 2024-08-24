import { useState, useEffect } from 'react';
import socket from '../utils/socket';
import { getUnseenMessages } from '../utils/Message';

export const useUnseenMessages = (senderId: string, contactId: string) => {
  const [unseenMessages, setUnseenMessages] = useState<number>(0);

  useEffect(() => {
    const fetchInitialUnseenMessages = async () => {
      try {
        const initialUnseenMessages = await getUnseenMessages(
          senderId,
          contactId
        );
        setUnseenMessages(initialUnseenMessages.count);
      } catch (error) {
        console.error('Failed to fetch initial unseen messages:', error);
      }
    };

    fetchInitialUnseenMessages();

    socket.on('newMessage', ({ newMessage }) => {
      if (newMessage.senderId === senderId) {
        console.log('New message received:', newMessage);
        setUnseenMessages((prev) => prev + 1);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [contactId]);

  const resetUnseenMessages = () => {
    setUnseenMessages(0);
  };

  return { unseenMessages, resetUnseenMessages };
};
