import { useRef, useImperativeHandle, forwardRef, useEffect, useCallback, memo } from 'react';
import { VariableSizeList as List, ListChildComponentProps } from 'react-window';
import { Avatar } from '@mui/material';
import { useMessages } from '../../hooks/useMessages';
import { Message } from '../../utils/Message';
import { motion } from 'framer-motion';
import { useProfileContext } from '../../contexts/UseProfileContext';
import _ from 'lodash';

interface MessageListProps {
  avatar: string;
  contactId: string;
  ownerId: string;
}

const MessageList = forwardRef<{ addMessage: (message: Message) => void }, MessageListProps>(
  ({ avatar, contactId, ownerId }, ref) => {
    const { messages, addMessage } = useMessages(contactId);
    const listRef = useRef<List>(null); 
    const prevMessagesLength = useRef(messages.length);
    const userAvatar = useProfileContext().avatarUrl;

    useImperativeHandle(ref, () => ({
      addMessage(newMessage: Message) {
        addMessage(newMessage);
        scrollToBottom();
      },
    }));

    const scrollToBottom = useCallback(
      _.debounce(() => {
        if (listRef.current) {
          listRef.current.scrollToItem(messages.length - 1, 'end');
        }
      }, 100), // Debounce delay
      [messages.length]
    );

    useEffect(() => {
      if (messages.length > prevMessagesLength.current) {
        scrollToBottom();
        prevMessagesLength.current = messages.length;
      }
    }, [messages.length, scrollToBottom]);

    const getItemSize = useCallback(
      (index: number) => {
        const message = messages[index];
        const baseHeight = 80;
        const extraHeight = Math.min(100, message.message.length / 2);
        return baseHeight + extraHeight;
      },
      [messages]
    );

    const Row = useCallback(
      memo(({ index, style }: ListChildComponentProps) => {
        const message = messages[index];
        const isOwner = message.senderId === ownerId;
        const isNewMessage = index === messages.length - 1;

        return (
          <div style={style} className={`flex items-start space-x-4 ${isOwner ? 'justify-end' : ''} mt-4`}>
            {!isOwner && (
              <Avatar
                src={avatar || ''}
                className="bg-gray-200"
                sx={{ width: 40, height: 40 }}
              />
            )}
            <motion.div
              initial={isNewMessage ? { opacity: 0, y: 10 } : {}}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col max-w-xs"
            >
              <div
                className={`p-3 rounded-2xl shadow-lg ${
                  isOwner
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
            </motion.div>
            {isOwner && (
              <Avatar
                src={userAvatar || ''}
                className="bg-blue-500 text-white"
                sx={{ width: 40, height: 40 }}
              />
            )}
          </div>
        );
      }, (prevProps, nextProps) => prevProps.index === nextProps.index), // Memoize based on index
      [messages, avatar, userAvatar, ownerId]
    );

    return (
      <div className="flex-1 overflow-y-auto space-y-1 pr-2 pl-2">
        <List
          height={window.innerHeight - 160} 
          itemCount={messages.length}
          itemSize={getItemSize} 
          width="100%"
          ref={listRef} 
        >
          {Row}
        </List>
      </div>
    );
  }
);

export default MessageList;
