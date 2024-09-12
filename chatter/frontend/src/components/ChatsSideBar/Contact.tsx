import {
  Avatar,
  Badge,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useContact } from '../../hooks/useContact';
import { useAvatar } from '../../hooks/useAvatar';
import { useUserStatus } from '../../hooks/useUserStatus';
import { useMessageContext } from '../../contexts/MessageContext';
import { useLastMessage } from '../../hooks/useLastMessage';
import { useUnseenMessages } from '../../hooks/useUnseenMessages';
import '../../styles/GradientCircularProgress.css'

interface ContactItemProps {
  id: string;
  contactId: string;
  onClick: () => void;
  searchQuery: string; // Accept search query as prop
}

export default function ContactItem({
  id,
  contactId,
  onClick,
  searchQuery,
}: ContactItemProps) {
  const contact = useContact(contactId);
  const { unseenMessages, resetUnseenMessages } = useUnseenMessages(
    contactId,
    id
  );
  const avatarUrl = useAvatar(contactId);
  const isOnline = useUserStatus(contactId);
  const lastMessageLocal = useLastMessage(id);
  const { lastMessages } = useMessageContext();
  const lastMessage = lastMessages[id];
  const isLoading = !contact || !avatarUrl;

  // Skip rendering if the contact name does not match the search query
  if (
    contact?.name &&
    !contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    return null;
  }

  // Timestamps
  const lastMessageTimestamp = lastMessage?.timestamp
    ? new Date(lastMessage.timestamp).getTime()
    : 0;
  const lastMessageLocalTimestamp = lastMessageLocal?.timestamp
    ? new Date(lastMessageLocal.timestamp).getTime()
    : 0;

  // Formatted Time
  const lastMessageTime = new Date(
    lastMessage?.timestamp || 0
  ).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const lastMessageLocalTime = new Date(
    lastMessageLocal?.timestamp || 0
  ).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Determine the most recent message and its time
  const isLocalMessageMoreRecent =
    lastMessageLocalTimestamp > lastMessageTimestamp;

  const finalMessage = isLocalMessageMoreRecent
    ? `${lastMessageLocal?.recipientId === contactId ? 'You: ' : ''}${lastMessageLocal?.message || 'No recent messages'}`
    : `You: ${lastMessage?.message || 'No recent messages'}`;

  const finalMessageTime = isLocalMessageMoreRecent
    ? lastMessageLocalTime
    : lastMessageTime;

  const handleOnClick = () => {
    onClick();
    resetUnseenMessages();
  };

  return (
    <Box
      onClick={handleOnClick}
      className="flex items-center justify-between p-1 ml-4 mr-4 bg-white rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
    >
      <Box className="flex items-center">
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            isOnline && (
              <CircleIcon
                className="text-green-500"
                style={{ width: 12, height: 12 }}
              />
            )
          }
        >
          {isLoading ? (
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                size={40}
                style={{
                  color: 'transparent', // Make the progress itself transparent
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'conic-gradient(#6A82FB, #FC5C7D)',
                  mask: 'radial-gradient(closest-side, transparent 80%, black 100%)',
                  WebkitMask:
                    'radial-gradient(closest-side, transparent 80%, black 100%)',
                  animation: 'rotate 2s linear infinite', // Animation to rotate the gradient
                }}
              />
            </div>
          ) : (
            <Avatar
              src={avatarUrl || ''}
              alt={contact?.name || 'Unknown Name'}
              sx={{ width: 40, height: 40 }}
            />
          )}
        </Badge>
        <Box ml={2}>
          <Typography className="text-gray-900 font-semibold text-base">
            {contact?.name || 'Unknown Name'}
          </Typography>
          <Typography
            variant="body2"
            className="text-gray-600 text-sm truncate w-40"
          >
            {finalMessage}
          </Typography>
        </Box>
      </Box>
      <Box className="flex flex-col items-end ml-4">
        <Typography variant="body2" className="text-gray-500 text-xs mb-1">
          {finalMessageTime.split(' ')[0]}
        </Typography>
        <Badge
          badgeContent={unseenMessages || 0}
          color="primary"
          className="mt-1"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: 'rgb(33, 150, 243)',
              color: 'white',
              minWidth: 20,
              height: 20,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
            },
          }}
        />
      </Box>
    </Box>
  );
}
