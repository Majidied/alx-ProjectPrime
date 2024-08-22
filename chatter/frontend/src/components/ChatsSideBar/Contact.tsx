import { Avatar, Badge, Box, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useEffect, useState } from 'react';
import { Contact } from '../../utils/Contact';
import { getUserContact, getContactAvatar } from '../../utils/User';

interface ContactItemProps {
  contactId: string;
}

export default function ContactItem({ contactId }: ContactItemProps) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const fetchedContact = await getUserContact(contactId);
        setContact(fetchedContact as Contact);
      } catch (error) {
        console.error('Failed to fetch contact:', error);
      }
    };

    const fetchAvatar = async () => {
      try {
        const avatarFile = await getContactAvatar(contactId);
        const avatarBlob = avatarFile as unknown as Blob;
        const avatarObjectUrl = URL.createObjectURL(avatarBlob);
        setAvatarUrl(avatarObjectUrl);
      } catch (error) {
        console.error('Failed to fetch avatar:', error);
      }
    };

    fetchContact();
    fetchAvatar();

    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl); // Clean up the object URL
      }
    };
  }, [contactId, avatarUrl]);

  return (
    <Box
      className="flex items-center justify-between p-1 ml-4 mr-4 bg-white rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer"
    >
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
            src={avatarUrl || ''}
            alt={contact?.name || 'Avatar'}
            sx={{ width: 48, height: 48 }}
          />
        </Badge>
        <Box ml={2}>
          <div className="flex items-center justify-between">
            <Typography className="text-gray-900 font-semibold text-base">
              {contact?.name || 'Unknown Name'}
            </Typography>
          </div>
          <Typography variant="body2" className="text-gray-600 text-sm truncate w-40">
            {contact?.message || 'No recent messages'}
          </Typography>
        </Box>
      </Box>
      <Box className="flex flex-col items-end ml-4">
        <Typography variant="body2" className="text-gray-500 text-xs mb-1">
          {contact?.time || '10:00 AM'}
        </Typography>
        <Badge
          badgeContent={5} // Example badge content
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
      </Box>
    </Box>
  );
}
