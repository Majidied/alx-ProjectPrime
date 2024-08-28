import { useState, useEffect } from 'react';
import { getUserContact } from '../utils/User';
import { Contact } from '../utils/Contact';

/**
 * Custom hook to fetch and manage a specific contact's data.
 *
 * @param contactId - The unique identifier of the contact to be fetched.
 * @returns The contact data as a `Contact` object, or `null` if not available or an error occurs.
 */
export const useContact = (contactId: string) => {
  // State to hold the contact data
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    /**
     * Function to fetch the contact data from the server.
     */
    const fetchContact = async () => {
      try {
        // Fetch the contact data using the provided contactId
        const fetchedContact = await getUserContact(contactId);
        // Cast the fetched data to the Contact type and update the state
        setContact(fetchedContact as Contact);
      } catch (error) {
        // Log an error if the fetch fails
        console.error('Failed to fetch contact:', error);
      }
    };

    // Call the fetchContact function to initiate the fetch
    fetchContact();
  }, [contactId]); // The effect depends on the contactId and will rerun if it changes

  // Return the current contact data
  return contact;
};
