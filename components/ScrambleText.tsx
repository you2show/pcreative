import React, { useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

// Returns true if the string only contains ASCII printable characters
const isLatinOnly = (str: string) => /^[\x00-\x7F]*$/.test(str);

interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: boolean;          // external trigger (defaults to IntersectionObserver)
  delay?: number;             // ms before animation starts
  duration?: number;          // total scramble duration in ms
  as?: keyof React.JSX.IntrinsicElements;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  trigger,
  delay = 0,
  duration = 900,
  as: Tag = 'span',
}) => {
  const [displayed, setDisplayed] = useState(text);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const raf = useRef<number | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scramble = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    // For non-Latin text (e.g. Khmer), skip scramble and just reveal instantly
    if (!isLatinOnly(text)) {
      timeout.current = setTimeout(() => setDisplayed(text), delay);
      return;
    }

    timeout.current = setTimeout(() => {
      const start = performance.now();
      const len = text.length;

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Characters resolve left-to-right as progress advances
        const resolvedCount = Math.floor(progress * len);

        setDisplayed(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' ';
              if (i < resolvedCount) return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );

        if (progress < 1) {
          raf.current = requestAnimationFrame(tick);
        } else {
          setDisplayed(text);
        }
      };

      raf.current = requestAnimationFrame(tick);
    }, delay);
  };

  // External trigger support
  useEffect(() => {
    if (trigger === true) scramble();
  }, [trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  // IntersectionObserver auto-trigger (when no external trigger is passed)
  useEffect(() => {
    if (trigger !== undefined) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scramble();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  return (
    // @ts-ignore – dynamic tag
    <Tag ref={ref} className={className} aria-label={text}>
      {displayed}
    </Tag>
  );
};

export default ScrambleText;
