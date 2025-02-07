import React, { useState, useEffect } from 'react';
import UserBar from './ChatUserBar';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { useUserProfile } from '../../hooks/useUser';
import { Contact } from '../../models/Contact';
import { useAvatar } from '../../hooks/useAvatar';
import { useUnseenMessages } from '../../hooks/useMessages';
import { useMessages } from '../../hooks/useMessages';


interface ChatWindowProps {
  contact: Contact | null;
  handleBackClick?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  contact,
  handleBackClick,
}) => {
  const [message, setMessage] = useState<string>('');
  const { userProfile } = useUserProfile();
  const { addMessage } = useMessages(contact?._id || '');

  const { avatarUrl } = useAvatar((contact?.userId === userProfile?._id
    ? contact?.contactId
    : contact?.userId) as string);
  const recipientId = contact?.contactId === userProfile?._id ? contact?.userId : contact?.contactId;
  const { resetUnseenMessages, refetch } = useUnseenMessages(
    contact?._id || '',
    recipientId || ''
  );

  useEffect(() => {
    resetUnseenMessages();
  }, [contact, resetUnseenMessages]);

  const addEmoji = (emoji: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (userProfile && contact && message.trim()) {
      try {
        addMessage(userProfile._id, recipientId as string, message);
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
        // Optionally handle failed message sending
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-2 rounded-md">
      {contact && userProfile && (
        <>
          {handleBackClick && (
            <UserBar
              avatarUrl={avatarUrl || ''}
              recipientId={
                contact.userId === userProfile._id
                  ? contact.contactId
                  : contact.userId
              }
              handleBackClick={() => {
                refetch();
                handleBackClick();
                }}
            />
          )}
          {!handleBackClick && (
            <UserBar
              avatarUrl={avatarUrl || ''}
              recipientId={
                contact.userId === userProfile._id
                  ? contact.contactId
                  : contact.userId
              }
            />
          )}
          <MessageList
            avatar={avatarUrl || ''}
            contactId={contact._id as string}
            ownerId={userProfile._id as string}
          />
          <InputArea
            message={message}
            setMessage={setMessage}
            sendMessage={handleSendMessage}
            addEmoji={addEmoji}
          />
        </>
      )}
    </div>
  );
};

export default ChatWindow;
