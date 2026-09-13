'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`w-full flex-1 flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
