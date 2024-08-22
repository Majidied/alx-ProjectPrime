import { Avatar, Badge, Box, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useEffect, useState } from 'react';
import { Contact } from '../../utils/Contact';
import { getUserContact, getContactAvatar } from '../../utils/User';

export default function ContactItem({ contactId }: { contactId: string }) {
  const [contact, setContact] = useState({} as Contact);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  contact.message = 'Hello, how are you? I hope you are doing well. I am doing great.';
    useEffect(() => {
      const fetchContact = async () => {
        try {
          const contact = await getUserContact(contactId);
          setContact(contact as Contact);
        } catch (error) {
          console.error('Failed to fetch contact:', error);
        }
      };

      const fetchAvatar = async () => {
        try {
          const avatarFile = await getContactAvatar(contactId);
          const avatarBlob = avatarFile as unknown as Blob;
          const avatarUrl = URL.createObjectURL(avatarBlob);
          setAvatarUrl(avatarUrl);
        } catch (error) {
          console.error('Failed to fetch avatar:', error);
        }
      };

      fetchContact();
      fetchAvatar();

      return () => {
        if (avatarUrl) {
          URL.revokeObjectURL(avatarUrl);
        }
      };
    }, [avatarUrl, contactId]);

  return (
    <Box className="flex items-center justify-between p-1 ml-4 mr-4 bg-white rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer">
      <Box className="flex items-center">
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <CircleIcon
              className="text-green-500"
              style={{ width: 12, height: 12 }}
            />
          }
        >
          <Avatar
            src={avatarUrl || `https://i.pravatar.cc/150?u=${contactId}`}
            alt={contact.name}
            sx={{ width: 48, height: 48 }}
          />
        </Badge>
        <Box ml={2}>
          <div className="flex items-center justify-between">
            <Typography className="text-gray-900 font-semibold text-base">
              {contact.name || 'Unknown Name'}
            </Typography>
          </div>
          <Typography variant="body2" className="text-gray-600 text-sm truncate w-40">
            { contact.message || 'No recent messages'}
          </Typography>
        </Box>
      </Box>
      <Box className="flex flex-col items-end ml-4">
        <Typography variant="body2" className="text-gray-500 text-xs mb-1">
          {contact.time || '10:00 AM'}
        </Typography>
        {
          <Badge
            badgeContent={5}
            color="primary"
            className="mt-1"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: 'rgb(33, 150, 243)',
                color: 'white',
                minWidth: 20, // Ensure the badge is large enough for the content
                height: 20,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem', // Adjust font size as needed
              },
            }}
          />
        }
      </Box>
    </Box>
  );
}
