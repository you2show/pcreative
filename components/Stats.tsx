import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  labelKm: string;
  emotionalLabel: string;
  emotionalLabelKm: string;
  quote: string;
  quoteKm: string;
  quoteAuthor: string;
  color: string;
  glowColor: string;
}

const STATS: StatItem[] = [
  {
    value: 127,
    suffix: '+',
    label: 'Brands Launched',
    labelKm: 'ម៉ាកបានដំណើរការ',
    emotionalLabel: 'Brands that now stand out',
    emotionalLabelKm: 'ម៉ាកដែលលេចធ្លោ',
    quote: 'Our brand finally feels like us.',
    quoteKm: 'ម៉ាករបស់យើងដូចខ្លួនរបស់យើងពិតៗ។',
    quoteAuthor: 'Sophea K., Bloom Studio',
    color: 'from-indigo-400 to-indigo-600',
    glowColor: '#6366f1',
  },
  {
    value: 9,
    suffix: '/10',
    label: 'Clients return',
    labelKm: 'អតិថិជនត្រឡប់មកវិញ',
    emotionalLabel: '9 out of 10 come back',
    emotionalLabelKm: '9 ក្នុង 10 ត្រឡប់មកវិញ',
    quote: 'Fastest agency, always delivers.',
    quoteKm: 'Agency លឿនបំផុត — ផ្ញើជានិច្ច។',
    quoteAuthor: 'David C., NovaCo',
    color: 'from-purple-400 to-purple-600',
    glowColor: '#a855f7',
  },
  {
    value: 48,
    suffix: 'h',
    label: 'First draft guarantee',
    labelKm: 'ធានាដ្រាហ្វដំបូង',
    emotionalLabel: 'Your first idea, in hours',
    emotionalLabelKm: 'គំនិតដំបូងអ្នក ក្នុងម៉ោង',
    quote: 'Draft in 48h — I couldn\'t believe it.',
    quoteKm: 'ដ្រាហ្វក្នុង 48h — ជឿមិនដល់។',
    quoteAuthor: 'Ahmad R., TechStart KH',
    color: 'from-pink-400 to-pink-600',
    glowColor: '#ec4899',
  },
  {
    value: 5,
    suffix: '★',
    label: 'Average rating',
    labelKm: 'ការវាយតម្លៃជាមធ្យម',
    emotionalLabel: 'Perfect score, every time',
    emotionalLabelKm: 'ពិន្ទុល្អឥតខ្ចោះ — គ្រប់ពេល',
    quote: 'Perfection is their standard.',
    quoteKm: 'ភាពល្អឥតខ្ចោះ — គំរូរបស់ពួកគេ។',
    quoteAuthor: 'Fatima H., Al-Noor',
    color: 'from-amber-400 to-orange-500',
    glowColor: '#f59e0b',
  },
];

function useCountUp(target: number, duration: number = 1800, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

const StatCard: React.FC<{ stat: StatItem; index: number; started: boolean }> = ({ stat, index, started }) => {
  const { t } = useLanguage();
  const count = useCountUp(stat.value, 1600 + index * 150, started);

  return (
    <RevealOnScroll variant="fade-up" delay={index * 110}>
      <div className="group relative flex flex-col text-center px-6 py-8 md:px-8 overflow-hidden">
        {/* Vertical divider (except last) */}
        {index < STATS.length - 1 && (
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-20 w-px bg-white/10" />
        )}

        {/* Number */}
        <div
          className={`text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent tabular-nums mb-2 tracking-tight`}
          style={{ filter: `drop-shadow(0 0 20px ${stat.glowColor}50)` }}
        >
          {count}{stat.suffix}
        </div>

        {/* Emotional label */}
        <p className="text-sm font-black text-white mb-1 font-khmer">
          {t(stat.emotionalLabel, stat.emotionalLabelKm)}
        </p>
        <p className="text-xs text-white/40 font-khmer mb-4">
          {t(stat.label, stat.labelKm)}
        </p>

        {/* Mini quote */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <p className="text-xs italic text-white/50 font-khmer leading-relaxed">
            "{t(stat.quote, stat.quoteKm)}"
          </p>
          <p className="mt-1 text-[10px] font-black text-white/30 uppercase tracking-wider">
            — {stat.quoteAuthor}
          </p>
        </div>
      </div>
    </RevealOnScroll>
  );
};

const Stats: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gray-950" aria-labelledby="stats-title">
      {/* Top border glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      {/* Ambient blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/6 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black tracking-[0.26em] uppercase text-white/50 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {t('Impact by numbers', 'ផលប៉ះពាល់ជាតួលេខ')}
            </div>
            <h2 id="stats-title" className="text-3xl md:text-5xl font-black text-white font-khmer">
              {t('Numbers that', 'តួលេខដែល')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {t('speak.', 'និយាយ។')}
              </span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x-0 divide-y lg:divide-y-0 lg:divide-x divide-white/5 rounded-3xl border border-white/8 bg-white/[0.02] overflow-hidden">
          {STATS.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
