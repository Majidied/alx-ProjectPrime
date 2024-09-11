import { useState, useEffect } from 'react';
import { getUserAvatar } from '../utils/User';

export const useUserAvatar = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        if (!avatarUrl) {
          const avatarBlob = await getUserAvatar();
          const url = URL.createObjectURL(avatarBlob);
          setAvatarUrl((prevUrl) => {
            if (prevUrl) {
              URL.revokeObjectURL(prevUrl);
            }
            return url;

          });
        }
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
