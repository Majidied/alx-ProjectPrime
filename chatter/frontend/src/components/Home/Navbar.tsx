import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

const Navbar: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      className="bg-white shadow-md"
      style={{
        backgroundImage: 'linear-gradient(to right, #7FA1C3, #4E31AA)',
      }}
    >
      <Toolbar className="flex justify-between">
        <Typography variant="h6" className="text-2xl font-bold text-blue-500">
          Chatter
        </Typography>
        <div className="hidden md:flex space-x-6">
          <ScrollLink to="Home" smooth={true} duration={500}>
            <Button color="inherit">Home</Button>
          </ScrollLink>
          <ScrollLink to="Features" smooth={true} duration={500}>
            <Button color="inherit">Features</Button>
          </ScrollLink>
          <ScrollLink to="Technologies" smooth={true} duration={500}>
            <Button color="inherit">Technologies</Button>
          </ScrollLink>
          <ScrollLink to="ContactMe" smooth={true} duration={500}>
            <Button color="inherit">Contact</Button>
          </ScrollLink>
          <ScrollLink to="About" smooth={true} duration={500}>
            <Button color="inherit">Social Media</Button>
          </ScrollLink>
        </div>
        <RouterLink to="/login">
          <Button
            variant="contained"
            style={{
              backgroundImage: 'linear-gradient(to right, #7FA1C3, #4E31AA)',
              color: 'white',
            }}
          >
            Sign In
          </Button>
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
