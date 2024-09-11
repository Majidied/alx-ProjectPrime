import { useState, useEffect, useCallback } from 'react';
import { getUserById, User } from '../utils/User';
import { getContactRequests } from '../utils/Contact';

/**
 * Custom hook to manage and fetch contact requests along with user details.
 *
 * @returns An object containing:
 * - `notifications`: An array of contact request IDs.
 * - `searchResults`: A record of user IDs mapped to `User` objects or `null` if the user data couldn't be fetched.
 * - `setNotifications`: A function to manually update the notifications state.
 * - `setSearchResults`: A function to manually update the searchResults state.
 */
export const useContactRequests = () => {
  // State to hold the array of contact request IDs
  const [notifications, setNotifications] = useState<string[]>([]);

  // State to hold the fetched user data, mapped by user ID
  const [searchResults, setSearchResults] = useState<Record<string, User | null>>({});

  /**
   * Function to fetch contact requests and the corresponding user data.
   * This function is memoized using `useCallback` to prevent unnecessary re-creations.
   */
  const fetchData = useCallback(async () => {
    try {
      // Fetch the contact request IDs
      const requests = await getContactRequests();
      setNotifications(requests);

      // If there are no requests, skip fetching user data
      if (requests.length === 0) {
        return;
      }

      // Map each request ID to a promise that fetches the corresponding user data
      const userFetchPromises = requests.map(async (userId: string) => {
        try {
          const user = await getUserById(userId);
          return { userId, user: user ?? null };
        } catch (error) {
          console.error('Failed to fetch user:', error);
          return { userId, user: null };
        }
      });

      // Wait for all user data fetch promises to resolve
      const fetchedUsers = await Promise.all(userFetchPromises);

      // Reduce the fetched user data into a record mapping user IDs to User objects or null
      const results = fetchedUsers.reduce((acc, { userId, user }) => {
        acc[userId] = user;
        return acc;
      }, {} as Record<string, User | null>);

      // Update the searchResults state with the fetched user data
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to fetch contact requests:', error);
    }
  }, []);

  // Effect that runs when the component mounts or when fetchData changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return the notifications and searchResults states along with their corresponding set functions
  return { notifications, searchResults, setNotifications, setSearchResults };
};
