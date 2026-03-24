import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const brandColors = ['#EE272E', '#2B88D8', '#FDB813'];

  const faqs = [
    { 
      q: "Is this only for people from the Bronx?", 
      a: "I built this from the Bronx, for the Bronx—but the mission is bigger. KIDS is for any young New Yorker who feels like the standard 'path' wasn't built for them. If you're looking for an outlet, you're in the right place." 
    },
    { 
      q: "Does it cost anything to join?", 
      a: "No. Access is the biggest barrier to success, so KIDS is 100% free. Our goal is to connect you to existing high-level resources, programs, and mentorships without a paywall." 
    },
    { 
      q: "What if I don't know what I want to do?", 
      a: "That’s exactly why we’re here. Most kids only choose from the 3 or 4 careers they see in their neighborhood. We show you the other 1,000 options—from coding and UI design to sports management and cinematography." 
    },
    { 
      q: "I'm 20+, is this too late for me?", 
      a: "Never. We categorize our resources by age for a reason. Whether you're a 14-year-old looking for a summer camp or a 24-year-old looking for a career pivot, there is a system here designed to kick you off." 
    }
  ];

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <motion.h2 
          className="section-title center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="red">F</span><span className="blue">A</span><span className="yellow">Q</span>
        </motion.h2>
        
        <div className="faq-list">
          {faqs.map((f, i) => {
            const color = brandColors[i % brandColors.length];
            const isOpen = activeIndex === i;

            return (
              <motion.div 
                key={i} 
                className="faq-wrapper" 
                style={{ marginBottom: '15px' }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.div 
                  className={`faq-item ${isOpen ? 'active' : ''}`} 
                  onClick={() => setActiveIndex(isOpen ? null : i)}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="faq-header-content">
                    <div 
                      className="faq-badge" 
                      style={{ backgroundColor: color }}
                    >
                      {i + 1}
                    </div>
                    <div className="faq-question">
                      <h4>{f.q}</h4>
                      <motion.div 
                        animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.2 : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={20} color={color} />
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div 
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="answer-inner">
                          <p>{f.a}</p>
                          <motion.div 
                            className="answer-accent-line" 
                            style={{ backgroundColor: color }}
                            initial={{ width: 0 }}
                            animate={{ width: "40px" }}
                            transition={{ delay: 0.2 }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;