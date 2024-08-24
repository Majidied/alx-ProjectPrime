import { useState, useEffect } from 'react';
import { getUserContact } from '../utils/User';
import { Contact } from '../utils/Contact';

export const useContact = (contactId: string) => {
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const fetchedContact = await getUserContact(contactId);
        setContact(fetchedContact as Contact);
      } catch (error) {
        console.error('Failed to fetch contact:', error);
      }
    };

    fetchContact();
  }, [contactId]);

  return contact;
};
