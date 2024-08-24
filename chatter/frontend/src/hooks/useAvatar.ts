import { useState, useEffect } from 'react';
import { getContactAvatar } from '../utils/User';

export const useAvatar = (contactId: string) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatarFile = await getContactAvatar(contactId);
        const avatarBlob = avatarFile as unknown as Blob;
        const avatarObjectUrl = URL.createObjectURL(avatarBlob);
        setAvatarUrl(avatarObjectUrl);
      } catch (error) {
        console.error('Failed to fetch avatar:', error);
      }
    };

    fetchAvatar();

    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [contactId, avatarUrl]);

  return avatarUrl;
};
