import React, { useState } from 'react';
import { Grid, IconButton, Badge } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';
import { useNavigate } from 'react-router-dom';

export default function UserBar() {
  const { notifications, decreaseNotification } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <Grid container alignItems="center" justifyContent="space-between" className="p-2 rounded-md" style={{ position: 'relative' }}>
      <Grid item>
        <IconButton size="small" className="text-gray-600" onClick={handleNotificationClick}>
          <Badge badgeContent={notifications} color="secondary">
            <NotificationsActiveIcon />
          </Badge>
        </IconButton>
        {dropdownOpen && (
          <NotificationDropdown onClose={handleCloseDropdown} onDecline={decreaseNotification} />
        )}
      </Grid>

      <Grid item>
        <IconButton size="small" className="text-gray-600">
          <SettingsIcon />
        </IconButton>
        <IconButton size="small" className="text-red-600" onClick={() => navigate('/logout')}>
          <LogoutIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
