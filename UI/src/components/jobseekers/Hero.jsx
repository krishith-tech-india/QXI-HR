import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative py-20 corporate-gradient text-white">
      <div className="absolute inset-0 hero-pattern opacity-10"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow">
            Find Your Dream Job
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Explore opportunities, submit your CV, and take the next step in your career
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;