import axios from 'axios';

/**
 * Represents a contact.
 */
export interface Contact {
  avatar: string;
  name: string;
  message: string;
  time: string;
  id: string;
  userId: string;
  contactId: string;
}

export const getContacts = async () => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get('/api/contacts/get', { headers });
  console.log(response.data);
  return response.data;
};

export const getContactById = async (id: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get(`/api/contacts/get/${id}`, { headers });
  console.log(response.data);
  return response.data;
}

export const deleteContact = async (id: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.delete(`/api/contacts/delete/${id}`, { headers });
  console.log(response.data);

  return response.data;
}

export const sendContactRequest = async (recipientId: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.post('/api/contacts/send-request', { recipientId }, { headers });
  console.log(response.data);

  return response.data;
}

export const getContactRequests = async () => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get('/api/contacts/get-requests', { headers });
  console.log(response.data);

  return response.data;
}

export const createContact = async (contactId: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.post('/api/contacts/create', { contactId }, { headers });
  console.log(response.data);

  return response.data;
}
