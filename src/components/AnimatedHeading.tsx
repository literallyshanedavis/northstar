import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedHeaderProps {
  h1: string;
  h2: string;
  h3: string;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ h1, h2, h3 }) => {
  // Define animation variants for Framer Motion
  const textVariants = {
    hidden: { y: 200 }, // The text starts 20px below its final position
    visible: { y: 0 }  // The text ends at its final position
  };

  // Define the transition for the motion elements
  const transition = {
    duration: 1.0,
    ease: [0.6, 0.05, -0.01, 0.9],
  };

  return (
    <div className="flex gap-y-2 sm:block">
      <div className="overflow-hidden">
        <motion.h1
          className="text-8xl text-secondary bg-gradient-to-r from-gradient-start via-gradient-end-60 to-gradient-end bg-clip-text text-transparent"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ ...transition, delay: 0.2 }}
        >
          {h1}
        </motion.h1>
      </div>
      <div className="overflow-hidden">
        <motion.h1
          className="text-8xl text-white"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ ...transition, delay: 0.4 }}
        >
          {h2}
        </motion.h1>
      </div>
      <div className="overflow-hidden">
        <motion.h1
          className="text-8xl text-white"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ ...transition, delay: 0.6 }}
        >
          {h3}
        </motion.h1>
      </div>
    </div>
  );
};

export default AnimatedHeader;
