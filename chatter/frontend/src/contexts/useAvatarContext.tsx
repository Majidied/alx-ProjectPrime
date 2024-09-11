import React, { createContext, useContext, useState, ReactNode } from 'react';

const AvatarContext = createContext<{
  avatarUrl: string | null;
  setAvatarUrl: React.Dispatch<React.SetStateAction<string | null>>;
} | undefined>(undefined);

export const useAvatarContext = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useAvatarContext must be used within an AvatarProvider');
  }
  return context;
};

export const AvatarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
};

export default AvatarProvider;
