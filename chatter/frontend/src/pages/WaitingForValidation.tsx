import { useState } from 'react';
import { Button, Alert, CircularProgress, AlertColor } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { resendValidationEmail } from '../utils/User';
import { useEffect } from 'react';
import { isVerifiedUser } from '../utils/User';
import socket from '../utils/socket';
import { useUserProfile } from '../hooks/useUserProfile';

const WaitingForValidation = () => {
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    visible: false,
  });
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const user = useUserProfile();

  const handleResendValidation = async () => {
    setLoading(true);
    setResendDisabled(true);
    setNotification({ ...notification, visible: false });

    try {
      await resendValidationEmail();
      setNotification({
        type: 'success',
        message:
          'Validation email resent successfully. Please check your inbox.',
        visible: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        setNotification({
          type: 'error',
          message: 'Failed to resend validation email. Please try again later.',
          visible: true,
        });
      }
    } finally {
      setLoading(false);
      setTimeout(() => setResendDisabled(false), 5000); // Disable button for 5 seconds
    }
  };

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => navigate('/logout'), 1000);
  };

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await isVerifiedUser();

        if (response) {
          navigate('/chat');
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      }
    };

    socket.on('user-verified', (userId: string) => {
      if (userId === user?._id) {
        setNotification({
          type: 'success',
          message: 'Your account has been verified. Redirecting to chat...',
          visible: true,
        });
        setTimeout(() => {
          navigate('/chat');
        }, 1000);
      }
    });

    checkVerification();
  }, [navigate, user?._id]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-amber-100 px-4"
      style={{ backgroundImage: 'linear-gradient(to right, #7FA1C3, #4E31AA)' }}
    >
      <section className="bg-white flex flex-col items-center justify-center w-full max-w-md rounded-lg shadow-lg overflow-hidden backdrop-blur-md p-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-violet-900 bg-clip-text text-transparent">
          Waiting for Validation
        </h1>
        <p className="mb-4 text-gray-700 text-center">
          Your account is currently awaiting validation. Please check your email
          for the validation link.
        </p>
        <p className="mb-8 text-gray-700 text-center">
          If you did not receive the email, you can request to resend the
          validation email.
        </p>
        {notification.visible && (
          <Alert
            severity={notification.type as AlertColor}
            onClose={() => setNotification({ ...notification, visible: false })}
            className="mb-4"
            aria-label={
              notification.type === 'error' ? 'Error Alert' : 'Success Alert'
            }
          >
            {notification.message}
          </Alert>
        )}
        <Button
          onClick={handleResendValidation}
          variant="contained"
          className="bg-blue-500 text-white w-full p-2 mb-4"
          disabled={resendDisabled}
          aria-label="Resend Validation Email"
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Resend Validation Email'
          )}
        </Button>
        <Button
          onClick={handleLogout}
          variant="outlined"
          className="w-full p-2 text-blue-500 border-blue-500"
          style={{ marginTop: '1rem' }}
          disabled={loggingOut}
          aria-label="Logout"
        >
          {loggingOut ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Logout'
          )}
        </Button>
      </section>
    </div>
  );
};

export default WaitingForValidation;
