import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-container">
      <div className="hero-content">
        <div className="hero-left">
           {/* Your existing text/buttons code here */}
        </div>

        <div className="hero-right">
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
                {/* Use the plain string path. React knows to look in /public */}
                <source src="/kids-hero-final.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;