import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../api/userApi';
import { User } from '../models/User';
import { getContactRequests } from '../api/contactsApi';

/**
 * Custom hook to manage and fetch contact requests along with user details.
 *
 * @returns An object containing:
 * - `notifications`: An array of contact request IDs.
 * - `searchResults`: A record of user IDs mapped to `User` objects or `null` if the user data couldn't be fetched.
 */
export const useContactRequests = () => {
  // Fetch the contact request IDs
  const { data: notifications = [], error: notificationsError } = useQuery<string[], Error>({
    queryKey: ['contactRequests'],
    queryFn: getContactRequests,
  });

  // Fetch the user data for each contact request
  const { data: searchResults = {}, error: usersError } = useQuery<Record<string, User | null>, Error>({
    queryKey: ['contactRequestUsers', notifications],
    queryFn: async () => {
      if (notifications.length === 0) {
        return {};
      }

      const userFetchPromises = notifications.map(async (userId: string) => {
        try {
          const user = await getUserById(userId) as User;
          return { userId, user: user ?? null };
        } catch (error) {
          console.error('Failed to fetch user:', error);
          return { userId, user: null };
        }
      });

      const fetchedUsers = await Promise.all(userFetchPromises);

      return fetchedUsers.reduce((acc, { userId, user }) => {
        acc[userId] = user;
        return acc;
      }, {} as Record<string, User | null>);
    },
    enabled: notifications.length > 0,
  });

  return { notifications, searchResults, notificationsError, usersError };
};