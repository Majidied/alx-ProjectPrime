import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import LoadingAnimation from '../components/Spinner/LoadingAnimation';
import notFoundImage from '../assets/not-found.png';

const NotFoundPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <LoadingAnimation />
  ) : (
    <div className="flex items-center justify-center h-screen text-gray-800 bg-gradient-to-r from-blue-200 via-purple-300 to-pink-300">
      <div className="relative flex flex-col justify-between bg-white bg-opacity-30 backdrop-blur-md rounded-lg p-10 shadow-lg w-full h-full max-w-4xl mx-auto">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80 rounded-lg"
          style={{ backgroundImage: `url(${notFoundImage})` }}
          aria-hidden="true"
        ></div>
        {/* Content */}
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center space-y-6">
          {/* Other content can go here */}
        </div>
        {/* Button at the bottom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative z-10 w-full flex justify-center"
        >
          <Link to="/chat" aria-label="Back to Home">
            <Button
              variant="contained"
              color="primary"
              size="large"
              className="px-6 py-3"
              style={{
                backgroundImage: 'linear-gradient(to right, #7FA1C3, #4E31AA)',
              }}
            >
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
