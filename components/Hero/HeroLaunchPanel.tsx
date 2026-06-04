import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Code2, Layers3, MousePointer2, Sparkles, Zap } from 'lucide-react';
import PonloeLogo from '../PonloeLogo';
import { useLanguage } from '../../contexts/LanguageContext';

const orbitItems = [
  { label: 'Brand', labelKm: 'ម៉ាក', icon: Sparkles, color: 'from-fuchsia-400 to-pink-500' },
  { label: 'Web', labelKm: 'វេបសាយ', icon: Code2, color: 'from-indigo-400 to-cyan-400' },
  { label: 'Motion', labelKm: 'ចលនា', icon: Zap, color: 'from-amber-300 to-orange-500' },
  { label: 'System', labelKm: 'ប្រព័ន្ធ', icon: Layers3, color: 'from-emerald-300 to-teal-500' },
];

const HeroLaunchPanel: React.FC = () => {
  const { t } = useLanguage();
  const panelRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrollShift, setScrollShift] = useState(0);

  const particles = useMemo(() => Array.from({ length: 16 }).map((_, index) => ({
    left: `${(index * 23 + 11) % 100}%`,
    top: `${(index * 31 + 17) % 100}%`,
    delay: `${(index % 5) * 0.35}s`,
    size: `${3 + (index % 4)}px`,
  })), []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrollShift(Math.min(window.scrollY * 0.08, 60));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--hero-x', `${x * 18}px`);
    el.style.setProperty('--hero-y', `${y * 18}px`);
    el.style.setProperty('--hero-rotate-x', `${-y * 5}deg`);
    el.style.setProperty('--hero-rotate-y', `${x * 7}deg`);
  };

  const resetMouse = () => {
    const el = panelRef.current;
    if (!el) return;
    el.style.setProperty('--hero-x', '0px');
    el.style.setProperty('--hero-y', '0px');
    el.style.setProperty('--hero-rotate-x', '0deg');
    el.style.setProperty('--hero-rotate-y', '0deg');
  };

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMouse}
      className="group relative mx-auto min-h-[560px] w-full max-w-[620px] [--hero-x:0px] [--hero-y:0px] [--hero-rotate-x:0deg] [--hero-rotate-y:0deg]"
      style={{ perspective: '1200px' }}
      aria-label={t('Creative launch system preview', 'ការបង្ហាញប្រព័ន្ធចាប់ផ្តើមច្នៃប្រឌិត')}
    >
      <div
        className="absolute inset-6 rounded-[3rem] border border-indigo-200/40 bg-white/70 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl transition-transform duration-300 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/30"
        style={{ transform: 'rotateX(var(--hero-rotate-x)) rotateY(var(--hero-rotate-y)) translate3d(var(--hero-x), var(--hero-y), 0)' }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[3rem]">
          <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl transition-transform duration-500 group-hover:scale-125" />
          <div className="absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl transition-transform duration-500 group-hover:scale-125" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[length:42px_42px] opacity-70" />
          {particles.map((particle, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-indigo-300/70 shadow-[0_0_18px_rgba(129,140,248,0.65)] animate-float"
              style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size, animationDelay: particle.delay }}
            />
          ))}
        </div>

        <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/75 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-indigo-600 shadow-lg shadow-indigo-500/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-indigo-200 font-khmer">
              <MousePointer2 size={14} />
              {t('Hover responsive', 'ឆ្លើយតបនឹង Hover')}
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-2 shadow-xl dark:border-white/10 dark:bg-gray-950/70">
              <PonloeLogo size={46} />
            </div>
          </div>

          <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
            <div className="absolute inset-0 rounded-[42%_58%_64%_36%/40%_42%_58%_60%] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl transition-all duration-700 group-hover:rotate-12 group-hover:rounded-[62%_38%_42%_58%/58%_34%_66%_42%]" />
            <div className="absolute inset-6 rounded-full border border-dashed border-indigo-300/50 animate-spin-slow dark:border-white/15" />
            <div className="absolute inset-14 rounded-[38%_62%_46%_54%/54%_39%_61%_46%] border border-white/70 bg-white/55 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl transition-all duration-700 group-hover:rounded-full dark:border-white/10 dark:bg-gray-950/50" />

            {orbitItems.map((item, index) => {
              const Icon = item.icon;
              const angle = (index / orbitItems.length) * Math.PI * 2 - Math.PI / 2 + scrollShift * 0.01;
              const radius = 138;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const active = hovered === index;
              return (
                <button
                  key={item.label}
                  type="button"
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  className={`absolute left-1/2 top-1/2 z-20 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-3xl border bg-white/85 text-gray-950 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:rounded-full dark:border-white/10 dark:bg-gray-950/85 dark:text-white ${active ? 'border-indigo-300 shadow-indigo-500/30' : 'border-gray-200 shadow-black/10'}`}
                  style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${active ? 1.12 : 1})` }}
                >
                  <span className={`mb-1 flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                    <Icon size={16} />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] font-khmer">{t(item.label, item.labelKm)}</span>
                </button>
              );
            })}

            <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-[2.2rem] border border-white/70 bg-white/80 shadow-2xl shadow-indigo-500/20 backdrop-blur-2xl transition-all duration-700 group-hover:rotate-3 group-hover:scale-105 group-hover:rounded-full dark:border-white/10 dark:bg-gray-950/80">
              <div className="absolute inset-[-12px] rounded-[inherit] border border-indigo-300/30 animate-pulse" />
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 text-white dark:bg-white dark:text-gray-950">
                  <Sparkles size={22} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-500 font-khmer">{t('Launch Lab', 'Launch Lab')}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              [t('48h', '48h'), t('First visual draft', 'Draft រូបភាពដំបូង')],
              [t('4 paths', '4 ផ្លូវ'), t('Brand · Web · Media · Systems', 'Brand · Web · Media · Systems')],
              [t('Live', 'Live'), t('Design that reacts', 'Design ដែលឆ្លើយតប')],
            ].map(([value, label]) => (
              <div key={value} className="rounded-2xl border border-gray-200 bg-white/75 p-4 text-center shadow-lg shadow-black/5 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/5">
                <div className="text-xl font-black text-gray-950 dark:text-white">{value}</div>
                <div className="mt-1 text-[10px] font-bold text-gray-500 font-khmer">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-0 z-20 hidden max-w-[230px] rounded-3xl border border-gray-200 bg-white/90 p-4 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-1 dark:border-white/10 dark:bg-gray-950/90 sm:block">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">Status</span>
          <CheckCircle2 size={16} className="text-emerald-400" />
        </div>
        <p className="text-sm font-black text-gray-950 dark:text-white font-khmer">{t('Ready for a sharper digital presence.', 'ត្រៀមសម្រាប់វត្តមានឌីជីថលកាន់តែច្បាស់។')}</p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-indigo-500 font-khmer">
          {t('Scroll to explore', 'Scroll ដើម្បីមើលបន្ត')} <ArrowUpRight size={13} />
        </div>
      </div>
    </div>
  );
};

export default HeroLaunchPanel;
