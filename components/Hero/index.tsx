import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowRight, Sparkles, Zap, Globe, Code2, Palette } from 'lucide-react';

/* ─── Rotating words ──────────────────────────────── */
const WORDS_EN = ['Websites', 'Brands',   'Apps',      'Campaigns', 'Experiences'];
const WORDS_KM = ['វេបសាយ',   'ម៉ាក',    'Apps',      'យុទ្ធនាការ','បទពិសោធន៍' ];

const RotatingWord: React.FC<{ t: (en:string,km?:string)=>string }> = ({ t }) => {
  const [idx, setIdx]  = useState(0);
  const [prev, setPrev] = useState<number|null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx(c => { setPrev(c); return (c + 1) % WORDS_EN.length; });
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block align-bottom" style={{ minWidth: '5ch' }}>
      {prev !== null && (
        <span key={`p${prev}`} className="hero-word-prev absolute inset-0" aria-hidden>
          {t(WORDS_EN[prev], WORDS_KM[prev])}
        </span>
      )}
      <span key={`c${idx}`} className="hero-word-current">
        {t(WORDS_EN[idx], WORDS_KM[idx])}
      </span>
    </span>
  );
};

/* ─── Floating service pills ──────────────────────── */
const PILLS = [
  { icon: Globe,   label: 'Web Dev',     color: '#6366f1', delay: 0    },
  { icon: Code2,   label: 'App Dev',     color: '#06b6d4', delay: 0.5  },
  { icon: Palette, label: 'Graphic',     color: '#a855f7', delay: 1    },
  { icon: Zap,     label: 'Marketing',   color: '#ec4899', delay: 1.5  },
];

/* ─── Particle canvas ─────────────────────────────── */
const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = canvas.width  = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let raf: number;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - d/100)})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    draw();

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
    />
  );
};

