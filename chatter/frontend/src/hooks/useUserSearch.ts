import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClinet';
import React from 'react';
import { User } from '../models/User';

/**
 * Custom hook to debounce a value by a specified delay.
 */
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook to manage user search functionality with debouncing,
 * powered by TanStack React Query.
 */
export function useUserSearch(initialSearchTerm = '') {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Query to fetch user data based on the debounced search term
  const {
    data: searchResult,
    isLoading,
    error,
    refetch, // you can use refetch if you need manual triggers
  } = useQuery<User | null, Error>({
    queryKey: ['userSearch', debouncedSearchTerm],
    queryFn: async () => {
      // If the debounced term is empty, return null directly
      if (!debouncedSearchTerm) {
        return null;
      }

      // Make an API call using your apiClient
      const response = await apiClient.post(`/users/search`, { username: debouncedSearchTerm });
      return response.data as User;
    },
    enabled: !!debouncedSearchTerm, // Only run if the search term is not empty
  });

  return {
    searchTerm,
    setSearchTerm,
    searchResult,
    isLoading,
    error,
    refetch,
  };
}