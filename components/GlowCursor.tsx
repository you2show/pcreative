import React, { useEffect, useRef, useCallback } from 'react';

const GlowCursor: React.FC = () => {
  const cursorRef  = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const posRef     = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });
  const rafRef     = useRef<number>(0);
  const isHovering = useRef(false);

  const animate = useCallback(() => {
    const ease = isHovering.current ? 0.12 : 0.08;
    followerPos.current.x += (posRef.current.x - followerPos.current.x) * ease;
    followerPos.current.y += (posRef.current.y - followerPos.current.y) * ease;

    if (followerRef.current) {
      followerRef.current.style.transform =
        `translate(${followerPos.current.x - 20}px, ${followerPos.current.y - 20}px)`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const onEnter = () => {
      isHovering.current = true;
      cursorRef.current?.classList.add('scale-[3]', 'opacity-0');
      followerRef.current?.classList.add('scale-150', 'border-brand-400', 'bg-brand-500/10');
    };
    const onLeave = () => {
      isHovering.current = false;
      cursorRef.current?.classList.remove('scale-[3]', 'opacity-0');
      followerRef.current?.classList.remove('scale-150', 'border-brand-400', 'bg-brand-500/10');
    };

    const interactives = document.querySelectorAll('a,button,[data-magnetic]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [animate]);

  return (
    <>
      {/* Dot cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2
                   rounded-full bg-white mix-blend-difference
                   transition-transform duration-100 will-change-transform gpu"
      />
      {/* Ring follower */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none w-10 h-10
                   rounded-full border border-white/30
                   transition-[transform,border-color,background-color] duration-300
                   will-change-transform gpu"
      />
    </>
  );
};

export default GlowCursor;
