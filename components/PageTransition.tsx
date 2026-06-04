import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children, id, className = '' }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Section reveal animation wrapper
interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'fadeUp' | 'fadeScale' | 'fadeBlur' | 'slideLeft' | 'slideRight' | 'cinematicRise' | 'revealMask' | 'depthPop' | 'parallaxLeft' | 'parallaxRight';
}

const sectionVariants = {
  fadeUp: {
    initial: { opacity: 0, y: 64, scale: 0.975, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  },
  fadeScale: {
    initial: { opacity: 0, scale: 0.92, y: 34, rotateZ: -0.8, filter: 'blur(12px)' },
    animate: { opacity: 1, scale: 1, y: 0, rotateZ: 0, filter: 'blur(0px)' },
  },
  fadeBlur: {
    initial: { opacity: 0, y: 48, scale: 0.985, filter: 'blur(16px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  },
  slideLeft: {
    initial: { opacity: 0, x: -82, y: 18, scale: 0.98, filter: 'blur(10px)' },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' },
  },
  slideRight: {
    initial: { opacity: 0, x: 82, y: 18, scale: 0.98, filter: 'blur(10px)' },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' },
  },
  cinematicRise: {
    initial: { opacity: 0, y: 86, scale: 0.965, rotateX: -10, filter: 'blur(18px)' },
    animate: { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' },
  },
  revealMask: {
    initial: { opacity: 0, y: 46, scale: 0.985, clipPath: 'inset(18% 8% 18% 8% round 2.5rem)', filter: 'blur(12px)' },
    animate: { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 0rem)', filter: 'blur(0px)' },
  },
  depthPop: {
    initial: { opacity: 0, y: 54, scale: 0.9, rotateZ: -1.2, filter: 'blur(14px)' },
    animate: { opacity: 1, y: 0, scale: 1, rotateZ: 0, filter: 'blur(0px)' },
  },
  parallaxLeft: {
    initial: { opacity: 0, x: -96, y: 34, scale: 0.97, filter: 'blur(10px)' },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' },
  },
  parallaxRight: {
    initial: { opacity: 0, x: 96, y: 34, scale: 0.97, filter: 'blur(10px)' },
    animate: { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' },
  },
};

export const SectionTransition: React.FC<SectionTransitionProps> = ({ children, className = '', delay = 0, variant = 'fadeUp' }) => {
  const v = sectionVariants[variant];
  return (
    <motion.div
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once: true, margin: '-120px 0px -80px 0px', amount: 0.18 }}
      transition={{ duration: variant === 'revealMask' ? 1.05 : 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1200, transformOrigin: '50% 72%' }}
      className={`scroll-cinematic-section ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Staggered children animation
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ children, className = '', staggerDelay = 0.1 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
