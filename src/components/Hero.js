import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-container">
      <div className="hero-content">
        <motion.div className="hero-left" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="hero-title">Kickin' Incredibly <br /><span className="text-blue">Dope</span> Systems.</h1>
          <p className="hero-tagline">
            Growing up in the Bronx, I saw how environment shapes your future. 
            <strong> KIDS</strong> was built to bridge the gap between talent and access.
          </p>
          <div className="hero-buttons">
            <button className="btn-main" onClick={() => navigate('/resources')}>Explore Opportunities</button>
            <button className="btn-outline" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>Learn Our Story</button>
          </div>
        </motion.div>

        <motion.div className="hero-right" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="hero-glass-card">
            <div className="card-inner">
              {/* Swapping Video for Image */}
              <img 
                src="/hero-bg.jpg" 
                alt="KIDS Hero" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '30px' }} 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;