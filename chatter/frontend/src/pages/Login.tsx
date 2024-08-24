import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/User';
import { Input, Button } from '@mui/material';
import Notification from '../components/Notification/Notification';
import { AxiosError } from 'axios';

const Login = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    visible: false,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      const token = (response as { token: string })?.token;
      if (token) {
        setToken(token);
        navigate('/chat', { replace: true });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ error: string }>)?.response?.data?.error ||
        'An error occurred. Please try again.';
      setNotification({
        type: 'error',
        message: errorMessage,
        visible: true,
      });
    }
  };

  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, visible: false }));
      }, 5000); // 5 seconds

      return () => clearTimeout(timer); // Clean up the timer if the component unmounts
    }
  }, [notification]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-amber-100"
         style={{ backgroundImage: 'linear-gradient(to right, #7FA1C3, #4E31AA)' }}>
      <section className="bg-white flex flex-col md:flex-row items-center justify-center h-3/4 rounded-lg backdrop-blur-md">
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg w-full md:w-1/2 h-full">
          {/* Mobile view with background image */}
          <div className="bg-cover bg-center h-64 flex flex-col items-center justify-center rounded-lg md:hidden"
               style={{ backgroundImage: `url('src/assets/login.jpg')` }}>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-violet-900 bg-clip-text text-transparent">
              Welcome back!
            </h1>
          </div>
          <h1 className="text-4xl font-bold mb-4 hidden md:block">Login</h1>
          <p className="mb-4 text-gray-700">Please log in to continue.</p>
          <div className="w-full p-4">
            {notification.visible && (
              <Notification
                type="error"
                message={notification.message}
                onClose={() =>
                  setNotification((prev) => ({ ...prev, visible: false }))
                }
              />
            )}
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 p-2 w-full"
              placeholder="Enter your email address"
            />

            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mb-4 p-2 w-full"
              placeholder="Enter your password"
            />
          </div>
          <Button
            onClick={handleLogin}
            variant="contained"
            className="bg-blue-500 text-white w-full p-2 mb-4"
          >
            Log In
          </Button>
          <p className="mt-4 text-center">
            New here?{' '}
            <Link to="/register" className="text-blue-500 underline">
              Create an account
            </Link>{' '}
            and join the fun!
          </p>
        </div>
        <div
          className="bg-cover bg-center p-8 rounded-lg shadow-lg w-full md:w-1/2 h-full flex flex-col justify-center items-center text-center hidden md:flex"
          style={{ backgroundImage: `url('src/assets/login.jpg')` }}
        >
          <h1 className="text-4xl font-bold text-black mb-4 bg-gradient-to-r from-cyan-600 to-violet-900 bg-clip-text text-transparent">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-violet-900 to-cyan-600 bg-clip-text text-transparent font-bold text-5xl">
              Chatter
            </span>
            !
          </h1>
          <p className="bg-gradient-to-r from-violet-950 to-cyan-800 bg-clip-text text-transparent text-xl">
            Try out our chat app and connect with friends and family.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
