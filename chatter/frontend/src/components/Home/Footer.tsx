import React from 'react';
import { Typography, Grid, Link, Box } from '@mui/material';
import { FaTwitter, FaInstagram, FaLinkedinIn, FaGithub, FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer id='About' className="bg-gray-800 text-gray-400 py-8">
      <Typography variant="h6" className="text-white mb-4 text-center">
        Follow Me
      </Typography>
      <Box className="flex justify-center space-x-4 p-2">
        <motion.div
          whileHover={{ scale: 1.2, color: '#FC5C7D' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link href="mailto:mohammedmajidi321@gmail.com" className="block hover:text-white" aria-label="Gmail">
            <FaGoogle size={24} />
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.2, color: '#FC5C7D' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link href="https://www.linkedin.com/in/mohammed-majidi" className="block hover:text-white" aria-label="LinkedIn">
            <FaLinkedinIn size={24} />
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.2, color: '#FC5C7D' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link href="https://github.com/majidied" className="block hover:text-white" aria-label="GitHub">
            <FaGithub size={24} />
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.2, color: '#FC5C7D' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link href="https://twitter.com/majidied" className="block hover:text-white" aria-label="Twitter">
            <FaTwitter size={24} />
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.2, color: '#FC5C7D' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link href="https://www.instagram.com/majidied" className="block hover:text-white" aria-label="Instagram">
            <FaInstagram size={24} />
          </Link>
        </motion.div>
      </Box>
      <Grid container justifyContent="center" className="text-center mt-4">
        <Grid item xs={12} md={3}>
          <Typography variant="body2">&copy; 2024 Chatter. All rights reserved.</Typography>
        </Grid>
      </Grid>
    </footer>
  );
};

export default Footer;
