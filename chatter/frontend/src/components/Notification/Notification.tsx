import { useEffect } from 'react';
import { Alert } from '@mui/material';

interface NotificationProps {
  type: 'success' | 'error' | 'warning'; // Added 'warning'
  message: string;
  onClose: () => void;
}

const Notification = ({ type, message, onClose }: NotificationProps) => {
  // Set background color based on the type of notification
  const backgroundColor =
    type === 'success'
      ? 'bg-green-400 border-green-500'
      : type === 'error'
      ? 'bg-red-400 border-red-500'
      : 'bg-yellow-400 border-yellow-500'; // Added 'warning' case

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 seconds

    // Cleanup the timer if the component is unmounted before the timeout
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 border-2 rounded-lg ${backgroundColor} text-white p-4 flex items-center`}
    >
      <Alert severity={type}>
        {message}
        <button
          className="ml-4 bg-inherit text-black rounded-full px-2"
          onClick={onClose}
        >
          ✖️
        </button>
      </Alert>
    </div>
  );
};

export default Notification;
