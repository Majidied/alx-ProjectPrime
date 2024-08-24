import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logoutImage from '../assets/logout.png'; // Import the image

const Logout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleLogout();
    }
  }, [countdown]);

  const handleLogout = () => {
    setToken(null);
    navigate('/', { replace: true });
  };

  return (
    <div className="flex items-center justify-center h-screen text-gray-800 bg-gradient-to-r from-blue-200 via-purple-300 to-pink-300">
      <div className="relative flex flex-col items-center justify-center bg-white bg-opacity-30 backdrop-blur-md rounded-lg p-10 shadow-lg w-full h-full max-w-4xl mx-auto">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80 rounded-lg"
          style={{
            backgroundImage: `url(${logoutImage})`,
          }}
        ></div>
        {/* Content */}
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-extrabold text-purple-700">
            Logging out in {countdown} seconds...
          </h2>
          <p className="text-xl mt-4 text-pink-700">
            Thank you for chatting with us! See you soon.
          </p>
          {/* Progress bar */}
          <div className="w-full bg-gray-300 bg-opacity-50 rounded-full mt-6">
            <div
              className="bg-gradient-to-r from-green-400 via-yellow-500 to-red-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(4 - countdown) * 33.33}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
