
import React, { useEffect, useState } from 'react';
import PonloeLogo from './PonloeLogo';

const Preloader: React.FC = () => {
  const [isFinished, setIsFinished] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Disable scroll when preloader is active
    document.body.style.overflow = 'hidden';

    // Show logo for 800ms then exit — no count-up blocker
    const exitTimer = setTimeout(() => {
      setIsFinished(true);
      setTimeout(() => {
        document.body.style.overflow = '';
        setShowContent(true);
      }, 700);
    }, 800);

    return () => {
      clearTimeout(exitTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (showContent) return null;

  return (
    <div 
      className={`fixed inset-0 z-[11000] flex flex-col items-center justify-center bg-gray-950 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isFinished ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className={`flex flex-col items-center gap-4 transition-opacity duration-400 ${isFinished ? 'opacity-0' : 'opacity-100'}`}>
         {/* Pulsing Brand Logo */}
         <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full animate-pulse"></div>
            <div className="relative z-10 animate-float">
                <PonloeLogo size={120} />
            </div>
         </div>
         
         <p className="text-gray-500 font-khmer text-xs tracking-[0.4em] uppercase mt-4 opacity-60">
            Ponloe Creative
         </p>
      </div>
    </div>
  );
};

export default Preloader;
