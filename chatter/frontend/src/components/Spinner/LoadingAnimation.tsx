import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingAnimation = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <CircularProgress size={60} sx={{ color: '#007bff' }} />
    </Box>
  );
};

export default LoadingAnimation;
