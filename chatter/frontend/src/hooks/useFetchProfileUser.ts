import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../utils/User';

/**
 * Custom hook for fetching user profile data.
 *
 * @param userId - The ID of the user to fetch.
 * @returns An object containing the user profile data, loading state, and error message.
 */
const useFetchProfileUser = (userId: string) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/users/${userId}`);
                if (response.status !== 200) {
                    throw new Error('Failed to fetch user');
                }
                const data = await response.data;
                setUser(data);
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

        fetchUser();
    }, [userId]);

    return { user, loading, error };
};

export default useFetchProfileUser;
