
import React, { useEffect, useRef, useState } from 'react';
import { PROCESS_STEPS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import ScrambleText from './ScrambleText';

// Animated SVG beam connecting two step nodes (desktop only)
const ConnectorBeam: React.FC<{ active: boolean; delay: number }> = ({ active, delay }) => (
  <div className="hidden lg:flex items-center flex-1 relative mx-2" aria-hidden="true">
    <svg className="w-full h-6 overflow-visible" viewBox="0 0 100 24" preserveAspectRatio="none">
      {/* Track line */}
      <line x1="0" y1="12" x2="100" y2="12" stroke="rgba(99,102,241,0.15)" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Animated signal */}
      <line
        x1="0" y1="12" x2="100" y2="12"
        stroke="url(#beamGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="100"
        strokeDashoffset={active ? '0' : '100'}
        style={{ transition: `stroke-dashoffset 0.7s ease ${delay}ms` }}
      />
      <defs>
        <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
    {/* Travelling dot */}
    {active && (
      <div
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_3px_rgba(99,102,241,0.6)]"
        style={{
          left: '0%',
          animation: `travelDot 0.8s ease ${delay}ms forwards`,
        }}
      />
    )}
  </div>
);

const STEP_COLORS = [
  { glow: '#6366f1', ring: 'ring-indigo-500', bg: 'bg-indigo-600', text: 'text-indigo-400', gradFrom: 'from-indigo-500/10' },
  { glow: '#a855f7', ring: 'ring-purple-500', bg: 'bg-purple-600', text: 'text-purple-400', gradFrom: 'from-purple-500/10' },
  { glow: '#ec4899', ring: 'ring-pink-500', bg: 'bg-pink-600', text: 'text-pink-400', gradFrom: 'from-pink-500/10' },
  { glow: '#06b6d4', ring: 'ring-cyan-500', bg: 'bg-cyan-600', text: 'text-cyan-400', gradFrom: 'from-cyan-500/10' },
];

const Process: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [headerTriggered, setHeaderTriggered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderTriggered(true);
          // Sequentially activate each step
          PROCESS_STEPS.forEach((_, i) => {
            setTimeout(() => setActiveStep(i), i * 350 + 200);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span
            className="inline-block text-indigo-400 font-bold tracking-[0.3em] uppercase text-xs mb-4 font-mono"
            style={{ opacity: headerTriggered ? 1 : 0, transition: 'opacity 0.5s ease' }}
          >
            ── MISSION PROTOCOL ──
          </span>
          <h2 className="mt-2 text-3xl md:text-5xl font-black text-gray-900 dark:text-white font-khmer">
            {t('Our', 'ដំណើរការ')}{' '}
            <ScrambleText
              text={t('Process', 'របស់យើង')}
              trigger={headerTriggered}
              delay={300}
              duration={800}
              className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400"
            />
          </h2>
          <p
            className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-mono tracking-wider"
            style={{ opacity: headerTriggered ? 1 : 0, transition: 'opacity 0.5s ease 0.4s' }}
          >
            {t('4 phases · 1 perfect result', '4 ដំណាក់កាល · លទ្ធផល 1 ល្អឥតខ្ចោះ')}
          </p>
        </div>

        {/* Pipeline */}
        <div className="relative">
          {/* Desktop: horizontal flex with beams; mobile: vertical stack */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-0 lg:gap-0 relative z-10">
            {PROCESS_STEPS.map((step, index) => {
              const color = STEP_COLORS[index];
              const isActive = activeStep >= index;
              return (
                <React.Fragment key={step.id}>
                  {/* Step card */}
                  <div
                    className="flex flex-col items-center lg:flex-1 group"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(24px)',
                      transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s ease ${index * 120}ms`,
                    }}
                  >
                    {/* Node circle */}
                    <div className="relative mb-6">
                      {/* Outer pulse ring */}
                      {isActive && (
                        <div
                          className={`absolute inset-0 rounded-full ring-1 ${color.ring} ring-offset-0`}
                          style={{
                            animation: 'nodeRing 2s ease-in-out infinite',
                            boxShadow: `0 0 20px 4px ${color.glow}40`,
                          }}
                        />
                      )}
                      <div
                        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-black text-lg font-mono transition-all duration-500 ${
                          isActive
                            ? `${color.bg} text-white border-transparent shadow-[0_0_24px_4px_${color.glow}50]`
                            : 'border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900'
                        }`}
                        style={isActive ? { boxShadow: `0 0 24px 4px ${color.glow}50` } : {}}
                      >
                        {step.number}
                      </div>
                    </div>

                    {/* Card body */}
                    <div
                      className={`w-full max-w-[260px] bg-gray-50/80 dark:bg-gray-900/60 backdrop-blur-sm border rounded-2xl p-6 text-center transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl ${
                        isActive
                          ? 'border-white/20 dark:border-white/10 group-hover:border-indigo-500/30'
                          : 'border-gray-100 dark:border-white/5'
                      }`}
                      style={
                        isActive
                          ? { boxShadow: `0 0 40px 0 ${color.glow}12, 0 4px 24px 0 rgba(0,0,0,0.08)` }
                          : {}
                      }
                    >
                      {/* Icon */}
                      <div
                        className={`inline-flex p-3 rounded-xl mb-4 transition-colors duration-500 ${
                          isActive ? `bg-gradient-to-br ${color.gradFrom} to-transparent ${color.text}` : 'bg-gray-100 dark:bg-white/5 text-gray-400'
                        }`}
                      >
                        {step.icon}
                      </div>

                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 font-khmer">
                        {isActive ? (
                          <ScrambleText text={t(step.title, step.titleKm)} trigger={isActive} delay={index * 120} duration={500} />
                        ) : (
                          t(step.title, step.titleKm)
                        )}
                      </h3>

                      <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed font-khmer">
                        {t(step.description, step.descriptionKm || step.description)}
                      </p>

                      {/* Status badge */}
                      <div
                        className={`mt-4 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-1 rounded-full transition-all duration-500 ${
                          isActive
                            ? `${color.text} bg-current/10`
                            : 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-white/5'
                        }`}
                        style={isActive ? { backgroundColor: `${color.glow}18` } : {}}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isActive ? color.bg : 'bg-gray-300 dark:bg-gray-700'}`}
                          style={isActive ? { animation: 'statusPulse 1.5s ease-in-out infinite' } : {}}
                        />
                        {isActive ? t('ACTIVE', 'សកម្ម') : t('PENDING', 'រង់ចាំ')}
                      </div>
                    </div>
                  </div>

                  {/* Connector beam between steps (not after last) */}
                  {index < PROCESS_STEPS.length - 1 && (
                    <ConnectorBeam active={activeStep > index} delay={index * 350 + 500} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes nodeRing {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes travelDot {
          from { left: 0%; }
          to { left: 100%; }
        }
      `}</style>
    </section>
  );
};

export default Process;
