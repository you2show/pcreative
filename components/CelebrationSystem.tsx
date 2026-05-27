import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// ─────────────────────────────────────────────
// Canvas Confetti
// ─────────────────────────────────────────────

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'star';
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#f97316'];

function createParticle(x: number, y: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = 4 + Math.random() * 8;
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.3,
    size: 6 + Math.random() * 8,
    opacity: 1,
    shape: (['rect', 'circle', 'star'] as const)[Math.floor(Math.random() * 3)],
  };
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const angle2 = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
    if (i === 0) ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    else ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    ctx.lineTo(cx + (r / 2) * Math.cos(angle2), cy + (r / 2) * Math.sin(angle2));
  }
  ctx.closePath();
}

interface ConfettiCanvasProps {
  active: boolean;
  onDone: () => void;
}

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ active, onDone }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Burst from multiple points
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.4;
    particlesRef.current = Array.from({ length: 120 }, () => createParticle(
      cx + (Math.random() - 0.5) * 200,
      cy + (Math.random() - 0.5) * 100,
    ));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => p.opacity > 0.02);

      if (particlesRef.current.length === 0) {
        onDone();
        return;
      }

      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.012;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, p.size / 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, onDone]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[14000] pointer-events-none"
    />
  );
};

// ─────────────────────────────────────────────
// Toast Notification
// ─────────────────────────────────────────────

interface ToastProps {
  message: string;
  emoji?: string;
  visible: boolean;
  onClose: () => void;
  variant?: 'success' | 'info' | 'easter';
}

export const CelebrationToast: React.FC<ToastProps> = ({ message, emoji = '🎉', visible, onClose, variant = 'success' }) => {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onClose, 5000);
      return () => clearTimeout(t);
    }
  }, [visible, onClose]);

  const bgClass = {
    success: 'from-indigo-600 to-purple-600',
    info: 'from-cyan-600 to-blue-600',
    easter: 'from-pink-600 to-rose-600',
  }[variant];

  return (
    <div
      className={`fixed bottom-8 left-1/2 z-[13000] transition-all duration-500 ease-out ${
        visible ? '-translate-x-1/2 translate-y-0 opacity-100' : '-translate-x-1/2 translate-y-16 opacity-0 pointer-events-none'
      }`}
    >
      <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r ${bgClass} text-white shadow-2xl shadow-indigo-500/30 border border-white/10 max-w-sm backdrop-blur-md`}>
        <span className="text-2xl flex-shrink-0">{emoji}</span>
        <p className="font-bold text-sm font-khmer leading-snug">{message}</p>
        <button onClick={onClose} className="ml-2 text-white/60 hover:text-white text-xs">✕</button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Scroll Complete Badge
// ─────────────────────────────────────────────

export const ScrollCompleteBadge: React.FC = () => {
  const { t } = useLanguage();
  const [shown, setShown] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (shown) return;
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled >= total - 100) {
        setShown(true);
        setVisible(true);
        setTimeout(() => setVisible(false), 6000);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [shown]);

  return (
    <div
      className={`fixed bottom-8 right-8 z-[13000] transition-all duration-700 ease-out ${
        visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center gap-1 px-5 py-4 rounded-2xl bg-gray-900/90 border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 text-center backdrop-blur-md">
        <span className="text-3xl">🏆</span>
        <p className="text-white font-black text-xs uppercase tracking-widest font-khmer">
          {t('Explorer!', 'អ្នករុករក!')}
        </p>
        <p className="text-gray-400 text-[10px] font-khmer">
          {t('You discovered everything', 'អ្នករកឃើញអ្វីៗទាំងអស់')}
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Return Visitor Greeting
// ─────────────────────────────────────────────

export const ReturnVisitorGreeting: React.FC = () => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const visits = parseInt(localStorage.getItem('ponloe_visit_count') || '0', 10) + 1;
    localStorage.setItem('ponloe_visit_count', String(visits));

    if (visits >= 2) {
      const timer = setTimeout(() => setVisible(true), 3500);
      const hideTimer = setTimeout(() => setVisible(false), 9000);
      return () => { clearTimeout(timer); clearTimeout(hideTimer); };
    }
  }, []);

  return (
    <div
      className={`fixed top-24 right-6 z-[12500] transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-900/90 border border-purple-500/30 shadow-xl shadow-purple-500/20 backdrop-blur-md max-w-xs">
        <span className="text-2xl">👋</span>
        <div>
          <p className="text-white font-bold text-xs font-khmer">{t('Welcome back!', 'សូមស្វាគមន៍ម្ដងទៀត!')}</p>
          <p className="text-gray-400 text-[10px] font-khmer">{t('Good to see you again', 'ពីរ​ណីដែលបានជួបម្ដងទៀត')}</p>
        </div>
        <button onClick={() => setVisible(false)} className="text-gray-600 hover:text-white text-xs ml-1">✕</button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Team Member Easter Egg
// ─────────────────────────────────────────────

export function useTeamEasterEgg() {
  const hoveredSequence = useRef<string[]>([]);
  const lastHoverTime = useRef(0);
  const [easterEggTriggered, setEasterEggTriggered] = useState(false);

  const trackHover = useCallback((memberId: string) => {
    const now = Date.now();
    // Reset sequence if too much time passed
    if (now - lastHoverTime.current > 3000) {
      hoveredSequence.current = [];
    }
    lastHoverTime.current = now;

    if (!hoveredSequence.current.includes(memberId)) {
      hoveredSequence.current.push(memberId);
    }

    if (hoveredSequence.current.length >= 5) {
      setEasterEggTriggered(true);
      hoveredSequence.current = [];
      setTimeout(() => setEasterEggTriggered(false), 6000);
    }
  }, []);

  return { trackHover, easterEggTriggered };
}

// ─────────────────────────────────────────────
// Easter Egg Overlay
// ─────────────────────────────────────────────

export const EasterEggOverlay: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { t } = useLanguage();

  return (
    <div
      className={`fixed inset-0 z-[14500] flex items-center justify-center pointer-events-none transition-all duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className={`text-center transition-all duration-700 ${visible ? 'scale-100 translate-y-0' : 'scale-50 translate-y-20'}`}>
        <div className="text-6xl mb-4 animate-bounce">🌟</div>
        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-400 font-khmer mb-2">
          {t('You Found Us All!', 'អ្នករកឃើញពួកយើងទាំងអស់!')}
        </h2>
        <p className="text-white/60 text-lg font-khmer">
          {t('The whole Ponloe team says hi! 👋', 'ក្រុម Ponloe ទាំងអស់ ជំរាបសួរ! 👋')}
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Celebrations Orchestrator
// ─────────────────────────────────────────────

interface CelebrationSystemProps {
  onFormSubmit?: boolean;
}

const CelebrationSystem: React.FC<CelebrationSystemProps> = () => {
  return (
    <>
      <ReturnVisitorGreeting />
      <ScrollCompleteBadge />
    </>
  );
};

export default CelebrationSystem;
