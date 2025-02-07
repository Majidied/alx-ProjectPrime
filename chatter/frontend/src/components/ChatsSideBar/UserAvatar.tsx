import React from 'react';
import { Avatar, Badge, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useUserProfile, useUserAvatar } from '../../hooks/useUser';
import { useUploadAvatar } from '../../hooks/useUploadProfile';
import Notification from '../Notification/Notification';

const UserAvatar: React.FC = () => {
  const { userProfile: user } = useUserProfile();
  const { avatarUrl, isLoading: avatarLoading } = useUserAvatar();
  const { previewUrl, handleFileChange, isLoading, notification, setNotification } = useUploadAvatar();

  return (
    <Box display="flex" alignItems="center" p={2} bgcolor="#D1E9F6" borderRadius="12px">
      <IconButton component="label" sx={{ ml: 2 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<CircleIcon style={{ color: 'green', width: 15, height: 15 }} />}
        >
          {(avatarLoading || isLoading) ? (
            <CircularProgress size={50} />
          ) : (
            <Avatar sx={{ width: 50, height: 50 }} src={previewUrl || avatarUrl || ''} />
          )}
        </Badge>
        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
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
