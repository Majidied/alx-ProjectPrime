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
import { sendContactRequest } from '../../api/contactsApi';
import Notification from '../Notification/Notification';
import { AxiosError } from 'axios';
import { useUserSearch } from '../../hooks/useUserSearch';
import { useAvatar } from '../../hooks/useAvatar';

interface SearchUserModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchUserModal: React.FC<SearchUserModalProps> = ({ open, onClose }) => {
  const {
    searchTerm,
    setSearchTerm,
    searchResult,
    isLoading,
    error,
    refetch,
  } = useUserSearch();
  const searchAvatar = useAvatar(searchResult?._id || '');

  const handleSearch = () => {
    // Trigger the search logic here
    setSearchTerm(searchTerm);
  };
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
        message: ((error as AxiosError).response?.data as { error: string })?.error ||
          'An error occurred. Please try again.',
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
          {isLoading && <div className='h-full flex justify-center'>Loading...</div>}
            {error && <div className='flex flex-col items-center justify-center w-full'>
            <div className='text-center'>
              Error: {error.message}
            </div>
            <Button onClick={() => refetch()} color="primary" className='mt-2'>
              Reload
            </Button>
            </div>}
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
                src={searchAvatar.avatarUrl || undefined}
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
