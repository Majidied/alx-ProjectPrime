import { useState, useEffect, useCallback } from 'react';
import { searchUser, User } from '../utils/User';

/**
 * Custom hook to debounce a value by a specified delay.
 *
 * @param value - The value to be debounced.
 * @param delay - The debounce delay in milliseconds.
 * @returns The debounced value.
 */
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timeout if the effect is re-run
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook to manage user search functionality with debouncing.
 *
 * @param initialSearchTerm - The initial search term (optional).
 * @returns An object containing:
 * - `searchTerm`: The current search term.
 * - `setSearchTerm`: Function to update the search term.
 * - `searchResult`: The search result as a `User` object, or `null` if not found.
 * - `handleSearch`: Function to manually trigger a search.
 */
export const useUserSearch = (initialSearchTerm = '') => {
  // State to hold the current search term
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // State to hold the search result
  const [searchResult, setSearchResult] = useState<User | null>(null);

  // Debounced search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  /**
   * Function to perform the user search using the debounced search term.
   * This function is memoized using `useCallback` to prevent unnecessary re-creations.
   */
  const handleSearch = useCallback(async () => {
    try {
      const user = await searchUser(debouncedSearchTerm);
      setSearchResult(user ? (user as User) : null);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setSearchResult(null);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    // Perform the search if the debounced search term is not empty
    if (debouncedSearchTerm) {
      handleSearch();
    }
  }, [debouncedSearchTerm, handleSearch]);

  // Return the search term, the function to update it, the search result, and the manual search trigger
  return {
    searchTerm,
    setSearchTerm,
    searchResult,
    handleSearch,
  };
};
