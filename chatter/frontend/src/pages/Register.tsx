import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@mui/material';
import { Button } from '@mui/material';
import Notification from '../components/Notification/Notification';

const Register = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    visible: false,
  });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError(''); // Clear any previous errors
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    try {
      // Replace with actual registration logic
      const response = await fakeRegister(email, password); // Placeholder for actual API call
      if (response && (response as { success: boolean })) {
        setNotification({
          type: 'success',
          message: 'Registration successful! Redirecting...',
          visible: true,
        });
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Registration error:', error.message);
        setError(
          'Sorry, something went wrong. Please check your connection and try again.'
        );
        setNotification({
          type: 'error',
          message: 'An error occurred. Please try again.',
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
          style={{ backgroundImage: `url('src/assets/register.jpg')` }} // Replace with your register page image
        >
          <h1 className="text-5xl font-bold text-black mb-4 bg-gradient-to-r from-cyan-600 to-violet-900 bg-clip-text text-transparent">
            Join{' '}
            <span className="bg-gradient-to-r from-cyan-600 to-violet-900 bg-clip-text text-transparent">
              Chatter
            </span>
            !
          </h1>
          <p className="bg-gradient-to-r from-violet-950 to-cyan-800 bg-clip-text text-transparent text-xl">
            Sign up to connect with your friends and family.
          </p>
        </div>
        <div className="flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg w-full h-screen md:w-1/2 md:h-full ">
          {/* Mobile view with background image */}
          <div
            className="bg-cover bg-center h-64 flex flex-col items-center justify-center rounded-lg md:hidden"
            style={{ backgroundImage: `url('src/assets/register.jpg')` }}
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-violet-900 bg-clip-text text-transparent">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-violet-900 to-cyan-600 bg-clip-text text-transparent">
                Chatter
              </span>
              !
            </h1>
          </div>
          <h1 className="text-4xl font-bold mb-4 hidden md:block">Register</h1>
          <p className="mb-4 text-gray-700">
            Please fill in the form to create an account.
          </p>
          <div className="w-full p-4">
            {notification.visible && (
              <Notification
                type={error ? 'error' : 'success'}
                message={notification.message}
                onClose={() =>
                  setNotification({ ...notification, visible: false })
                }
              />
            )}
            <label className="block text-sm font-medium text-gray-700">
              username
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 p-2 w-full"
              placeholder="Enter your username"
            />
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

              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                className="mb-4 p-2 w-full"
                placeholder="Confirm your password"
              />
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

// Placeholder for actual registration logic
const fakeRegister = (email: string, password: string) => {
  return new Promise((resolve) => {
    console.log(
      `Registering user with email: ${email} and password: ${password}`
    );
    setTimeout(() => resolve({ success: true }), 1000);
  });
};

export default Register;
