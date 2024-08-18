import { AxiosError } from 'axios';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Alert } from '@mui/material';
import { register } from '../utils/User';
import Notification from '../components/Notification/Notification';

const Register = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    visible: false,
  });

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isPasswordMatch = password === confirmPassword;

  const handleRegister = async () => {
    if (!isPasswordMatch) {
      setNotification({
        type: 'error',
        message: 'Passwords do not match. Please try again.',
        visible: true,
      });
      return;
    }

    try {
      const response = await register(name, username, email, password);

      if (response && 'token' in response) {
        setToken(response.token as string);
        setNotification({
          type: 'success',
          message: 'Registration successful! Redirecting...',
          visible: true,
        });
        setTimeout(() => navigate('/home', { replace: true }), 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if ((error as AxiosError).isAxiosError) {
        setNotification({
          type: 'error',
          message:
            ((error as AxiosError).response?.data as { error: string })
              ?.error || 'An error occurred. Please try again.',
          visible: true,
        });
      }
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-amber-100"
      style={{ backgroundImage: 'linear-gradient(to right, #7FA1C3, #4E31AA)' }}
    >
      <section className="bg-white flex flex-col md:flex-row items-center justify-center h-3/4 rounded-lg backdrop-blur-md">
        <div
          className="bg-cover bg-center p-8 rounded-lg shadow-lg w-full md:w-1/2 h-full flex-col justify-center items-center text-center hidden md:flex"
          style={{ backgroundImage: `url('src/assets/register.jpg')` }}
        >
          <h1 className="text-5xl font-bold text-black mb-4 bg-gradient-to-r from-cyan-600 to-violet-900 bg-clip-text text-transparent">
            Join <span>Chatter</span>!
          </h1>
          <p className="bg-gradient-to-r from-violet-950 to-cyan-800 bg-clip-text text-transparent text-xl">
            Sign up to connect with your friends and family.
          </p>
        </div>
        <div className="flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg w-full h-screen md:w-1/2 md:h-full">
          <div
            className="bg-cover bg-center h-64 flex flex-col items-center justify-center rounded-lg md:hidden"
            style={{ backgroundImage: `url('src/assets/register.jpg')` }}
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-violet-900 bg-clip-text text-transparent">
              Welcome to <span>Chatter</span>!
            </h1>
          </div>
          <h1 className="text-4xl font-bold mb-4 hidden md:block">Register</h1>
          <p className="mb-4 text-gray-700">
            Please fill in the form to create an account.
          </p>
          <div className="w-full p-4">
            {notification.visible && (
              <Notification
                type={notification.type as 'success' | 'error'}
                message={notification.message}
                onClose={() =>
                  setNotification({ ...notification, visible: false })
                }
              />
            )}
            <div className="flex flex-col md:flex-row">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4 p-2 w-full"
                placeholder="Enter your name"
              />
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4 p-2 w-full"
                placeholder="Enter your username"
              />
            </div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 p-2 w-full"
              placeholder="Enter your email address"
            />
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className={`mb-2 p-2 w-full ${
                    !isPasswordMatch && confirmPassword !== ''
                      ? 'border-red-500'
                      : ''
                  }`}
                  placeholder="Enter your password"
                />
              </div>

              <div className="w-full md:w-1/2 mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className={`mb-2 p-2 w-full ${
                    !isPasswordMatch && confirmPassword !== ''
                      ? 'border-red-500'
                      : ''
                  }`}
                  placeholder="Confirm your password"
                  style={{
                    borderColor:
                      !isPasswordMatch && confirmPassword !== '' ? 'red' : '',
                    color:
                      !isPasswordMatch && confirmPassword !== '' ? 'red' : '',
                  }}
                />
                {!isPasswordMatch && confirmPassword !== '' && (
                  <Alert severity="error" className="text-sm">
                    Passwords do not match
                  </Alert>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={handleRegister}
            variant="contained"
            className="bg-blue-500 text-white w-full p-2 mb-4"
          >
            Register
          </Button>
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 underline">
              Log in
            </Link>{' '}
            and join the fun!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Register;
