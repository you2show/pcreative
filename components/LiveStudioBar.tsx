import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ACTIVITY_FEED = [
  { icon: '🎨', en: "Sokha's brand identity — delivered 2h ago", km: "Brand Identity របស់ Sokha — ប្រគល់ ២ម៉ោងមុន", type: 'deliver' },
  { icon: '🚀', en: "New project started: HVAC system layout — today", km: "គម្រោងថ្មី: ប្លង់ HVAC — ថ្ងៃនេះ", type: 'start' },
  { icon: '✏️', en: "Website redesign for NovaCo — in review", km: "Website ថ្មីរបស់ NovaCo — កំពុងពិនិត្យ", type: 'review' },
  { icon: '📸', en: "Photo reels for Al-Noor Restaurant — shooting Friday", km: "Reel ថតសម្រាប់ Al-Noor — ថតថ្ងៃសុក្រ", type: 'upcoming' },
  { icon: '✅', en: "3 projects delivered this week", km: "គម្រោង ៣ ត្រូវបានប្រគល់សប្ដាហ៍នេះ", type: 'milestone' },
  { icon: '🌍', en: "Working with clients across 4 countries", km: "ធ្វើការជាមួយអតិថិជននៅ ៤ ប្រទេស", type: 'global' },
];

const LiveStudioBar: React.FC = () => {
  const { t } = useLanguage();
  const [feedIndex, setFeedIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setFeedIndex(prev => (prev + 1) % ACTIVITY_FEED.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = ACTIVITY_FEED[feedIndex];

  return (
    <div
      className="w-full bg-gradient-to-r from-gray-950 via-indigo-950/70 to-gray-950 border-y border-indigo-500/20 py-2.5 overflow-hidden relative"
      role="status"
      aria-live="polite"
      aria-label="Studio activity feed"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.10),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">

          {/* Left: Live badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.26em] text-green-400">
              {t('ACTIVITY', 'សកម្មភាព')}
            </span>
            <span className="h-3 w-px bg-white/10" />
          </div>

          {/* Center: rotating activity */}
          <span
            className={`flex items-center gap-2 text-[11px] font-bold text-white/80 tracking-wide transition-all duration-400 font-khmer flex-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
            style={{ transitionProperty: 'opacity, transform', transitionDuration: '400ms' }}
          >
            <span className="text-sm" aria-hidden="true">{current.icon}</span>
            {t(current.en, current.km)}
          </span>

          {/* Right: studio name + hours */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <span className="h-3 w-px bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 font-khmer">
              Ponloe Creative
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="text-[10px] font-bold text-white/30">
              {t('Mon–Sat · 8am–6pm', 'ច័ន្ទ–សៅ · ៨ព្រឹក–៦ល្ងាច')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStudioBar;
