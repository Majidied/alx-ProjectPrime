import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Avatar,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { sendContactRequest } from '../../utils/Contact';
import Notification from '../Notification/Notification';
import { AxiosError } from 'axios';
import { useUserSearch } from '../../hooks/useUserSearch';

interface SearchUserModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchUserModal: React.FC<SearchUserModalProps> = ({ open, onClose }) => {
  const { searchTerm, setSearchTerm, searchResult, handleSearch } = useUserSearch();
  const [notification, setNotification] = useState({
    type: 'error',
    message: '',
    visible: false,
  });

  const handleSendRequest = async (userId: string) => {
    try {
      await sendContactRequest(userId);
      setNotification({
        type: 'success',
        message: 'Friend request sent successfully.',
        visible: true,
      });
    } catch (error) {
      console.error('Failed to send friend request:', error);
      setNotification({
        type: 'warning',
        message: ((error as AxiosError).response?.data as { error: string })
          ?.error || 'An error occurred. Please try again.',
        visible: true,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Find your friends</DialogTitle>
      <DialogContent>
        <Box className="flex justify-between items-center mt-2 ml-4">
          <input
            type="text"
            placeholder="Search"
            className="p-2 w-full rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton color="primary" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Box>
        <List className="mt-4">
          {searchResult && (
            <ListItem
              key={searchResult._id}
              secondaryAction={
                <IconButton
                  color="primary"
                  onClick={() => handleSendRequest(searchResult._id)}
                >
                  <PersonAddIcon />
                </IconButton>
              }
            >
              <Avatar
                src={`https://i.pravatar.cc/150?u=${searchResult._id}`}
                alt={searchResult.name}
                sx={{ marginRight: '16px' }}
              />
              <ListItemText
                primary={searchResult.name}
                secondary={`@${searchResult.username}`}
                primaryTypographyProps={{ fontWeight: 'bold' }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
      {notification.visible && (
        <Notification
          type={notification.type as 'error' | 'success'}
          message={notification.message}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      )}
    </Dialog>
  );
};

export default SearchUserModal;
