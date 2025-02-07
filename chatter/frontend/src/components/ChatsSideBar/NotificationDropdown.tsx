import React, { useState, useEffect } from 'react';
import { useContactRequests } from '../../hooks/useContactRequests';
import { useNotification } from '../../hooks/useNotifications';
import { createContact, declineContactRequest } from '../../api/contactsApi';
import { Avatar, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

interface NotificationDropdownProps {
  onClose: () => void;
  onDecline: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose, onDecline }) => {
  const { notifications, searchResults, notificationsError, usersError } = useContactRequests();
  const [localSearchResults, setLocalSearchResults] = useState(searchResults);
  const [notification, setNotification] = useState({
    type: 'error' as 'error' | 'success',
    message: '',
    visible: false,
  });
  const { data: avatars = {}, isLoading, error } = useNotification(notifications);

  useEffect(() => {
    setLocalSearchResults(searchResults);
  }, [searchResults]);

  const showNotification = (type: 'error' | 'success', message: string) => {
    setNotification({ type, message, visible: true });
    setTimeout(() => setNotification({ ...notification, visible: false }), 3000);
  };

  const handleAcceptRequest = async (userId: string) => {
    try {
      await createContact(userId);
      setLocalSearchResults((prev) => ({ ...prev, [userId]: null }));
      showNotification('success', 'Contact request accepted successfully.');
    } catch (error) {
      console.error('Failed to create contact:', error);
      showNotification('error', 'Failed to accept contact request.');
    }
  };

  const handleDeclineRequest = async (userId: string) => {
    try {
      await declineContactRequest(userId);
      setLocalSearchResults((prev) => ({ ...prev, [userId]: null }));
      onDecline(); // Decrease the notification count
      showNotification('success', 'Contact request declined successfully.');
    } catch (error) {
      console.error('Failed to decline contact request:', error);
      showNotification('error', 'Failed to decline contact request.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || notificationsError || usersError) return <div>Error loading notifications</div>;

  return (
    <div className="notification-dropdown">
      {notification.visible && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <List>
        {notifications.map((userId) => {
          const user = localSearchResults[userId];
          return (
            <ListItem key={userId} className="notification-item">
              <Avatar src={avatars[userId] || ''} />
              {user ? (
                <Box>
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
      <Button onClick={onClose} fullWidth>
        Close
      </Button>
    </div>
  );
};

export default NotificationDropdown;