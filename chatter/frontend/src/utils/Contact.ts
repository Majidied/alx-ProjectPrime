import axios from 'axios';

/**
 * Represents a contact.
 */
export interface Contact {
  avatar: string;
  name: string;
  message: string;
  time: string;
  _id: string;
  userId: string;
  contactId: string;
}

export const getContacts = async () => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get('/api/contacts/get', { headers });
  return response.data;
};

export const getContactById = async (id: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get(`/api/contacts/get/${id}`, { headers });
  return response.data;
}

export const deleteContact = async (id: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.delete(`/api/contacts/delete/${id}`, { headers });

  return response.data;
}

export const sendContactRequest = async (recipientId: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.post('/api/contacts/send-request', { recipientId }, { headers });

  return response.data;
}

export const getContactRequests = async () => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get('/api/contacts/get-requests', { headers });

  return response.data;
}

export const declineContactRequest = async (senderId: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.delete(`/api/contacts/decline/${senderId}`, { headers });

  return response.data;
}

export const createContact = async (contactId: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.post('/api/contacts/create', { contactId }, { headers });

  return response.data;
}
