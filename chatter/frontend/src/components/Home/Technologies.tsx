import React, { useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { FaNodeJs, FaReact } from 'react-icons/fa';
import { SiExpress, SiMongodb, SiRedis, SiSocketdotio, SiTailwindcss } from 'react-icons/si';
import TechnologyCard from './TechnologyCard';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Technologies: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const animation = useAnimation();

  useEffect(() => {
    if (inView) {
      animation.start({
        opacity: 1,
        y: 0,
        transition: { duration: 1 },
      });
    }
  }, [inView, animation]);

  const technologies = [
    {
      icon: <FaNodeJs size={40} color="#339933" />,
      title: 'Node.js',
      description: "JavaScript runtime built on Chrome's V8 engine.",
    },
    {
      icon: <SiExpress size={40} color="#000000" />,
      title: 'Express.js',
      description: 'Fast, unopinionated, minimalist web framework for Node.js.',
    },
    {
      icon: <SiMongodb size={40} color="#47A248" />,
      title: 'MongoDB',
      description: 'NoSQL database program, uses JSON-like documents.',
    },
    {
      icon: <SiRedis size={40} color="#DC382D" />,
      title: 'Redis',
      description: 'In-memory data structure store, used as a database, cache, and message broker.',
    },
    {
      icon: <SiSocketdotio size={40} color="#010101" />,
      title: 'Socket.IO',
      description: 'Enables real-time, bidirectional communication between web clients and servers.',
    },
    {
      icon: <FaReact size={40} color="#61DBFB" />,
      title: 'React.js',
      description: 'A JavaScript library for building user interfaces.',
    },
    {
      icon: <SiTailwindcss size={40} color="#38B2AC" />,
      title: 'Tailwind CSS',
      description: 'A utility-first CSS framework for rapid UI development.',
    },
  ];

  return (
    <section
      id="Technologies"
      style={{
        padding: '80px 0',
        backgroundImage: 'linear-gradient(to right, #7FA1C3, #4E31AA)',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '48px', color: 'white' }}
        >
          Technologies I've Worked With
        </Typography>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={animation}
        >
          <Grid container spacing={4}>
            {technologies.map((tech, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <TechnologyCard
                  icon={tech.icon}
                  title={tech.title}
                  description={tech.description}
                />
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </section>
  );
};

export default Technologies;
