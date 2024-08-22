import React, { useState, useEffect } from 'react';
import { Grid, IconButton, Badge } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import socket from '../../utils/socket';
import NotificationDropdown from './NotificationDropdown';

export default function UserBar() {
  const [notifications, setNotifications] = useState<number>(0);
  const [notificationList, setNotificationList] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    // Create an audio object to play the notification sound
    // notification.mp3 is a sound file is in assets folder
    const notificationSound = new Audio('/sounds/notification.wav');
    if (notificationSound) {
      console.log('Notification sound loaded');
      notificationSound.volume = 0.5; // Set the volume to 50
    }

    socket.on('connect', () => {
      console.log('Connected to socket with ID:', socket.id);
    });

    socket.on('contactRequest', ({ senderId }) => {
      // received a contact request senderId
      console.log('Received contact request from:', senderId);
      setNotifications((prev) => prev + 1);
      setNotificationList((prev) => [...prev, senderId]);
      
      // Play the notification sound
      notificationSound.play().catch(error => console.error('Error playing sound:', error));
    });

    return () => {
      socket.off('contactRequest');
    };
  }, []);

  const handleNotificationClick = () => {
    setDropdownOpen(!dropdownOpen); // Toggle the dropdown open state
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <Grid container alignItems="center" justifyContent="space-between" className="p-2 bg-gray-200 border rounded-md" style={{ position: 'relative' }}>
      <Grid item>
        <IconButton size="small" className="text-gray-600" onClick={handleNotificationClick}>
          <Badge badgeContent={notifications} color="secondary">
            <NotificationsActiveIcon />
          </Badge>
        </IconButton>
        {dropdownOpen && (
          <NotificationDropdown notifications={notificationList} onClose={handleCloseDropdown} />
        )}
      </Grid>

      <Grid item>
        <IconButton size="small" className="text-gray-600">
          <SettingsIcon />
        </IconButton>
        <IconButton size="small" className="text-red-600">
          <LogoutIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
