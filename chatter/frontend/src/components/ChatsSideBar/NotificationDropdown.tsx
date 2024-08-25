import React, { useState, useEffect, useRef } from 'react';
import { List, ListItem, ListItemText, Paper, Button, Avatar, Box } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { createContact, declineContactRequest } from '../../utils/Contact';
import Notification from '../Notification/Notification';
import { AxiosError } from 'axios';
import { useContactRequests } from '../../hooks/useContactRequests';
import { getContactAvatar } from '../../utils/User';

interface NotificationDropdownProps {
  onClose: () => void;
  onDecline: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose, onDecline }) => {
  const { notifications, searchResults, setNotifications, setSearchResults } = useContactRequests();
  const [notification, setNotification] = useState({
    type: 'error' as 'error' | 'success',
    message: '',
    visible: false,
  });
  const [avatars, setAvatars] = useState<{ [key: string]: string }>({});
  const cachedAvatars = useRef<{ [key: string]: string }>({});

  const handleAcceptRequest = async (userId: string) => {
    try {
      await createContact(userId);
      setSearchResults((prev) => ({ ...prev, [userId]: null }));
      setNotifications((prev) => prev.filter((id) => id !== userId));
      showNotification('success', 'Contact request accepted successfully.');
    } catch (error) {
      handleError('Failed to create contact', error);
    }
  };

  const handleDeclineRequest = async (userId: string) => {
    try {
      await declineContactRequest(userId);
      setNotifications((prev) => prev.filter((id) => id !== userId));
      onDecline(); // Decrease the notification count
      showNotification('success', 'Contact request declined successfully.');
    } catch (error) {
      handleError('Failed to decline contact request', error);
    }
  };

  const showNotification = (type: 'error' | 'success', message: string) => {
    setNotification({ type, message, visible: true });
  };

  const handleError = (defaultMessage: string, error: unknown) => {
    console.error(defaultMessage, error);
    const message =
      ((error as AxiosError).response?.data as { error: string })?.error ||
      'An error occurred. Please try again.';
    showNotification('error', message);
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const avatarPromises = notifications.map(async (userId) => {
        if (!cachedAvatars.current[userId]) {
          const avatar = await getContactAvatar(userId);
          const avatarBlob = avatar as unknown as Blob;
          const avatarObjectUrl = URL.createObjectURL(avatarBlob);
          cachedAvatars.current[userId] = avatarObjectUrl;
        }
        return { userId, avatarObjectUrl: cachedAvatars.current[userId] };
      });
  
      const avatarResults = await Promise.all(avatarPromises);
      const avatarMap = avatarResults.reduce((acc, { userId, avatarObjectUrl }) => {
        acc[userId] = avatarObjectUrl;
        return acc;
      }, {} as { [key: string]: string });
  
      setAvatars(avatarMap);
    };
  
    fetchAvatars();
  }, [notifications]);

  return (
    <Paper
      sx={{
        position: 'absolute',
        bottom: 50,
        right: 0,
        width: 320,
        maxHeight: 400,
        overflowY: 'auto',
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <List sx={{ padding: 0 }}>
        {notifications.map((userId) => {
          const user = searchResults[userId];
          return (
            <ListItem
              key={userId}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 1,
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={avatars[userId] || undefined}
                    alt={user.name}
                    sx={{ marginRight: 2, width: 40, height: 40 }}
                  />
                  <ListItemText
                    primary={user.name}
                    secondary={`@${user.username}`}
                    primaryTypographyProps={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                    secondaryTypographyProps={{ color: 'text.secondary', fontSize: '0.8rem' }}
                  />
                </Box>
              ) : (
                <ListItemText primary="User not found" />
              )}
              {user && (
                <Box>
                  <Button
                    color="primary"
                    sx={{ minWidth: 0, padding: 0.5 }}
                    onClick={() => handleAcceptRequest(userId)}
                  >
                    <CheckCircle />
                  </Button>
                  <Button
                    color="secondary"
                    sx={{ minWidth: 0, padding: 0.5, marginLeft: 1 }}
                    onClick={() => handleDeclineRequest(userId)}
                  >
                    <Cancel />
                  </Button>
                </Box>
              )}
            </ListItem>
          );
        })}
      </List>
      <Button
        onClick={onClose}
        fullWidth
        sx={{
          marginTop: 2,
          '&:hover': {
            backgroundColor: '#1976d2',
            color: '#fff',
          },
        }}
      >
        Close
      </Button>
      {notification.visible && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </Paper>
  );
};

export default NotificationDropdown;
