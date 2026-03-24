import React from 'react';
import { motion } from 'framer-motion';
import { Telescope, Unlock, Map } from 'lucide-react';
import './WhyJoin.css';

const WhyJoin = () => {
  const benefitVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <section className="why-section">
      <div className="container why-grid">
        <div className="why-text">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why Join <span className="red">K</span><span className="blue">I</span><span className="yellow">D</span><span className="blue">S</span>?
          </motion.h2>
          <motion.p 
            className="why-intro"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            In the Bronx, talent is everywhere, but the "outlets" are limited. 
            KIDS was built to help you find the path to whatever you’ve dreamed of becoming.
          </motion.p>
          
          <div className="benefits-list">
            {[
              { icon: <Telescope size={20} />, title: "Explore New Paths", desc: "Discover careers and hobbies you didn't even know existed, from tech and arts to niche sports.", color: "blue-bg" },
              { icon: <Unlock size={20} />, title: "Unlock Hidden Resources", desc: "We find the programs and mentors that are usually hidden behind 'who you know' and bring them to you.", color: "red-bg" },
              { icon: <Map size={20} />, title: "A Better Outlet", desc: "Stop settling for what's just 'around the corner.' Connect with high-level opportunities across the city.", color: "yellow-bg" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="benefit"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={benefitVariants}
              >
                <div className={`icon ${item.color}`}>{item.icon}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="why-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
        >
          <div className="glossy-stat-card">
            <div className="stat-item">
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >UNLIMITED</motion.h3>
              <p>Potential</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >ZERO</motion.h3>
              <p>Gatekeepers</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyJoin;