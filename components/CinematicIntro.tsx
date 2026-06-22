import React, { useEffect, useState, useCallback } from 'react';

interface CinematicIntroProps {
  onComplete: () => void;
}

const WORDS = ['Bold.', 'Clean.', 'Extraordinary.'];

const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [activeWord, setActiveWord] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const triggerExit = useCallback(() => {
    setIsExiting(true);
    setTimeout(onComplete, 1000);
  }, [onComplete]);

  useEffect(() => {
    // Phase sequencing: each word stays for 800ms
    const timers: ReturnType<typeof setTimeout>[] = [];

    WORDS.forEach((_, i) => {
      timers.push(setTimeout(() => setActiveWord(i), i * 900));
    });

    // Exit after all words shown
    timers.push(setTimeout(triggerExit, WORDS.length * 900 + 500));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [triggerExit]);

  return (
    <div
      className={`fixed inset-0 z-[15000] flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative z-10 text-center">
        {WORDS.map((word, i) => (
          <div
            key={i}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
              activeWord === i
                ? 'opacity-100 scale-100 blur-0'
                : 'opacity-0 scale-90 blur-xl pointer-events-none'
            }`}
          >
            <p className="text-4xl md:text-7xl font-black tracking-ultra-tight text-white uppercase font-display">
              {word}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CinematicIntro;
