import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Avatar,
} from '@mui/material';
import { getUserById, User } from '../../utils/User';
import { createContact } from '../../utils/Contact';
import { getContactRequests } from '../../utils/Contact'; // Import the function
import Notification from '../Notification/Notification';
import { AxiosError } from 'axios';

interface NotificationDropdownProps {
  onClose: () => void; // Function to close the dropdown
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onClose,
}) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<{
    [key: string]: User | null;
  }>({});
  const [notification, setNotification] = useState({
    type: 'error',
    message: '',
    visible: false,
  });

  const handleAcceptRequest = async (userId: string) => {
    try {
      await createContact(userId);
      searchResults[userId] = null;
      setSearchResults({ ...searchResults }); // Update state to trigger re-render
      setNotifications(
        notifications.filter((notification) => notification !== userId)
      ); // Remove the notification from the list
      setNotification({
        type: 'success',
        message: 'Contact request accepted successfully.',
        visible: true,
      });
    } catch (error) {
      console.error('Failed to create contact:', error);
      setNotification({
        type: 'error',
        message:
          ((error as AxiosError).response?.data as { error: string })?.error ||
          'An error occurred. Please try again.',
        visible: true,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contact requests
        const requests = await getContactRequests();
        setNotifications(requests); // Set notifications

        const results: { [key: string]: User | null } = {};

        for (const notification of requests) {
          try {
            const user = await getUserById(notification);
            results[notification] = user ? (user as User) : null;
          } catch (error) {
            console.error('Failed to fetch user:', error);
            results[notification] = null;
          }
        }

        setSearchResults(results);
      } catch (error) {
        console.error('Failed to fetch contact requests:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data on mount

  return (
    <Paper
      style={{
        position: 'absolute',
        bottom: 50,
        right: 0,
        width: 300,
        maxHeight: 300,
        overflowY: 'auto',
      }}
    >
      <List>
        {notifications.map((notification, index) => {
          const searchResult = searchResults[notification];
          return (
            <ListItem key={index}>
              {searchResult ? (
                <>
                  <Avatar
                    src={`https://i.pravatar.cc/150?u=${searchResult._id}`}
                    alt={searchResult.name}
                    sx={{ marginRight: '16px' }}
                  />
                  <ListItemText
                    primary={searchResult.name}
                    secondary={'@' + searchResult.username}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                    secondaryTypographyProps={{ color: 'text.secondary' }}
                  />
                  <Button
                    color="primary"
                    onClick={() => handleAcceptRequest(notification)}
                  >
                    Accept
                  </Button>
                </>
              ) : (
                <ListItemText primary="User not found" />
              )}
            </ListItem>
          );
        })}
      </List>
      <Button onClick={onClose} fullWidth>
        Close
      </Button>
      {notification.visible && (
        <Notification
          type={notification.type as 'error' | 'success'}
          message={notification.message}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      )}
    </Paper>
  );
};

export default NotificationDropdown;
