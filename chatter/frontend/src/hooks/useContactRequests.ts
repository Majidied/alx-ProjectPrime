import { useState, useEffect, useCallback } from 'react';
import { getUserById, User } from '../utils/User';
import { getContactRequests } from '../utils/Contact';

export const useContactRequests = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Record<string, User | null>>({});

  const fetchData = useCallback(async () => {
    try {
      const requests = await getContactRequests();
      setNotifications(requests);

      if (requests.length === 0) {
        return; // No need to fetch user data if there are no requests
      }

      const userFetchPromises = requests.map(async (userId: string) => {
        try {
          const user = await getUserById(userId);
          return { userId, user: user ?? null };
        } catch (error) {
          console.error('Failed to fetch user:', error);
          return { userId, user: null };
        }
      });

      const fetchedUsers = await Promise.all(userFetchPromises);

      const results = fetchedUsers.reduce((acc, { userId, user }) => {
        acc[userId] = user;
        return acc;
      }, {} as Record<string, User | null>);

      setSearchResults(results);
    } catch (error) {
      console.error('Failed to fetch contact requests:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { notifications, searchResults, setNotifications, setSearchResults };
};
