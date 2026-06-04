import React, { useEffect, useRef } from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];
const getLanguagePrefix = () => {
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment && supportedLangs.includes(firstSegment) ? `/${firstSegment}` : '';
};
const navigateTo = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith('/')) return;
  event.preventDefault();
  window.history.pushState(null, '', `${getLanguagePrefix()}${href}` || '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const ClosingCTA: React.FC = () => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated mesh gradient via canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      time += 0.004;

      ctx.clearRect(0, 0, w, h);

      // 3 animated blobs
      const blobs = [
        { x: w * 0.2 + Math.sin(time) * w * 0.1, y: h * 0.4 + Math.cos(time * 0.8) * h * 0.2, r: w * 0.35, color: 'rgba(99,102,241,0.22)' },
        { x: w * 0.75 + Math.cos(time * 1.1) * w * 0.1, y: h * 0.5 + Math.sin(time * 1.3) * h * 0.15, r: w * 0.3, color: 'rgba(168,85,247,0.18)' },
        { x: w * 0.5 + Math.sin(time * 0.6) * w * 0.08, y: h * 0.7 + Math.cos(time * 0.9) * h * 0.1, r: w * 0.25, color: 'rgba(236,72,153,0.14)' },
      ];

      blobs.forEach(b => {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-gray-950 py-24 md:py-36"
      aria-labelledby="closing-cta-title"
    >
      {/* Animated mesh background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
      />

      {/* Top border glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/50 backdrop-blur-xl mb-8 font-khmer">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          {t('Ready to start?', 'ត្រៀមចាប់ផ្ដើម?')}
        </div>

        {/* Main headline */}
        <h2
          id="closing-cta-title"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-[-0.04em] text-white font-khmer mb-6"
        >
          {t('Your next client is', 'Client បន្ទាប់របស់អ្នក')}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            {t('searching right now.', 'កំពុងស្វែងរកឥឡូវ។')}
          </span>
        </h2>

        {/* Sub copy */}
        <p className="text-lg md:text-xl text-white/50 font-khmer leading-relaxed max-w-2xl mx-auto mb-12">
          {t(
            "Let's make sure they find something they can't ignore.",
            'ចូរអោយពួកគេឃើញអ្វីមួយដែលពួកគេមិនអាចមើលរំលងបាន។'
          )}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            onClick={e => navigateTo(e, '/contact')}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-black text-gray-950 hover:bg-indigo-100 shadow-2xl shadow-white/10 hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 font-khmer"
          >
            {t('Get a Free Quote', 'ទទួលការផ្ដល់តម្លៃ')}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/projects"
            onClick={e => navigateTo(e, '/projects')}
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-black text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-300 font-khmer backdrop-blur-sm"
          >
            <Eye size={17} />
            {t('See Our Work', 'មើលស្នាដៃ')}
          </a>
        </div>

        {/* Trust row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/30">
          <span className="text-xs font-bold font-khmer">{t('No commitment required', 'មិនតម្រូវ commitment')}</span>
          <span className="h-3 w-px bg-white/10" />
          <span className="text-xs font-bold font-khmer">{t('Reply within 24 hours', 'ឆ្លើយក្នុង 24 ម៉ោង')}</span>
          <span className="h-3 w-px bg-white/10" />
          <span className="text-xs font-bold font-khmer">{t('Khmer · English · Arabic', 'ខ្មែរ · English · Arabic')}</span>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTA;
