import axios from 'axios';

/**
 * Interface representing a Message object.
 */
export interface Message {
  id: number;           // Unique identifier for the message
  senderId: string;     // ID of the user who sent the message
  recipientId: string;  // ID of the user who received the message
  message: string;      // The content of the message
  seen: boolean;        // Indicates whether the message has been seen
  contactId: string;    // ID of the contact associated with the message
  timestamp: string;    // Timestamp of when the message was sent
}

/**
 * Retrieves all messages associated with a specific contact.
 *
 * @param contactId - The ID of the contact whose messages are being retrieved.
 * @returns A promise that resolves to the list of messages.
 */
export const getMessages = async (contactId: string) => {
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.get(`/api/messages/get/${contactId}`, {
    headers,
  });
  return response.data;
};

/**
 * Sends a new message from one user to another.
 *
 * @param senderId - The ID of the user sending the message.
 * @param recipientId - The ID of the user receiving the message.
 * @param message - The content of the message.
 * @param contactId - The ID of the contact associated with this message.
 * @returns A promise that resolves to the result of the message send operation.
 */
export const sendMessage = async (
  senderId: string,
  recipientId: string,
  message: string,
  contactId: string
) => {
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.post(
    '/api/messages/send',
    { senderId, recipientId, message, contactId },
    { headers }
  );
  return response.data;
};

/**
 * Marks a specific message as seen.
 *
 * @param messageId - The ID of the message to mark as seen.
 * @returns A promise that resolves to the result of the mark as seen operation.
 */
export const markAsSeen = async (messageId: string) => {
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.put(
    `/api/messages/mark-as-seen/${messageId}`,
    {},
    { headers }
  );
  return response.data;
};

/**
 * Retrieves the last message sent in a conversation with a specific contact.
 *
 * @param contactId - The ID of the contact whose last message is being retrieved.
 * @returns A promise that resolves to the last message in the conversation.
 */
export const getLastMessage = async (contactId: string) => {
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.get(`/api/messages/get-last/${contactId}`, {
    headers,
  });
  return response.data;
};

/**
 * Retrieves unseen messages from a specific sender in a conversation with a specific contact.
 *
 * @param senderId - The ID of the sender whose unseen messages are being retrieved.
 * @param contactId - The ID of the contact associated with these unseen messages.
 * @returns A promise that resolves to the list of unseen messages.
 */
export const getUnseenMessages = async (
  senderId: string,
  contactId: string
) => {
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.post(
    '/api/messages/get-unseen',
    { senderId, contactId },
    { headers }
  );
  return response.data;
};
