import React, { useState, ChangeEvent } from 'react';
import { Avatar, Badge, Box, Typography, IconButton } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useUserAvatar } from '../../hooks/useUserAvatar';
import { uploadAvatar } from '../../utils/User';
import Notification from '../Notification/Notification';

const UserAvatar: React.FC = () => {
  const user = useUserProfile();
  const avatarUrl = useUserAvatar();
  const [notification, setNotification] = useState({
    type: 'error',
    message: '',
    visible: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    avatarUrl || ''
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Call handleFileUpload after setting the file
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      await uploadAvatar(file);
      setNotification({
        type: 'success',
        message: 'Avatar uploaded successfully.',
        visible: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        setNotification({
          type: 'error',
          message: error.message,
          visible: true,
        });
      }
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      p={2}
      bgcolor="background.paper"
      borderRadius="12px"
    >
      <IconButton component="label" sx={{ ml: 2 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <CircleIcon style={{ color: 'green', width: 15, height: 15 }} />
          }
        >
          <Avatar
            src={previewUrl || avatarUrl || ''}
            alt={user?.name || 'User Avatar'}
            sx={{ width: 70, height: 70 }}
          />
        </Badge>
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </IconButton>
      <Box ml={2}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {user?.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          @{user?.username}
        </Typography>
      </Box>
      {notification.visible && (
        <Notification
          type={notification.type as 'error' | 'success'}
          message={notification.message}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      )}
    </Box>
  );
};

export default UserAvatar;
