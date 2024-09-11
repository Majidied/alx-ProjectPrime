import React, { useState, ChangeEvent } from 'react';
import { Avatar, Badge, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useProfileContext } from '../../contexts/UseProfileContext';
import { uploadAvatar } from '../../utils/User';
import Notification from '../Notification/Notification';

const UserAvatar: React.FC = () => {
  const { user, avatarUrl } = useProfileContext();
  const [notification, setNotification] = useState({
    type: 'error',
    message: '',
    visible: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    avatarUrl || ''
  );
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB file size limit
        setNotification({
          type: 'error',
          message: 'File size exceeds 5MB limit.',
          visible: true,
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      p={2}
      bgcolor="#D1E9F6"
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
          {loading ? (
            <CircularProgress size={50} />
          ) : (
            <Avatar sx={{ width: 50, height: 50 }} src={previewUrl || avatarUrl || ''} />
          )}
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
