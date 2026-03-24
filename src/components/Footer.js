import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  // Animation variants for the footer content
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <footer className="footer">
      <motion.div 
        className="footer-content"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={footerVariants}
      >
        <div className="footer-logo">
          <motion.span 
            className="red"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >K</motion.span>
          <motion.span 
            className="blue"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
          >I</motion.span>
          <motion.span 
            className="yellow"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >D</motion.span>
          <motion.span 
            className="blue"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.15 }}
          >S</motion.span>
        </div>

        <p>© 2026 KIDS Platform. Kickin' Incredibly Dope Systems.</p>

        <div className="footer-links">
          <motion.a 
            href="#privacy"
            whileHover={{ color: "#EE272E", x: 2 }}
          >
            Privacy
          </motion.a>
          <motion.a 
            href="#terms"
            whileHover={{ color: "#2B88D8", x: 2 }}
          >
            Terms
          </motion.a>
          <motion.a 
            href="mailto:contact@kids.com"
            whileHover={{ color: "#FDB813", x: 2 }}
          >
            Contact
          </motion.a>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;