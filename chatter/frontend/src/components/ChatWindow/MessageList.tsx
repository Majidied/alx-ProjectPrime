import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { useMessages } from '../../hooks/useMessages';
import { Message } from '../../utils/Message';

interface MessageListProps {
  contactId: string;
  ownerId: string;
}

const MessageList = forwardRef<{ addMessage: (message: Message) => void }, MessageListProps>(
  ({ contactId, ownerId }, ref) => {
    const { messages, addMessage } = useMessages(contactId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      addMessage(newMessage: Message) {
        addMessage(newMessage);
        scrollToBottom();
      },
    }));

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    return (
      <div className="flex-1 overflow-y-auto space-y-4 p-4 mt-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-4 ${
              message.senderId === ownerId ? 'justify-end' : ''
            }`}
          >
            {message.senderId !== ownerId && (
              <Avatar
                src={''}
                className="bg-gray-200"
                sx={{ width: 40, height: 40 }}
              />
            )}
            <div className="flex flex-col max-w-xs">
              <div
                className={`p-3 rounded-2xl shadow-lg ${
                  message.senderId === ownerId
                    ? 'bg-blue-500 text-white self-end rounded-br-none'
                    : 'bg-gray-100 text-black rounded-bl-none'
                }`}
              >
                {message.message}
              </div>
              <span className="text-gray-400 text-xs self-end mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {message.senderId === ownerId && (
              <Avatar
                src={''}
                className="bg-blue-500 text-white"
                sx={{ width: 40, height: 40 }}
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  }
);

export default MessageList;
