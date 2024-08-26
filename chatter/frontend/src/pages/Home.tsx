import React from 'react';
import Navbar from '../components/Home/Navbar'
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Footer from '../components/Home/Footer';
import Technologies from '../components/Home/Technologies';
import ContactMe from '../components/Home/ContactMe';
const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Technologies />
      <ContactMe />
      <Footer />
    </div>
  );
};

export default Home;
