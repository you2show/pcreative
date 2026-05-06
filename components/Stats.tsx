import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  labelKm: string;
  color: string;
}

const STATS: StatItem[] = [
  { value: 150, suffix: '+', label: 'Projects Completed', labelKm: 'គម្រោងបានបញ្ចប់', color: 'from-indigo-400 to-indigo-600' },
  { value: 80, suffix: '+', label: 'Happy Clients', labelKm: 'អតិថិជនពេញចិត្ត', color: 'from-purple-400 to-purple-600' },
  { value: 5, suffix: '+', label: 'Years Experience', labelKm: 'ឆ្នាំបទពិសោធ', color: 'from-pink-400 to-pink-600' },
  { value: 98, suffix: '%', label: 'Client Satisfaction', labelKm: 'ការពេញចិត្ត', color: 'from-cyan-400 to-cyan-600' },
];

function useCountUp(target: number, duration: number = 1800, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

interface StatCardProps {
  stat: StatItem;
  index: number;
  started: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, started }) => {
  const { t } = useLanguage();
  const count = useCountUp(stat.value, 1800 + index * 200, started);

  return (
    <RevealOnScroll variant="fade-up" delay={index * 100}>
      <div className="relative group text-center p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-all duration-500 overflow-hidden">
        {/* Glow bg */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${stat.color} transition-opacity duration-500 rounded-3xl`} />
        
        <div className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent tabular-nums mb-3 relative z-10`}>
          {count}{stat.suffix}
        </div>
        <p className="text-gray-400 font-khmer text-sm md:text-base font-medium relative z-10">
          {t(stat.label, stat.labelKm)}
        </p>
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
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-950 relative overflow-hidden">
      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll className="text-center mb-12">
          <span className="text-indigo-400 font-bold tracking-wider uppercase text-xs md:text-sm font-khmer">
            {t('Our Impact', 'ផលប៉ះពាល់របស់យើង')}
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white font-khmer">
            {t('Numbers That', 'ចំនួនដែល')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {t('Speak', 'និយាយ')}
            </span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
