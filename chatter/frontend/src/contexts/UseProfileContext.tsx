import React, { createContext, useContext } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserAvatar } from '../hooks/useUserAvatar';

type ProfileContextType = {
  user: ReturnType<typeof useUserProfile>;
  avatarUrl: ReturnType<typeof useUserAvatar>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useUserProfile();
  const avatarUrl = useUserAvatar();

  return (
    <ProfileContext.Provider value={{ user, avatarUrl }}>
      {children}
    </ProfileContext.Provider>
  );
};
