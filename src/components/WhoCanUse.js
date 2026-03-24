import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Users } from 'lucide-react';
import './WhoCanUse.css';

const WhoCanUse = () => {
  const cards = [
    {
      icon: <Target size={32} className="red" />,
      title: "The Dreamers",
      age: "Ages 14-18",
      desc: "For the high schoolers looking to find their spark. Whether it's a summer camp or a sports team, we provide the access you need to start building your foundation.",
      className: "red-card"
    },
    {
      icon: <Zap size={32} className="blue" />,
      title: "The Hustlers",
      age: "Ages 19-25+",
      desc: "For those transitioning into adulthood. We provide the 'environmental insight'—real talk on navigating professional spaces and finding career-defining programs.",
      className: "blue-card"
    },
    {
      icon: <Users size={32} className="yellow" />,
      title: "The Community",
      age: "All Ages",
      desc: "For the mentors and program leaders who want to hear the voices that usually go overlooked. We connect your resources directly to the kids who need them most.",
      className: "yellow-card"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="who-section" id="who">
      <div className="who-container">
        <motion.div 
          className="who-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-subtitle">WHO & WHY</span>
          <h2 className="section-title">Built for the <span className="yellow">Overlooked.</span></h2>
          <p className="who-intro">
            Whether you're just starting out or trying to level up, KIDS is the bridge 
            between where you are and where you're supposed to be.
          </p>
        </motion.div>

        <motion.div 
          className="who-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {cards.map((card, index) => (
            <motion.div 
              className={`who-card ${card.className}`} 
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className="who-icon-wrapper">{card.icon}</div>
              <h3>{card.title}</h3>
              <span className="age-tag">{card.age}</span>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhoCanUse;