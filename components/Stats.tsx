import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  labelKm: string;
  missionLabel: string;
  missionLabelKm: string;
  color: string;
  glowColor: string;
  unit: string;
}

const STATS: StatItem[] = [
  {
    value: 150,
    suffix: '+',
    label: 'Projects Completed',
    labelKm: 'គម្រោងបានបញ្ចប់',
    missionLabel: 'MISSIONS COMPLETED',
    missionLabelKm: 'បេសកកម្មបានបញ្ចប់',
    color: 'from-indigo-400 to-indigo-600',
    glowColor: '#6366f1',
    unit: 'OPS',
  },
  {
    value: 80,
    suffix: '+',
    label: 'Happy Clients',
    labelKm: 'អតិថិជនពេញចិត្ត',
    missionLabel: 'ALLIES ACQUIRED',
    missionLabelKm: 'ដៃគូបានទទួល',
    color: 'from-purple-400 to-purple-600',
    glowColor: '#a855f7',
    unit: 'HUM',
  },
  {
    value: 5,
    suffix: '+',
    label: 'Years Experience',
    labelKm: 'ឆ្នាំបទពិសោធ',
    missionLabel: 'CYCLES IN ORBIT',
    missionLabelKm: 'ឆ្នាំក្នុងការគ្រប់គ្រង',
    color: 'from-pink-400 to-pink-600',
    glowColor: '#ec4899',
    unit: 'YRS',
  },
  {
    value: 98,
    suffix: '%',
    label: 'Client Satisfaction',
    labelKm: 'ការពេញចិត្ត',
    missionLabel: 'MISSION SUCCESS',
    missionLabelKm: 'ភាពជោគជ័យ',
    color: 'from-cyan-400 to-cyan-600',
    glowColor: '#06b6d4',
    unit: 'STS',
  },
];

// SVG oscilloscope waveform for each stat card
const OscilloscopeWave: React.FC<{ color: string; active: boolean }> = ({ color, active }) => {
  const points = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 100;
    const base = 50;
    const wave =
      Math.sin((i / 39) * Math.PI * 6) * 18 +
      Math.sin((i / 39) * Math.PI * 11 + 1) * 8 +
      Math.sin((i / 39) * Math.PI * 3 + 0.5) * 6;
    return `${x},${base + wave}`;
  }).join(' ');

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{
          strokeDasharray: active ? '0' : '500',
          strokeDashoffset: active ? '0' : '500',
          transition: active ? 'stroke-dashoffset 2s ease-out' : 'none',
        }}
      />
    </svg>
  );
};

// Animated telemetry ticker dots
const TelemetryDots: React.FC<{ color: string }> = ({ color }) => (
  <div className="flex items-center gap-1 mt-2">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="rounded-full"
        style={{
          width: '3px',
          height: `${4 + Math.abs(Math.sin(i * 0.9)) * 12}px`,
          backgroundColor: color,
          opacity: 0.4 + Math.abs(Math.sin(i * 0.9)) * 0.6,
          animation: `telemetry-bar 1.2s ease-in-out infinite`,
          animationDelay: `${i * 0.12}s`,
        }}
      />
    ))}
  </div>
);

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

interface StatCardProps {
  stat: StatItem;
  index: number;
  started: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index, started }) => {
  const { t } = useLanguage();
  const count = useCountUp(stat.value, 1800 + index * 200, started);

  return (
    <RevealOnScroll variant="fade-up" delay={index * 120}>
      <div className="relative group text-center p-6 md:p-8 rounded-3xl bg-gray-100 dark:bg-gray-950/80 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all duration-500 overflow-hidden cursor-default">
        {/* Oscilloscope background wave */}
        <OscilloscopeWave color={stat.glowColor} active={started} />

        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-8 rounded-3xl transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at center, ${stat.glowColor}30, transparent 70%)` }}
        />

        {/* Mission unit badge */}
        <div className="flex items-center justify-center gap-1 mb-3">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: stat.glowColor }}
          />
          <span
            className="text-[9px] font-black tracking-[0.25em] uppercase opacity-60"
            style={{ color: stat.glowColor }}
          >
            {stat.unit}
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: stat.glowColor, animationDelay: '0.5s' }}
          />
        </div>

        {/* Number - odometer style */}
        <div
          className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent tabular-nums mb-1 relative z-10 tracking-tight`}
          style={{ textShadow: `0 0 40px ${stat.glowColor}40` }}
        >
          {count}{stat.suffix}
        </div>

        {/* Mission label */}
        <p
          className="text-[10px] font-black tracking-[0.2em] uppercase mb-1 opacity-70 relative z-10"
          style={{ color: stat.glowColor }}
        >
          {t(stat.missionLabel, stat.missionLabelKm)}
        </p>

        {/* Human-readable label */}
        <p className="text-gray-500 dark:text-gray-500 font-khmer text-xs font-medium relative z-10">
          {t(stat.label, stat.labelKm)}
        </p>

        {/* Telemetry bar visualizer */}
        <div className="flex justify-center relative z-10">
          <TelemetryDots color={stat.glowColor} />
        </div>

        {/* Status indicator bottom */}
        <div className="absolute bottom-3 right-4 flex items-center gap-1 opacity-40">
          <div className="w-1 h-1 rounded-full bg-green-400 animate-ping" />
          <span className="text-[8px] text-green-400 font-mono uppercase tracking-widest">LIVE</span>
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
    <section ref={sectionRef} className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Mission control scan line overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll className="text-center mb-12">
          {/* Mission control header */}
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400 font-mono">
              {t('MISSION CONTROL · LIVE', 'ការត្រួតពិនិត្យបេសកកម្ម · ផ្ទាល់')}
            </span>
          </div>

          <h2 className="mt-2 text-3xl md:text-5xl font-bold text-gray-900 dark:text-white font-khmer">
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

      <style>{`
        @keyframes telemetry-bar {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
};

export default Stats;
