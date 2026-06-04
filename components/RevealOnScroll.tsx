
import React, { useEffect, useRef, useState } from 'react';

type RevealVariant = 'fade-up' | 'fade-down' | 'slide-left' | 'slide-right' | 'zoom-in' | 'blur-in' | 'grow-x' | 'cinematic-up' | 'mask-in' | 'tilt-in' | 'float-in';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: RevealVariant;
  threshold?: number;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  duration = 820, // Slightly longer for premium cinematic reveals
  variant = 'cinematic-up',
  threshold = 0.05 // Reduced threshold for earlier triggering
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: threshold,
        rootMargin: '0px 0px -20px 0px' // Slightly less margin for better sync
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.disconnect();
    };
  }, [threshold]);

  const getTransformClasses = () => {
    if (isVisible) return 'opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0 blur-0';

    switch (variant) {
      case 'fade-up':
        return 'opacity-0 translate-y-8'; // Reduced distance for smoother transition
      case 'fade-down':
        return 'opacity-0 -translate-y-8';
      case 'slide-right':
        return 'opacity-0 -translate-x-8';
      case 'slide-left':
        return 'opacity-0 translate-x-8';
      case 'zoom-in':
        return 'opacity-0 scale-[0.98]';
      case 'blur-in':
        return 'opacity-0 blur-sm scale-[1.02]';
      case 'grow-x':
        return 'scale-x-0 opacity-0';
      case 'cinematic-up':
        return 'opacity-0 translate-y-12 scale-[0.975] blur-md';
      case 'mask-in':
        return 'opacity-0 translate-y-8 scale-[0.985] blur-sm reveal-mask-hidden';
      case 'tilt-in':
        return 'opacity-0 translate-y-10 rotate-1 scale-[0.97] blur-sm';
      case 'float-in':
        return 'opacity-0 translate-y-9 -rotate-1 scale-[0.985] blur-sm';
      default:
        return 'opacity-0 translate-y-8';
    }
  };

  return (
    <div
      ref={ref}
      className={`${className} transition-[opacity,transform,filter,clip-path] transform-gpu ${!isVisible ? 'will-change-transform' : ''} ${getTransformClasses()} ${isVisible ? 'reveal-mask-visible' : ''}`}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
