import React from 'react';
import { Card, CardContent, Typography, Container, Grid, Button, Badge, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { Chat, Lock, Devices, VerifiedUser } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isNew?: boolean;
  details?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, isNew, details }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          textAlign: 'center',
          padding: '24px',
          boxShadow: theme.shadows[2],
          borderRadius: '12px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: theme.shadows[6],
          },
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 'auto',
          backgroundImage: 'linear-gradient(to right, #4F1787, #5B99C2)',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {isNew && (
          <Badge
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            New
          </Badge>
        )}
        <CardContent>
          <Typography variant="h3" sx={{ marginBottom: '16px', fontSize: '3rem', color: 'white' }}>
            {icon}
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', marginBottom: '12px' }}>
            {title}
          </Typography>
          <Typography sx={{ color: '#F5EDED', marginBottom: expanded ? '16px' : '0', fontSize: '1rem' }}>
            {description}
          </Typography>
          {expanded && details && (
            <Typography sx={{ color: '#F5EDED', marginTop: '12px', fontSize: '0.875rem' }}>
              {details}
            </Typography>
          )}
        </CardContent>
        <Button size="small" onClick={() => setExpanded(!expanded)} sx={{ alignSelf: 'center', marginTop: 'auto', color: '#F5EDED' }}>
          {expanded ? 'Show Less' : 'Read More'}
        </Button>
      </Card>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Chat fontSize="large" />,
      title: 'Instant Messaging',
      description: 'Chat with your friends instantly without any delays.',
      isNew: true,
      details: 'Enjoy the fastest messaging experience with real-time updates and minimal latency.',
    },
    {
      icon: <Lock fontSize="large" />,
      title: 'Secure Login',
      description: 'Your account is safe with secure login options.',
      details: 'We use JWT (JSON Web Tokens) to ensure secure and reliable access to your account.',
    },
    {
      icon: <VerifiedUser fontSize="large" />,
      title: 'Account Verification',
      description: 'Verify your account for added security and trust.',
      details: 'All accounts are verified during registration to maintain a safe environment for everyone.',
    },
    {
      icon: <Devices fontSize="large" />,
      title: 'Cross-Device Access',
      description: 'Access your account from any device, anywhere.',
      details: 'Seamlessly sync your data across all your devices for a consistent experience.',
    },
  ];  

  return (
    <section id='Features'
      style={{
        padding: '80px 0',
        backgroundImage: 'linear-gradient(to right, #7FA1C3, #4E31AA)',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', marginBottom: '48px' }}>
          Features
        </Typography>
        <Grid container spacing={4} alignItems="stretch">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Box sx={{ height: '100%' }}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  isNew={feature.isNew}
                  details={feature.details}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default Features;