/* ─── 3D Orb Visual ───────────────────────────────── */
const HeroOrb: React.FC = () => {
  const orbRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!orbRef.current) return;
    const rect = orbRef.current.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = ((e.clientY - cy) / rect.height) * 18;
    const ry   = ((e.clientX - cx) / rect.width)  * -18;
    orbRef.current.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (orbRef.current)
      orbRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }, []);

  useEffect(() => {
    const el = orbRef.current;
    if (!el) return;
    el.addEventListener('mousemove', onMouseMove as EventListener);
    el.addEventListener('mouseleave', onMouseLeave);
    return () => {
      el.removeEventListener('mousemove', onMouseMove as EventListener);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [onMouseMove, onMouseLeave]);

  return (
    <div
      ref={orbRef}
      className="relative w-full aspect-square max-w-[480px] mx-auto
                 transition-transform duration-300 will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full animate-spin-slow opacity-30"
           style={{ background: 'conic-gradient(from 0deg, transparent 30%, #6366f1, #a855f7, #ec4899, transparent 70%)' }} />

      {/* Orbit rings */}
      <div className="absolute inset-[8%] rounded-full border border-brand-500/15 animate-spin-slow" />
      <div className="absolute inset-[16%] rounded-full border border-accent-500/10 animate-spin-reverse" />

      {/* Core sphere */}
      <div className="absolute inset-[22%] rounded-full overflow-hidden animate-float"
           style={{
             background: 'radial-gradient(circle at 35% 35%, #818cf8, #6366f1 40%, #1e1b4b 70%, #000 100%)',
             boxShadow: '0 0 60px rgba(99,102,241,0.5), 0 0 120px rgba(99,102,241,0.2), inset 0 0 40px rgba(0,0,0,0.5)',
           }}>
        {/* Surface scan line */}
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
             style={{ animation: 'scanLine 3s ease-in-out infinite' }} />
        {/* Specular highlight */}
        <div className="absolute top-[15%] left-[20%] w-[30%] h-[20%] rounded-full
                        bg-white/20 blur-sm transform rotate-[-20deg]" />
      </div>

      {/* Orbiting dots */}
      {[0, 90, 180, 270].map((deg, i) => (
        <div key={i}
             className="absolute inset-0 animate-spin-slow"
             style={{ animationDelay: `${-i * 1.5}s` }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
               style={{ background: ['#6366f1','#a855f7','#ec4899','#06b6d4'][i],
                        boxShadow: `0 0 8px ${['#6366f1','#a855f7','#ec4899','#06b6d4'][i]}` }} />
        </div>
      ))}

      {/* Floating pill cards */}
      {PILLS.map((p, i) => {
        const positions = [
          'top-[5%]  right-[-8%]',
          'bottom-[20%] right-[-12%]',
          'bottom-[5%]  left-[2%]',
          'top-[25%]   left-[-12%]',
        ];
        const Icon = p.icon;
        return (
          <div key={i}
               className={`absolute ${positions[i]} flex items-center gap-2
                          px-3 py-1.5 rounded-full backdrop-blur-md
                          border border-white/10 bg-black/50
                          animate-float text-xs font-semibold whitespace-nowrap`}
               style={{ animationDelay: `${p.delay}s`,
                        boxShadow: `0 0 12px ${p.color}40` }}>
            <Icon size={12} style={{ color: p.color }} />
            <span className="text-white/80">{p.label}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Stats strip ─────────────────────────────────── */
const STATS = [
  { value: '300+', label: 'Projects' },
  { value: '50+',  label: 'Clients'  },
  { value: '5★',   label: 'Rating'   },
  { value: '24h',  label: 'Delivery' },
];

/* ─── Hero Ticker ─────────────────────────────────── */
const TICKER_ITEMS = [
  'Web Development', 'Brand Identity', 'Mobile Apps',
  'UI/UX Design', 'Motion Graphics', 'Video Editing',
  'Digital Marketing', 'Architecture 3D', 'Translation',
];

const HeroTicker: React.FC = () => (
  <div className="relative w-full overflow-hidden border-y border-white/[0.04] py-3.5 bg-black/50 backdrop-blur-sm">
    <div className="flex animate-marquee gap-0 whitespace-nowrap">
      {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-3 px-6">
          <Sparkles size={10} className="text-brand-500 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/30
                           hover:text-white/70 transition-colors duration-300 cursor-default">
            {item}
          </span>
        </span>
      ))}
    </div>
  </div>
);

/* ─── Main Hero ───────────────────────────────────── */
const Hero: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const y = window.scrollY;
      sectionRef.current.style.setProperty('--scroll-y', `${y}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black"
    >
      {/* Particle field */}
      <ParticleCanvas />

      {/* Grid background */}
      <div className="grid-bg" />

      {/* Ambient glow blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full
                      opacity-20 animate-blob"
           style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)',
                    filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full
                      opacity-15 animate-blob"
           style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)',
                    filter: 'blur(80px)', animationDelay: '3s' }} />
      <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full
                      opacity-10 animate-blob"
           style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)',
                    filter: 'blur(60px)', animationDelay: '6s' }} />

      {/* Header spacer */}
      <div className="h-24" />

      {/* Main grid */}
      <div className="container-xl relative z-10 flex-1 flex items-center py-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">

          {/* ── Left: Copy ── */}
          <div className="space-y-8 text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full
                            bg-brand-500/8 border border-brand-500/20 backdrop-blur-sm
                            animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              <span className="text-xs font-bold text-green-400 tracking-widest uppercase">
                {t('Open for new projects', 'ទទួលគម្រោងថ្មីៗ')}
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2" style={{ animationDelay: '0.2s' }}>
              <h1 className="heading-hero text-white font-black">
                <span className="block overflow-hidden">
                  <span className="block animate-slide-up" style={{ animationDelay: '0.25s' }}>
                    {t('We Craft', 'យើងបង្កើត')}
                  </span>
                </span>

                {/* Gradient animated word */}
                <span className="block overflow-hidden">
                  <span className="block animate-slide-up text-gradient"
                        style={{
                          animationDelay: '0.35s',
                          backgroundImage: 'linear-gradient(90deg,#6366f1,#a855f7,#ec4899,#818cf8)',
                          backgroundSize: '200% auto',
                          animation: 'gradientText 4s ease infinite, slideUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s both',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
                    <RotatingWord t={t} />
                  </span>
                </span>

                {/* Subline */}
                <span className="block text-xl md:text-2xl font-light tracking-wide
                                 text-white/40 mt-2 animate-fade-up"
                      style={{ animationDelay: '0.5s', letterSpacing: '0.08em' }}>
                  {t('Seen & trusted — in days.', 'ឃើញ & ទុកចិត្ត — ក្នុងថ្ងៃ')}
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg text-white/50 leading-relaxed max-w-md mx-auto lg:mx-0
                          font-khmer animate-fade-up"
               style={{ animationDelay: '0.5s' }}>
              {t(
                'Bold digital visuals that make people stop, trust, and contact you.',
                'រូបភាពឌីជីថលខ្លាំងៗ ឲ្យមនុស្សឈប់មើល ទុកចិត្ត និងទាក់ទងអ្នក។'
              )}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start
                            animate-fade-up" style={{ animationDelay: '0.65s' }}>
              <a href="#contact" className="btn-glow group">
                <span>{t('Start a Project', 'ចាប់ផ្ដើមគម្រោង')}</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="#portfolio" className="btn-ghost group">
                <span>{t('View Work', 'មើលស្នាដៃ')}</span>
                <ArrowRight size={16} className="opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
              </a>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-4 gap-4 pt-2 animate-fade-up"
                 style={{ animationDelay: '0.8s' }}>
              {STATS.map((s, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-xl md:text-2xl font-black text-white stat-number">
                    {s.value}
                  </div>
                  <div className="text-[11px] text-white/35 uppercase tracking-widest mt-0.5 font-khmer">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: 3D Orb ── */}
          <div className="flex justify-center lg:justify-end animate-fade-in"
               style={{ animationDelay: '0.4s' }}>
            <HeroOrb />
          </div>
        </div>
      </div>

      {/* Service ticker */}
      <HeroTicker />

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                      animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          {t('Scroll', 'រំកិលចុះ')}
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
