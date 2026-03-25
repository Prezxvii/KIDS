import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

/**
 * Hero Component
 * Uses a direct path to the public folder to bypass React bundling issues.
 * This prevents the "Black Screen" caused by corrupted Git LFS pointers.
 */
const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-container">
      <div className="hero-content">
        <motion.div 
          className="hero-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            Kickin' Incredibly <br />
            <span className="text-blue">Dope</span> Systems.
          </h1>
          <p className="hero-tagline">
            Growing up in the Bronx, I saw how environment shapes your future. 
            <strong> KIDS</strong> was built to bridge the gap between talent and access.
          </p>
          <div className="hero-buttons">
            <button className="btn-main" onClick={() => navigate('/resources')}>
              Explore Opportunities
            </button>
            <button className="btn-outline" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn Our Story
            </button>
          </div>
        </motion.div>

        <motion.div className="hero-right" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="hero-glass-card">
            <div className="card-inner">
              <video 
                className="hero-video" 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="auto"
              >
                {/* Reference the file directly from the public folder */}
                <source src="/kids-hero-final.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;