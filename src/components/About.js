import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  const textVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-grid">
          <motion.div 
            className="about-image-side"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="story-card">
              {/* YouTube Background Embed - replaces the local .mp4 source */}
              <div className="video-wrapper">
                <iframe 
                  src="https://www.youtube.com/embed/rQ9iHUxcpr4?autoplay=1&mute=1&controls=0&loop=1&playlist=rQ9iHUxcpr4&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3" 
                  title="Yankee Stadium Drone View" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>

              <div className="bronx-tag">EST. THE BRONX</div>
              <div className="card-overlay">
                <h3>"I’m the Kid that did it. I’m the kid that rises above."</h3>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="about-text-side"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.span variants={textVariant} className="section-subtitle">A MESSAGE FROM THE CREATOR</motion.span>
            <motion.h2 variants={textVariant} className="section-title">The Path to <span className="blue">Greatness.</span></motion.h2>
            
            <motion.p variants={textVariant} className="story-paragraph">
              My name is <strong>Timothy Brumell</strong>, and I’m the creator of KIDS. 
              Born in 2000, I got to see it all—from the pure connection of playing 
              outside to the trips and memories that I will cherish forever.
            </motion.p>
            
            <motion.p variants={textVariant} className="story-paragraph italic-text">
              "Sometimes life unfolds in ways you’d never imagine. You just have to believe 
              this is where you’re supposed to be."
            </motion.p>

            <motion.div variants={textVariant} className="mission-list">
              {['Camps & After-School Programs', 'Sports & Knowledge Learning', 'Environmental Insight'].map((item, i) => (
                <div key={i} className="mission-item">
                  <span className={`dot ${['red', 'yellow', 'blue'][i]}-bg`}></span>
                  <p>{item}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;