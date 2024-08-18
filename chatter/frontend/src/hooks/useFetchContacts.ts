import { useState, useEffect } from 'react';
import axios from 'axios';
import { Contact } from '../utils/Contact';

/**
 * Custom hook for fetching contacts from an API.
 *
 * @returns An object containing the fetched contacts, loading state, and error message.
 */
const useFetchContacts = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('/contacts');
                if (response.status !== 200) {
                    throw new Error('Failed to fetch contacts');
                }
                const data = await response.data;
                setContacts(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    return { contacts, loading, error };
};

export default useFetchContacts;
