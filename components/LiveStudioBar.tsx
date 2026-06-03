import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ROTATING_UPDATES = [
  { en: '3 Projects in Production', km: 'គម្រោង ៣ កំពុងដំណើរការ' },
  { en: 'Last delivery: 2 days ago', km: 'ចុងក្រោយបញ្ជូន: ២ ថ្ងៃមុន' },
  { en: 'Team available for new briefs', km: 'ក្រុមការងារទទួលគម្រោងថ្មី' },
  { en: 'Based in Phnom Penh', km: 'ស្ថិតនៅភ្នំពេញ' },
];

const LiveStudioBar: React.FC = () => {
  const { t } = useLanguage();
  const [updateIndex, setUpdateIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setUpdateIndex(prev => (prev + 1) % ROTATING_UPDATES.length);
        setVisible(true);
      }, 350);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const current = ROTATING_UPDATES[updateIndex];

  return (
    <div
      className="w-full bg-gradient-to-r from-gray-950 via-indigo-950/80 to-gray-950 border-y border-indigo-500/20 py-2.5 overflow-hidden relative"
      role="status"
      aria-live="polite"
      aria-label="Studio live status"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-center gap-4 flex-wrap sm:flex-nowrap">
          {/* Live dot + label */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.24em] text-red-400">
              {t('LIVE', 'LIVE')}
            </span>
            <span className="h-3 w-px bg-white/10" />
          </div>

          {/* Studio status */}
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">
            {t('Ponloe Creative Studio', 'ស្ទូឌីយោ Ponloe Creative')}
          </span>
          <span className="hidden sm:block h-3 w-px bg-white/10" />

          {/* Rotating update */}
          <span
            className={`text-[11px] font-bold text-indigo-300 tracking-wide transition-all duration-350 font-khmer ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
            style={{ transitionProperty: 'opacity, transform', transitionDuration: '350ms' }}
          >
            ✦ {t(current.en, current.km)}
          </span>

          {/* Right side: work hours */}
          <div className="hidden md:flex items-center gap-2 ml-auto shrink-0">
            <span className="h-3 w-px bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
              {t('Mon–Sat · 8am–6pm', 'ច័ន្ទ–សៅ · ៨ព្រឹក–៦ល្ងាច')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStudioBar;
