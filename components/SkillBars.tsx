import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';
import { Palette, Globe, Building2, Camera, Languages, Wind } from 'lucide-react';

const SKILLS = [
  { icon: Palette, label: 'Graphic Design', labelKm: 'ការរចនាក្រាហ្វិក', percent: 96, color: 'from-purple-500 to-fuchsia-500', glow: 'shadow-purple-500/40' },
  { icon: Globe, label: 'Web Development', labelKm: 'ការអភិវឌ្ឍវេបសាយ', percent: 93, color: 'from-indigo-500 to-cyan-500', glow: 'shadow-indigo-500/40' },
  { icon: Building2, label: 'Architecture & Interior', labelKm: 'ស្ថាបត្យកម្ម & Interior', percent: 90, color: 'from-cyan-500 to-blue-500', glow: 'shadow-cyan-500/40' },
  { icon: Camera, label: 'Photo & Video', labelKm: 'រូបភាព & វីដេអូ', percent: 88, color: 'from-blue-500 to-indigo-500', glow: 'shadow-blue-500/40' },
  { icon: Languages, label: 'Translation', labelKm: 'ការបកប្រែ', percent: 94, color: 'from-orange-500 to-yellow-500', glow: 'shadow-orange-500/40' },
  { icon: Wind, label: 'MEP / HVAC', labelKm: 'MEP / ប្រព័ន្ធខ្យល់', percent: 85, color: 'from-teal-500 to-emerald-500', glow: 'shadow-teal-500/40' },
];

interface SkillBarProps {
  icon: React.ElementType;
  label: string;
  labelKm: string;
  percent: number;
  color: string;
  glow: string;
  animate: boolean;
  delay: number;
  t: (en: string, km?: string) => string;
}

const SkillBar: React.FC<SkillBarProps> = ({ icon: Icon, label, labelKm, percent, color, glow, animate, delay, t }) => {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let start: number | null = null;
    const duration = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * percent));
      if (progress < 1) requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), delay);
    return () => clearTimeout(timer);
  }, [animate, percent, delay]);

  return (
    <div className="group">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg ${glow} transition-transform duration-300 group-hover:scale-110`}>
            <Icon size={15} className="text-white" />
          </div>
          <span className="text-sm font-black text-gray-800 dark:text-white font-khmer">{t(label, labelKm)}</span>
        </div>
        <span className={`text-sm font-black text-transparent bg-clip-text bg-gradient-to-r ${color} tabular-nums`}>
          {displayed}%
        </span>
      </div>

      {/* Bar track */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/5">
        <div
          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${color} shadow-sm transition-none`}
          style={{
            width: animate ? `${displayed}%` : '0%',
            transition: 'none',
          }}
        />
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'skillShimmer 1.5s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );
};

const SkillBars: React.FC = () => {
  const { t } = useLanguage();
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
      aria-labelledby="skills-title"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(99,102,241,0.10),transparent_44%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <RevealOnScroll variant="slide-right">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.26em] text-indigo-500 dark:text-indigo-400 font-khmer">
                {t('What we do best', 'អ្វីដែលយើងធ្វើបានល្អបំផុត')}
              </span>
              <h2 id="skills-title" className="mt-3 text-4xl md:text-5xl font-black leading-tight tracking-[-0.04em] text-gray-950 dark:text-white font-khmer">
                {t('Multi-discipline', 'ជំនាញ')}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  {t('expertise.', 'ច្រើនប្រភេទ។')}
                </span>
              </h2>
              <p className="mt-5 text-base text-gray-600 dark:text-gray-400 leading-relaxed font-khmer max-w-md">
                {t(
                  'From pixels to architecture, we bring specialist-level skill to every discipline we offer. No outsourcing, no generalists.',
                  'ពីឌីហ្សាញ pixel ទៅដល់ស្ថាបត្យកម្ម យើងនាំជំនាញជំនាញពិតប្រាកដ។ គ្មានការ outsource គ្មាន generalist ។'
                )}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { val: '6+', label: 'Disciplines', labelKm: 'ជំនាញ' },
                  { val: '150+', label: 'Projects done', labelKm: 'គម្រោងបានបញ្ចប់' },
                  { val: '5yr', label: 'Experience', labelKm: 'ឆ្នាំបទពិសោធ' },
                  { val: '98%', label: 'Satisfaction', labelKm: 'ការពេញចិត្ត' },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl border border-gray-100 dark:border-white/5 bg-white/80 dark:bg-white/[0.03] p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{s.val}</p>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5 font-khmer">{t(s.label, s.labelKm)}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Right: bars */}
          <RevealOnScroll variant="slide-left" delay={100}>
            <div className="space-y-5 bg-white/60 dark:bg-white/[0.03] rounded-3xl border border-gray-100 dark:border-white/5 p-6 md:p-8 shadow-xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm">
              {SKILLS.map((skill, i) => (
                <SkillBar
                  key={skill.label}
                  {...skill}
                  animate={animate}
                  delay={i * 120}
                  t={t}
                />
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        @keyframes skillShimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </section>
  );
};

export default SkillBars;
