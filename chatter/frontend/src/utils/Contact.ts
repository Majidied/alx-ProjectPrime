import axios from 'axios';

/**
 * Represents a contact.
 */
export interface Contact {
  avatar: string;     // URL or path to the contact's avatar image
  name: string;       // Name of the contact
  message: string;    // Last message sent or received from the contact
  time: string;       // Timestamp of the last message
  _id: string;        // Unique identifier for the contact
  userId: string;     // ID of the user associated with this contact
  contactId: string;  // ID of the contact person
}

/**
 * Retrieves the list of all contacts for the logged-in user.
 *
 * @returns A promise that resolves to the list of contacts.
 */
export const getContacts = async () => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get('/api/contacts/get', { headers });
  return response.data; // Returns the list of contacts
};

/**
 * Retrieves the details of a specific contact by their ID.
 *
 * @param id - The unique identifier of the contact.
 * @returns A promise that resolves to the contact's details.
 */
export const getContactById = async (id: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get(`/api/contacts/get/${id}`, { headers });
  return response.data; // Returns the details of the contact
}

/**
 * Deletes a specific contact by their ID.
 *
 * @param id - The unique identifier of the contact to delete.
 * @returns A promise that resolves to the result of the deletion operation.
 */
export const deleteContact = async (id: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.delete(`/api/contacts/delete/${id}`, { headers });

  return response.data; // Returns the result of the deletion
}

/**
 * Sends a contact request to another user.
 *
 * @param recipientId - The unique identifier of the user to whom the contact request is being sent.
 * @returns A promise that resolves to the result of the send request operation.
 */
export const sendContactRequest = async (recipientId: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.post('/api/contacts/send-request', { recipientId }, { headers });

  return response.data; // Returns the result of the send request operation
}

/**
 * Retrieves the list of contact requests received by the logged-in user.
 *
 * @returns A promise that resolves to the list of contact requests.
 */
export const getContactRequests = async () => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get('/api/contacts/get-requests', { headers });

  return response.data; // Returns the list of contact requests
}

/**
 * Declines a contact request from a specific user.
 *
 * @param senderId - The unique identifier of the user whose contact request is being declined.
 * @returns A promise that resolves to the result of the decline operation.
 */
export const declineContactRequest = async (senderId: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.delete(`/api/contacts/decline/${senderId}`, { headers });

  return response.data; // Returns the result of the decline operation
}

/**
 * Creates a new contact for the logged-in user.
 *
 * @param contactId - The unique identifier of the user to be added as a contact.
 * @returns A promise that resolves to the result of the create contact operation.
 */
export const createContact = async (contactId: string) => {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.post('/api/contacts/create', { contactId }, { headers });

  return response.data; // Returns the result of the create contact operation
}
