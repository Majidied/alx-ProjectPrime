import axios from 'axios';

export interface Message {
  id: number;
  senderId: string;
  recipientId: string;
  message: string;
  seen: boolean;
  contactId: string;
  timestamp: string;
}

export const getMessages = async (contactId: string) => {
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.get(`/api/messages/get/${contactId}`, {
    headers,
  });
  return response.data;
};

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

// Mark a message as seen
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

export const getLastMessage = async (contactId: string) => {
  const token = localStorage.getItem('token');

  const headers = { Authorization: `Bearer ${token}` };

  console.log('api/messages/get-last/' + contactId);
  const response = await axios.get(`/api/messages/get-last/${contactId}`, {
    headers,
  });
  return response.data;
};

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
