import React from 'react';
import { Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import hero from '../../assets/hero.png';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section
      id='Home'
      className="text-center bg-cover bg-center min-h-screen flex items-center"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="bg-black bg-opacity-50 py-20 h-screen w-full flex flex-col justify-center items-center">
        <Container maxWidth="md" className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Typography
              variant="h2"
              className="font-bold mb-6 text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              style={{ lineHeight: '1.2' }}
            >
              Welcome to My Portfolio
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <Typography
              variant="h5"
              className="text-gray-300 mb-8 text-base sm:text-lg md:text-xl lg:text-2xl"
              style={{ maxWidth: '600px', margin: '0 auto' }}
            >
              Dive into my project, Chatter—a fun and engaging way to connect with friends and communities. I’m excited to share this with you!
            </Typography>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
          >
            <Link to="/register">
              <Button
                variant="contained"
                style={{
                  backgroundImage: 'linear-gradient(to right, #6A82FB, #FC5C7D)',
                  color: 'white',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  borderRadius: '8px',
                }}
                size="large"
                className="transition-transform transform hover:scale-105 text-sm sm:text-base md:text-lg lg:text-xl"
              >
                Explore Now
              </Button>
            </Link>
          </motion.div>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
