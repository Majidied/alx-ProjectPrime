import { useQuery } from '@tanstack/react-query';
import { Contact } from '../models/Contact';
import apiClient from '../api/apiClinet';

/**
 * Custom hook to fetch and manage a specific contact's data.
 *
 * @param contactId - The unique identifier of the contact to be fetched.
 * @returns The contact data as a `Contact` object, or `null` if not available or an error occurs.
 */
export const useContact = (contactId: string) => {
  const fetchContact = async (): Promise<Contact> => {
    const fetchedContact = await apiClient.get(`/users/${contactId}`);
    return fetchedContact.data as Contact;
  };

  const { data: contact, error, isLoading } = useQuery<Contact, Error>({
    queryKey: ['contact', contactId],
    queryFn: fetchContact,
    enabled: !!contactId, // Only run the query if contactId is truthy
    staleTime: 1000 * 60 * 60 * 24,
  });

  return { contact, error, isLoading };
};