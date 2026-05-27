import React, { useEffect, useRef, useState, useCallback } from 'react';

type CursorMode = 'default' | 'link' | 'button' | 'image' | 'team' | 'text';

interface TrailDot {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
}

const MODE_CONFIG: Record<CursorMode, { dotColor: string; ringSize: number; ringColor: string; label?: string }> = {
  default: { dotColor: '#6366f1', ringSize: 32, ringColor: 'rgba(255,255,255,0.4)' },
  link:    { dotColor: '#a855f7', ringSize: 44, ringColor: 'rgba(168,85,247,0.5)', label: '→' },
  button:  { dotColor: '#ec4899', ringSize: 52, ringColor: 'rgba(236,72,153,0.4)', label: '✦' },
  image:   { dotColor: '#06b6d4', ringSize: 56, ringColor: 'rgba(6,182,212,0.4)', label: '⊕' },
  team:    { dotColor: '#f59e0b', ringSize: 60, ringColor: 'rgba(245,158,11,0.4)', label: '◎' },
  text:    { dotColor: '#10b981', ringSize: 28, ringColor: 'rgba(16,185,129,0.3)' },
};

const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');
  const [trails, setTrails] = useState<TrailDot[]>([]);

  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const trailIdRef = useRef(0);
  const lastTrailTime = useRef(0);
  const rafRef = useRef<number>(0);

  const detectMode = useCallback((target: HTMLElement): CursorMode => {
    const el = target.closest('a, button, [role="button"], [class*="cursor-pointer"], img, [data-team]') as HTMLElement | null;
    if (!el) return 'default';
    if (el.closest('[data-team]') || el.closest('.team-member')) return 'team';
    if (el.tagName === 'IMG') return 'image';
    if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' || el.classList.contains('cta-button')) return 'button';
    if (el.tagName === 'A') return 'link';
    if (el.classList.contains('cursor-pointer')) return 'button';
    return 'default';
  }, []);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;
    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Ink trail throttled to ~30fps
      const now = performance.now();
      if (now - lastTrailTime.current > 33) {
        lastTrailTime.current = now;
        const newDot: TrailDot = {
          id: ++trailIdRef.current,
          x: e.clientX,
          y: e.clientY,
          opacity: 0.6,
          size: 4 + Math.random() * 4,
        };
        setTrails(prev => [...prev.slice(-18), newDot]);
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      setMode(detectMode(e.target as HTMLElement));
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Animate ring with lerp
    const animate = () => {
      const lerpFactor = 0.12;
      ring.current.x += (mouse.current.x - ring.current.x) * lerpFactor;
      ring.current.y += (mouse.current.y - ring.current.y) * lerpFactor;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouse.current.x}px,${mouse.current.y}px,0) translate(-50%,-50%)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ring.current.x}px,${ring.current.y}px,0) translate(-50%,-50%)`;
      }

      // Fade out trails
      setTrails(prev =>
        prev
          .map(d => ({ ...d, opacity: d.opacity - 0.04, size: d.size * 0.96 }))
          .filter(d => d.opacity > 0.01)
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [detectMode]);

  if (!isVisible) return null;

  const cfg = MODE_CONFIG[mode];

  return (
    <>
      {/* Ink splash trails */}
      {trails.map(dot => (
        <div
          key={dot.id}
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[99998]"
          style={{
            transform: `translate3d(${dot.x}px,${dot.y}px,0) translate(-50%,-50%)`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: cfg.dotColor,
            opacity: dot.opacity,
            filter: `blur(${dot.size * 0.4}px)`,
            transition: 'none',
          }}
        />
      ))}

      {/* Main cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[100001] mix-blend-difference transition-all duration-150"
        style={{
          width: mode === 'default' ? '10px' : '8px',
          height: mode === 'default' ? '10px' : '8px',
          backgroundColor: cfg.dotColor,
          boxShadow: `0 0 8px ${cfg.dotColor}, 0 0 16px ${cfg.dotColor}60`,
        }}
      />

      {/* Follower ring with context label */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[100000] flex items-center justify-center"
        style={{
          width: `${cfg.ringSize}px`,
          height: `${cfg.ringSize}px`,
          border: `1.5px solid ${cfg.ringColor}`,
          boxShadow: mode !== 'default' ? `0 0 20px ${cfg.ringColor}, inset 0 0 20px ${cfg.ringColor}20` : 'none',
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          backgroundColor: mode !== 'default' ? `${cfg.dotColor}08` : 'transparent',
          backdropFilter: mode !== 'default' ? 'blur(2px)' : 'none',
        }}
      >
        {cfg.label && (
          <span
            className="text-white/70 font-bold select-none"
            style={{ fontSize: '13px', lineHeight: 1, color: cfg.dotColor }}
          >
            {cfg.label}
          </span>
        )}
      </div>
    </>
  );
};

export default CustomCursor;