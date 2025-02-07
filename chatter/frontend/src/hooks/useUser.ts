import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClinet';

export const useUserProfile = () => {
  const { data: userProfile, error, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await apiClient.get('/users/profile');
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (error) {
    console.error('Failed to fetch user profile:', error);
  }

  return { userProfile, isLoading };
};

export const useUserAvatar = () => {
  const { data: avatarUrl, error, isLoading } = useQuery({
    queryKey: ['userAvatar'],
    queryFn: async () => {
      const response = await apiClient.get('/files/profile', {
        responseType: 'blob',
      });
      const blob = response.data;
      return URL.createObjectURL(blob);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (error) {
    console.error('Failed to fetch user avatar:', error);
  }

  return { avatarUrl, isLoading };
};
