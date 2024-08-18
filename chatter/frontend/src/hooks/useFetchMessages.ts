import { useState, useEffect } from 'react';
import axios from 'axios';
import { Message } from '../utils/Message';

/**
 * Custom hook for fetching messages from an API.
 *
 * @param contactId - The ID of the contact to fetch messages for.
 * @returns An object containing the fetched messages, loading state, and error message.
 */
const useFetchMessages = (contactId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/messages/${contactId}`);
                if (response.status !== 200) {
                    throw new Error('Failed to fetch messages');
                }
                const data = await response.data;
                setMessages(data);
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

        fetchMessages();
    }, [contactId]);

    return { messages, loading, error };
}

export default useFetchMessages;
