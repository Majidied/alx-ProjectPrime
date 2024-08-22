import { useState, useEffect } from 'react';
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
import { searchUser, User } from '../../utils/User';
import { sendContactRequest } from '../../utils/Contact';
import Notification from '../Notification/Notification';

function SearchUserModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [notification, setNotification] = useState({
    type: 'error',
    message: '',
    visible: false,
  });

  const handleSendRequest = async (user_Id: string) => {
    try {
      await sendContactRequest(user_Id);
      setNotification({
        type: 'success',
        message: 'Friend request sent successfully.',
        visible: true,
      });
    } catch (error) {
      console.error('Failed to send friend request:', error);
      setNotification({
        type: 'error',
        message: 'Failed to send friend request. Please try again.',
        visible: true,
      });
    }
  };

  const handleSearch = async () => {
    try {
      const user = await searchUser(searchTerm);
      console.log('User:', (user as User)._id);
      setSearchResult(user ? (user as User) : null);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setSearchResult(null);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [searchTerm]);

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
                secondary={'@' + searchResult.username}
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
}

export default SearchUserModal;
