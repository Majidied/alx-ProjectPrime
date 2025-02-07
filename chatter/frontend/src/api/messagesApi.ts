import apiClient from "./apiClinet";

export const fetchMessages = async (contactId: string) => {
  const response = await apiClient.get(`/messages/get/${contactId}`);
  return response.data;
};

export const sendMessage = async (senderId: string, recipientId: string, message: string, contactId: string) => {
  const response = await apiClient.post('/messages/send', { senderId, recipientId, message, contactId });
  return response.data;
};

export const fetchLastMessage = async (contactId: string) => {
  const response = await apiClient.get(`/messages/get-last/${contactId}`);
  return response.data;
};

export const fetchUnseenMessages = async (senderId: string, contactId: string) => {
  const response = await apiClient.post('/messages/get-unseen', { senderId, contactId });
  return response.data.count;
};
