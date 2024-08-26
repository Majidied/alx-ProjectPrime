import { AxiosError } from 'axios';
import { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Alert, AlertColor } from '@mui/material';
import { register } from '../utils/User';

const Register = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    type: '',
    message: '',
    visible: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, username, email, password, confirmPassword } = formData;
  const isPasswordMatch = password === confirmPassword;

  const isValidEmail = useCallback(
    (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254,
    []
  );

  const isValidPassword = useCallback(
    (password: string) =>
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /\W/.test(password),
    []
  );

  const isValidUsername = useCallback(
    (username: string) => /^[^\s]+$/.test(username) && username.length >= 3,
    []
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    [setFormData]
  );

  const handleRegister = async () => {
    if (!isPasswordMatch) {
      setNotification({
        type: 'error',
        message: 'Passwords do not match. Please try again.',
        visible: true,
      });
      return;
    }

    if (!isValidEmail(email)) {
      setNotification({
        type: 'error',
        message: 'Invalid email format. Please enter a valid email.',
        visible: true,
      });
      return;
    }

    if (!isValidPassword(password)) {
      setNotification({
        type: 'error',
        message:
          'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character.',
        visible: true,
      });
      return;
    }

    if (!isValidUsername(username)) {
      setNotification({
        type: 'error',
        message: 'Username should be at least 3 characters long and contain no spaces.',
        visible: true,
      });
      return;
    }

    try {
      const response = await register(name, username, email, password);

      if (response) {
        setToken((response as { token: string })?.token);
        setNotification({
          type: 'success',
          message: 'Registration successful! Redirecting...',
          visible: true,
        });
        setTimeout(() => navigate('/verify', { replace: true }), 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage =
        (error as AxiosError<{ error: string }>)?.response?.data?.error ||
        'An error occurred. Please try again.';
      setNotification({
        type: 'error',
        message: errorMessage,
        visible: true,
      });
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-amber-100"
      style={{ backgroundImage: 'linear-gradient(to right, #7FA1C3, #4E31AA)' }}
    >
      <section className="bg-white flex flex-col md:flex-row items-center justify-center w-full max-w-4xl rounded-lg shadow-lg overflow-hidden backdrop-blur-md">
        <div
          className="hidden md:flex flex-col items-center justify-center bg-cover bg-center h-full w-1/2 rounded-l-lg p-28"
          style={{ backgroundImage: `url('src/assets/register.jpg')`}}
        >
          <h1 className="text-5xl font-bold text-black mb-4 bg-gradient-to-r from-cyan-600 to-violet-900 bg-clip-text text-transparent">
            Join <span>Chatter</span>!
          </h1>
          <p className="bg-gradient-to-r from-violet-950 to-cyan-800 bg-clip-text text-transparent text-xl">
            Sign up to connect with your friends and family.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-white p-8 md:p-12 w-full md:w-1/2 h-auto md:h-full">
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
          <div className="w-full">
            {notification.visible && (
              <Alert
                severity={notification.type as AlertColor}
                onClose={() => setNotification({ ...notification, visible: false })}
                className="mb-4"
              >
                {notification.message}
              </Alert>
            )}
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  name="name"
                  value={name}
                  onChange={handleChange}
                  className="mb-4 p-2 w-full"
                  placeholder="Enter your name"
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  name="username"
                  value={username}
                  onChange={handleChange}
                  className="mb-4 p-2 w-full"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              name="email"
              value={email}
              onChange={handleChange}
              className="mb-4 p-2 w-full"
              placeholder="Enter your email address"
            />
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  name="password"
                  value={password}
                  onChange={handleChange}
                  type="password"
                  className={`mb-2 p-2 w-full ${
                    !isPasswordMatch && confirmPassword !== ''
                      ? 'border-red-500'
                      : ''
                  }`}
                  placeholder="Enter your password"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  type="password"
                  className={`mb-2 p-2 w-full ${
                    !isPasswordMatch && confirmPassword !== ''
                      ? 'border-red-500'
                      : ''
                  }`}
                  placeholder="Confirm your password"
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
            className="bg-blue-500 text-white w-full p-2 mt-4"
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
