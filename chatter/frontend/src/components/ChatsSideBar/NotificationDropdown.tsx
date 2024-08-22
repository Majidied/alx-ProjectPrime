import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Paper, Button, Avatar } from '@mui/material';
import { getUserById, User } from '../../utils/User';
import { createContact } from '../../utils/Contact';

interface NotificationDropdownProps {
  notifications: string[]; // List of notifications
  onClose: () => void; // Function to close the dropdown
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onClose }) => {
  const [searchResults, setSearchResults] = useState<{ [key: string]: User | null }>({});

  const handleAcceptRequest = async (userId: string) => {
    try {
      await createContact(userId);
      searchResults[userId] = null;
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const results: { [key: string]: User | null } = {};

      for (const notification of notifications) {
        try {
          const user = await getUserById(notification);
          results[notification] = user ? user as User : null;
        } catch (error) {
          console.error('Failed to fetch user:', error);
          results[notification] = null;
        }
      }

      setSearchResults(results);
    };

    fetchData();
  }, [notifications]);

  return (
    <Paper style={{ position: 'absolute', bottom: 50, right: 0, width: 300, maxHeight: 300, overflowY: 'auto' }}>
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
                <Button color="primary"
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
    </Paper>
  );
};

export default NotificationDropdown;
