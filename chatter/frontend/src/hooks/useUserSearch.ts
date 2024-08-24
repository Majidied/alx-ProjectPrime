import { useState, useEffect } from 'react';
import { searchUser, User } from '../utils/User';

export const useUserSearch = (initialSearchTerm = '') => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResult, setSearchResult] = useState<User | null>(null);

  const handleSearch = async () => {
    try {
      const user = await searchUser(searchTerm);
      setSearchResult(user ? (user as User) : null);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setSearchResult(null);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchResult,
    handleSearch,
  };
};
