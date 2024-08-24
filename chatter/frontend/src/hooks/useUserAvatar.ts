import { useState, useEffect } from 'react';
import { getUserAvatar } from '../utils/User';

export const useUserAvatar = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const avatarFile = await getUserAvatar();
        const avatarBlob = avatarFile as unknown as Blob;
        const url = URL.createObjectURL(avatarBlob);
        setAvatarUrl(url);
      } catch (error) {
        console.error('Failed to fetch user avatar:', error);
      }
    };

    fetchUserAvatar();

    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  return avatarUrl;
};
