import React, { useState } from 'react';
import { TextField, Button, Container, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import contactImage from '../../assets/me.jpeg';
import { sendEmail } from '../../utils/emailService';
import { Alert } from '@mui/material';

const ContactMe: React.FC = () => {
  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // State for error messages and success feedback
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    const newErrors = { name: '', email: '', message: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (newErrors.name || newErrors.email || newErrors.message) {
      setErrors(newErrors);
    } else {
      setIsSubmitting(true);

      const isSuccess = await sendEmail({ name, email, message });

      setIsSubmitting(false);

      if (isSuccess) {
        setSuccessMessage('Your message has been sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
        setErrors({ name: '', email: '', message: '' });
      } else {
        setSuccessMessage(
          'Failed to send your message. Please try again later.'
        );
      }

      // Hide success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  };

  return (
    <section
      id="ContactMe"
      className="py-20 bg-gray-100"
      style={{
        backgroundImage: 'linear-gradient(to right, #7FA1C3, #4E31AA)',
      }}
    >
      <h1 className="text-4xl font-bold text-center mb-10 text-white">
        Contact Me
      </h1>
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
        }}
      >
        <motion.div
          className="lg:w-1/2 w-full mb-10 lg:mb-0 h-[300px] lg:h-[430px] rounded-lg overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <img
            src={contactImage}
            alt="Contact"
            className="rounded-lg shadow-lg object-cover w-full h-full"
          />
        </motion.div>

        <motion.div
          className="lg:w-1/2 w-full lg:ml-10 h-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <form
            className="bg-white p-8 shadow-lg rounded-lg w-full"
            style={{ minHeight: '300px' }}
            onSubmit={handleSubmit}
          >
            <div className="mb-6">
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                InputLabelProps={{
                  style: { color: '#6A82FB' },
                }}
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
                className="mb-4"
              />
            </div>

            <div className="mb-6">
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                InputLabelProps={{
                  style: { color: '#6A82FB' },
                }}
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
                className="mb-4"
              />
            </div>

            <div className="mb-6">
              <TextField
                fullWidth
                label="Message"
                variant="outlined"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                error={!!errors.message}
                helperText={errors.message}
                InputLabelProps={{
                  style: { color: '#6A82FB' },
                }}
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundImage: 'linear-gradient(to right, #6A82FB, #FC5C7D)',
                color: 'white',
                padding: '12px 24px',
                fontSize: '1rem',
                borderRadius: '8px',
              }}
              className="w-full transform transition-transform hover:scale-105"
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Send Message'
              )}
            </Button>
            {successMessage && (
              <div className="mt-4" style={{ position: 'relative' }}>
                <Alert severity="success">{successMessage}</Alert>
              </div>
            )}
          </form>
        </motion.div>
      </Container>
    </section>
  );
};

export default ContactMe;
