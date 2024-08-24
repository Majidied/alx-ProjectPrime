import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  message: string;
  timestamp: string;
}

interface MessageContextType {
  lastMessages: Record<string, Message | null>;
  setLastMessage: (id: string, message: Message) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lastMessages, setLastMessages] = useState<Record<string, Message | null>>({});

  const setLastMessage = (id: string, message: Message) => {
    setLastMessages((prev) => ({
      ...prev,
      [id]: message,
    }));
  };

  return (
    <MessageContext.Provider value={{ lastMessages, setLastMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
};
