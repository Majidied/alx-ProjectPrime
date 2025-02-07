import { useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Message } from '../models/Message';
import { sendMessage } from '../api/messagesApi';
import socket from '../utils/socket';
import apiClient from '../api/apiClinet';

interface SendMessageVariables {
  senderId: string;
  recipientId: string;
  message: string;
}

export const useMessages = (contactId: string) => {
  const queryClient = useQueryClient();
  const messagesQueryKey = useMemo(() => ['messages', contactId], [contactId]);

  // Memoized notification sound
  const notificationSound = useMemo(() => {
    const sound = new Audio('/sounds/notification.mp3');
    sound.volume = 0.5;
    sound.addEventListener('error', (error) => {
      console.error('Failed to load notification sound:', error);
    });
    return sound;
  }, []);

  // Fetch messages using useQuery
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: messagesQueryKey,
    queryFn: async () => {
      const response = await apiClient.get(`/messages/get/${contactId}`);
      return response.data; 
    },
    enabled: Boolean(contactId),
  });

  // Mutation: sends a new message
  const mutation = useMutation({
    mutationFn: async ({ senderId, recipientId, message }: SendMessageVariables) => {
      return sendMessage(senderId, recipientId, message, contactId);
    },
    onMutate: async ({ senderId, recipientId, message }) => {
      await queryClient.cancelQueries({ queryKey: messagesQueryKey });

      const previousMessages = queryClient.getQueryData<Message[]>(messagesQueryKey) || [];

      // Create an optimistic message
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId,
        recipientId,
        message,
        contactId,
        timestamp: new Date().toISOString(),
        seen: false,
      };

      // Optimistically add the temp message
      queryClient.setQueryData<Message[]>(messagesQueryKey, [
        ...previousMessages,
        optimisticMessage,
      ]);

      return { previousMessages };
    },
    retry: false,
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    onSuccess: (savedMessage: Message) => {
      // Remove the temp message and add the actual saved message (check for duplication)
      queryClient.setQueryData<Message[]>(messagesQueryKey, (oldMessages = []) => {
        // Filter out any temp message
        const filtered = oldMessages.filter((msg) => !msg.id.startsWith('temp-'));
        // Avoid duplicates if “newMessage” event also arrives
        const alreadyExists = filtered.some((m) => m.id === savedMessage.id);
        return alreadyExists ? filtered : [...filtered, savedMessage];
      });
    },
    onError: (_error, _newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(messagesQueryKey, context.previousMessages);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: messagesQueryKey });
    },
  });

  // Listen for new messages from the socket
    useEffect(() => {
    const handleNewMessage = ({ newMessage }: { newMessage: Message }) => {
      // Ignore if not this conversation
      if (newMessage.contactId !== contactId) return;
  
      queryClient.setQueryData<Message[]>(messagesQueryKey, (oldMessages = []) => {
        // Compare multiple fields to avoid duplicates even if IDs differ
        const isDuplicate = oldMessages.some((msg) =>
          msg.senderId === newMessage.senderId &&
          msg.recipientId === newMessage.recipientId &&
          msg.contactId === newMessage.contactId &&
          msg.message === newMessage.message &&
          msg.timestamp === newMessage.timestamp
        );
        if (isDuplicate) {
          return oldMessages; // Same exact message is already in the list
        }
  
        // Not a duplicate, so add it
        notificationSound.play().catch((err) => console.error('Error playing sound:', err));
        document.title =
          document.visibilityState === 'hidden' ? 'New Message!' : 'Chatter';
  
        return [...oldMessages, newMessage];
      });
    };
  
    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [contactId, notificationSound, queryClient, messagesQueryKey]);

  // Exposed function to send a new message
  const addMessage = useCallback(
    (senderId: string, recipientId: string, message: string) =>
      mutation.mutate({ senderId, recipientId, message }),
    [mutation]
  );

  return { messages, addMessage };
};

/**
 * Custom hook to fetch and manage the last message in a conversation for a given contact.
 *
 * @param contactId - The unique identifier of the contact whose last message is being tracked.
 * @returns The last `Message` object in the conversation, or `null` if there is no message.
 */
export const useLastMessage = (contactId: string) => {
  const queryClient = useQueryClient();

  const { data: lastMessage, error, isLoading } = useQuery<Message | null, Error>({
    queryKey: contactId ? ['lastMessage', contactId] : [],
    queryFn: async () => { 
      const response = await apiClient.get(`/messages/get-last/${contactId}`);
      return response.data as Message;
    },
    enabled: !!contactId, // Only run the query if contactId is truthy
  });

  const handleNewMessage = useCallback(
    ({ newMessage }: { newMessage: Message }) => {
      if (newMessage.contactId === contactId) {
        queryClient.setQueryData(['lastMessage', contactId], newMessage);
      }
    },
    [contactId, queryClient]
  );

  useEffect(() => {
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
  }, [handleNewMessage]);

  return { lastMessage, error, isLoading };
};

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
  const queryClient = useQueryClient();

  const { data: unseenMessages = 0, refetch } = useQuery<number, Error>({
    queryKey: ['unseenMessages', senderId, contactId],
    queryFn: async () => {
      const response = await apiClient.post('/messages/get-unseen', { senderId, contactId });
      return response.data.count;
    },
    enabled: !!senderId && !!contactId, // Only run the query if senderId and contactId are truthy
  });

  const handleNewMessage = useCallback(
    ({ newMessage }: { newMessage: Message }) => {
      if (newMessage.senderId === senderId && newMessage.contactId === contactId) {
        queryClient.setQueryData<number>(['unseenMessages', senderId, contactId], (prev) => (prev || 0) + 1);
      }
    },
    [senderId, contactId, queryClient]
  );

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', handleNewMessage);
    } else {
      console.error('Socket is not initialized.');
    }

    return () => {
      if (socket) {
        socket.off('newMessage', handleNewMessage);
      }
    };
  }, [handleNewMessage]);

  const resetUnseenMessages = useCallback(() => {
    queryClient.setQueryData(['unseenMessages', senderId, contactId], 0);
  }, [queryClient, senderId, contactId]);

  return { unseenMessages, resetUnseenMessages, refetch };
};