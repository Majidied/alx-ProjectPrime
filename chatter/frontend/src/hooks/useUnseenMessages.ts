import { useState, useEffect, useCallback } from 'react';
import socket from '../utils/socket';
import { getUnseenMessages, Message } from '../utils/Message';

export const useUnseenMessages = (senderId: string, contactId: string) => {
  const [unseenMessages, setUnseenMessages] = useState<number>(0);

  const fetchInitialUnseenMessages = useCallback(async () => {
    try {
      const initialUnseenMessages = await getUnseenMessages(senderId, contactId);
      setUnseenMessages(initialUnseenMessages.count);
    } catch (error) {
      console.error('Failed to fetch initial unseen messages:', error);
    }
  }, [senderId, contactId]);

  const handleNewMessage = useCallback(
    ({ newMessage }: { newMessage: Message }) => {
      if (newMessage.senderId === senderId && newMessage.contactId === contactId) {
        setUnseenMessages((prev) => prev + 1);
      }
    },
    [senderId, contactId]
  );

  useEffect(() => {
    fetchInitialUnseenMessages();

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [fetchInitialUnseenMessages, handleNewMessage]);

  const resetUnseenMessages = useCallback(() => {
    setUnseenMessages(0);
  }, []);

  return { unseenMessages, resetUnseenMessages };
};
