import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-container">
      <div className="hero-content">

        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
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
            <motion.button
              className="btn-main"
              onClick={() => navigate('/resources')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Opportunities
            </motion.button>
            <motion.button
              className="btn-outline"
              onClick={() => {
                const el = document.getElementById('about');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Learn Our Story
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="hero-glass-card">
            <div className="card-inner">
              <video 
                className="hero-video" 
                autoPlay 
                loop 
                muted 
                playsInline
              >
                {/* Correct path for file in the public folder */}
                <source src="/hero-video.mp4" type="video/mp4" />
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