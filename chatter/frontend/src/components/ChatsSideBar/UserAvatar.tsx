import { useState, useEffect } from 'react';
import { Avatar, Badge, Box, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { getUserAvatar, getUserProfile } from '../../utils/User';

function UserAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [user, setUser] = useState({ _id: '', name: '', username: '', email: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const user = await getUserProfile();
        setUser(user);

        // Fetch avatar
        const avatarFile = await getUserAvatar();
        const avatarBlob = avatarFile as unknown as Blob;
        const avatarUrl = URL.createObjectURL(avatarBlob);
        setAvatarUrl(avatarUrl);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();

    // Clean up the avatar URL when the component unmounts
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Box display="flex" alignItems="center" p={2} bgcolor="background.paper" borderRadius="12px">
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <CircleIcon
            style={{ color: 'green', width: 15, height: 15 }}
          />
        }
      >
        <Avatar
          src={avatarUrl || ''}
          alt={user.name}
          sx={{ width: 70, height: 70}}
        />
      </Badge>
      <Box ml={2}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {user.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          @{user.username}
        </Typography>
      </Box>
    </Box>
  );
}

export default UserAvatar;
