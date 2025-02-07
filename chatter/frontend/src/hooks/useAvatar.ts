import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import apiClient from '../api/apiClinet';

/**
 * Custom hook to fetch and manage the avatar URL for a given contact.
 *
 * @param contactId - The unique identifier of the contact whose avatar is being fetched.
 * @returns The URL of the contact's avatar as a string, or null if not available.
 */
export const useAvatar = (contactId: string) => {
  const queryClient = useQueryClient();
  const [cachedAvatar, setCachedAvatar] = useState<string | null>(null);

  // Check local storage on mount
  useEffect(() => {
    const storedData = localStorage.getItem(`avatar-${contactId}`);
    const storedTime = localStorage.getItem(`avatarTime-${contactId}`);
    
    if (storedData && storedTime) {
      const timeDiff = Date.now() - parseInt(storedTime, 10);
      if (timeDiff < 1000 * 60 * 60) { // 1 hour cache
        setCachedAvatar(storedData);
      }
    }
  }, [contactId]);

  const fetchAvatar = async () => {
    try {
      const avatarFile = await apiClient.get(`/files/${contactId}`, {
        responseType: 'blob',
      });

      const avatarBlob = avatarFile.data as Blob;
      const reader = new FileReader();

      return new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const dataUrl = reader.result as string;

          // Store in localStorage & React Query Cache
          localStorage.setItem(`avatar-${contactId}`, dataUrl);
          localStorage.setItem(`avatarTime-${contactId}`, Date.now().toString());
          queryClient.setQueryData(['avatar', contactId], dataUrl);
          setCachedAvatar(dataUrl);

          resolve(dataUrl);
        };
        reader.readAsDataURL(avatarBlob);
      });
    } catch (error) {
      console.error('Failed to fetch avatar:', error);
      throw error;
    }
  };

  const { data: avatarUrl, isLoading, error } = useQuery<string, Error>({
    queryKey: ['avatar', contactId],
    queryFn: fetchAvatar,
    enabled: !!contactId && !cachedAvatar, // Fetch only if not already cached
    staleTime: 1000 * 60 * 10, // Consider fresh for 10 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    refetchOnWindowFocus: false,
    initialData: cachedAvatar || queryClient.getQueryData(['avatar', contactId]),
  });

  return { avatarUrl: cachedAvatar || avatarUrl, isLoading, error };
};
