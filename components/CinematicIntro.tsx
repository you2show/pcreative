import React, { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CinematicIntroProps {
  onComplete: () => void;
}

const PHASES = [
  { en: 'We Build', km: 'យើងសង់', delay: 0 },
  { en: 'We Create', km: 'យើងបង្កើត', delay: 1100 },
  { en: 'We Are Ponloe', km: 'យើងគឺ Ponloe', delay: 2200 },
];

const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [activePhase, setActivePhase] = useState(-1);
  const [isExiting, setIsExiting] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  const triggerExit = useCallback(() => {
    setIsExiting(true);
    setTimeout(onComplete, 900);
  }, [onComplete]);

  useEffect(() => {
    // Show skip button after 2s
    const skipTimer = setTimeout(() => setShowSkip(true), 2000);

    // Phase sequencing
    const timers: ReturnType<typeof setTimeout>[] = [];
    PHASES.forEach((phase, i) => {
      timers.push(setTimeout(() => setActivePhase(i), phase.delay));
    });

    // Exit after all phases shown
    timers.push(setTimeout(triggerExit, 3600));

    return () => {
      clearTimeout(skipTimer);
      timers.forEach(clearTimeout);
    };
  }, [triggerExit]);

  return (
    <div
      className={`fixed inset-0 z-[15000] flex flex-col items-center justify-center bg-gray-950 transition-opacity duration-700 ease-in-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backdropFilter: 'blur(0px)' }}
    >
      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E")`,
      }} />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Phrase display */}
      <div className="relative z-10 text-center px-8">
        {PHASES.map((phase, i) => (
          <div
            key={i}
            className={`overflow-hidden transition-all duration-700 ${
              activePhase === i ? 'max-h-40 opacity-100 mb-4' : activePhase > i ? 'max-h-0 opacity-0 mb-0' : 'max-h-0 opacity-0 mb-0'
            }`}
          >
            <p
              className={`font-black tracking-tight font-khmer transition-all duration-700 ${
                i === 2
                  ? 'text-5xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'
                  : 'text-4xl md:text-6xl text-white/80'
              } ${activePhase === i ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease' }}
            >
              {t(phase.en, phase.km)}
            </p>
          </div>
        ))}

        {/* Horizontal scan line */}
        {activePhase >= 0 && (
          <div className="mt-6 h-px w-48 mx-auto bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-60 animate-pulse" />
        )}
      </div>

      {/* Skip button */}
      <button
        onClick={triggerExit}
        className={`absolute bottom-10 right-10 text-xs text-gray-500 hover:text-white border border-gray-700 hover:border-white/30 px-4 py-2 rounded-full transition-all duration-300 uppercase tracking-widest font-bold font-khmer ${
          showSkip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }}
      >
        {t('Skip', 'រំលង')}
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-indigo-500/30 w-full">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          style={{
            width: isExiting ? '100%' : `${Math.max(0, (activePhase / (PHASES.length - 1)) * 85)}%`,
            transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
};

export default CinematicIntro;
