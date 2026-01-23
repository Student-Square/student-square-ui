'use client';

import { motion } from 'motion/react';

interface StarPopInProps {
  pacificoClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StarPopIn = ({ pacificoClassName = '', size = 'md' }: StarPopInProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <motion.span
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6, type: 'spring', stiffness: 200 }}
      className={`${sizeClasses[size]} inline-block text-emerald-500`}
      style={{ marginLeft: '8px' }}
    >
      ✨
    </motion.span>
  );
};

export default StarPopIn;
