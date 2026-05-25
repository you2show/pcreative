import React from 'react';

/**
 * SkipToContent - Accessibility component for keyboard navigation
 * Shows only on focus (Tab key), allowing screen reader and keyboard users to skip navigation
 */
const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:bg-indigo-600 focus:text-white focus:px-6 focus:py-3 focus:rounded-xl focus:text-sm focus:font-bold focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white transition-all"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
