import { useState, useEffect, useCallback } from 'react';
import { searchUser, User } from '../utils/User';

// Debounce function
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useUserSearch = (initialSearchTerm = '') => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
    if (debouncedSearchTerm) {
      handleSearch();
    }
  }, [debouncedSearchTerm, handleSearch]);

  return {
    searchTerm,
    setSearchTerm,
    searchResult,
    handleSearch,
  };
};
