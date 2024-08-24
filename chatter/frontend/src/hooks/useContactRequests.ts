import { useState, useEffect } from 'react';
import { getUserById, User } from '../utils/User';
import { getContactRequests } from '../utils/Contact';

export const useContactRequests = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Record<string, User | null>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = await getContactRequests();
        setNotifications(requests);

        const results: Record<string, User | null> = {};
        for (const userId of requests) {
          try {
            const user = await getUserById(userId);
            results[userId] = user as User ?? null;
          } catch (error) {
            console.error('Failed to fetch user:', error);
            results[userId] = null;
          }
        }
        setSearchResults(results);
      } catch (error) {
        console.error('Failed to fetch contact requests:', error);
      }
    };

    fetchData();
  }, []);

  return { notifications, searchResults, setNotifications, setSearchResults };
};
