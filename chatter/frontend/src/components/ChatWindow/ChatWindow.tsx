import React, { useState, useRef } from 'react';
import UserBar from './ChatUserBar';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { useUserProfile } from '../../hooks/useUserProfile';
import { Contact } from '../../utils/Contact';
import { sendMessage, Message } from '../../utils/Message';
import { useMessageContext } from '../../contexts/MessageContext';

interface ChatWindowProps {
  contact: Contact | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contact }) => {
  const [message, setMessage] = useState<string>('');
  const userProfile = useUserProfile();
  const messageListRef = useRef<{ addMessage: (message: Message) => void }>(null);
  const { setLastMessage } = useMessageContext();

  const addEmoji = (emoji: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (userProfile && contact && message.trim()) {
      try {
        const recipientId =
          contact.userId === userProfile._id ? contact.contactId : contact.userId;
        const sentMessage = await sendMessage(
          userProfile._id,
          recipientId,
          message,
          contact._id
        );

        messageListRef.current?.addMessage(sentMessage);
        setLastMessage(contact._id, sentMessage); // Update last message in context
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
        // Optionally handle failed message sending
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-2">
      {contact && userProfile && (
        <>
          <UserBar recipientId={contact.userId === userProfile._id ? contact.contactId : contact.userId} />
          <MessageList
            contactId={contact._id as string}
            ownerId={userProfile._id as string}
            ref={messageListRef}
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
