import { useState, useEffect, useRef } from 'react';
import { getContactAvatar } from '../utils/User';

export const useAvatar = (contactId: string) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const previousAvatarUrl = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAvatar = async () => {
      try {
        const avatarFile = await getContactAvatar(contactId);
        const avatarBlob = avatarFile as unknown as Blob;
        const avatarObjectUrl = URL.createObjectURL(avatarBlob);
        
        if (isMounted) {
          setAvatarUrl(avatarObjectUrl);
        }

        if (previousAvatarUrl.current) {
          URL.revokeObjectURL(previousAvatarUrl.current);
        }

        previousAvatarUrl.current = avatarObjectUrl;
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch avatar:', error);
        }
      }
    };

    fetchAvatar();

    return () => {
      isMounted = false;
      if (previousAvatarUrl.current) {
        URL.revokeObjectURL(previousAvatarUrl.current);
      }
    };
  }, [contactId]);

  return avatarUrl;
};
