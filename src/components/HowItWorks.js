import React from 'react';
import { motion } from 'framer-motion';
import './HowItWorks.css';
import discoverGif from '../assets/animations/discover.gif';
import connectGif from '../assets/animations/connect.gif';
import scaleGif from '../assets/animations/scale.gif';

const HowItWorks = () => {
  const steps = [
    { num: "01", title: "Discover Your Path", gif: discoverGif, desc: "Tell us what you're curious about." },
    { num: "02", title: "Connect to Access", gif: connectGif, desc: "Get matched with vetted mentors." },
    { num: "03", title: "Scale Your Future", gif: scaleGif, desc: "Apply directly and build your life." }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="how-section">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="section-title"
        >
          How It <span className="blue">Works</span>
        </motion.h2>
        
        <motion.div 
          className="steps-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} className="step-card" variants={cardVariants}>
              <div className="step-icon-container">
                <img src={step.gif} alt={step.title} className="step-gif" />
                <span className="step-number-pill">{step.num}</span>
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;