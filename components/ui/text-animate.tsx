'use client';

import React from "react"

import { motion } from 'motion/react';

interface TextAnimateProps {
  text: string;
  type?: 'fadeInUp' | 'slideInLeft' | 'slideInRight' | 'fadeIn';
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  delay?: number;
  stagger?: number;
}

export const TextAnimate = ({
  text,
  type = 'fadeInUp',
  className = '',
  style,
  duration = 0.5,
  delay = 0,
  stagger = 0.05,
}: TextAnimateProps) => {
  const variants: Record<string, any> = {
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    slideInLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
    },
    slideInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
  };

  const selectedVariant = variants[type];

  return (
    <motion.span
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      transition={{ duration, delay }}
      className={className}
      style={style}
    >
      {text}
    </motion.span>
  );
};

export default TextAnimate;
