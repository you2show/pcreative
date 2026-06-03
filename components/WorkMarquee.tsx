import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const MARQUEE_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
    label: 'Brand Identity',
    labelKm: 'អត្តសញ្ញាណម៉ាក',
    category: 'Branding',
  },
  {
    src: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=800',
    label: 'Web Design',
    labelKm: 'ការរចនាវេបសាយ',
    category: 'Digital',
  },
  {
    src: 'https://images.unsplash.com/photo-1524749292158-7540c2494485?auto=format&fit=crop&q=80&w=800',
    label: 'Architecture',
    labelKm: 'ស្ថាបត្យកម្ម',
    category: 'Architecture',
  },
  {
    src: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=800',
    label: 'UI / UX',
    labelKm: 'ការរចនា UI/UX',
    category: 'Digital',
  },
  {
    src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=800',
    label: 'Photography',
    labelKm: 'ការថតរូប',
    category: 'Media',
  },
  {
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    label: 'Campaign',
    labelKm: 'យុទ្ធនាការ',
    category: 'Marketing',
  },
  {
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800',
    label: 'Interior Design',
    labelKm: 'ការរចនាខាងក្នុង',
    category: 'Architecture',
  },
  {
    src: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
    label: 'Motion Design',
    labelKm: 'Motion Design',
    category: 'Creative',
  },
];

const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];
const getLanguagePrefix = () => {
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment && supportedLangs.includes(firstSegment) ? `/${firstSegment}` : '';
};

interface MarqueeRowProps {
  images: typeof MARQUEE_IMAGES;
  direction?: 'left' | 'right';
  speed?: number;
  t: (en: string, km?: string) => string;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ images, direction = 'left', speed = 40, t }) => {
  const duplicated = [...images, ...images];

  return (
    <div className="relative flex overflow-hidden" aria-hidden="true">
      <div
        className="flex gap-4 shrink-0"
        style={{
          animation: `marqueeScroll${direction === 'right' ? 'Reverse' : ''} ${speed}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {duplicated.map((img, i) => (
          <div
            key={i}
            className="group relative h-[220px] w-[320px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-xl"
          >
            <img
              src={img.src}
              alt={t(img.label, img.labelKm)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 saturate-[0.85] group-hover:saturate-100"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">{img.category}</span>
              <p className="text-sm font-black text-white mt-0.5 font-khmer">{t(img.label, img.labelKm)}</p>
            </div>
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-indigo-500/10 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};

const WorkMarquee: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const handleViewWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState(null, '', `${getLanguagePrefix()}/projects`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-10 overflow-hidden bg-gray-950"
      aria-label="Work showcase marquee"
    >
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-950 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-950 to-transparent z-10" />

      {/* Top label */}
      <div className="relative z-20 mb-6 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-indigo-500/60" />
          <span className="text-[11px] font-black uppercase tracking-[0.26em] text-indigo-400 font-khmer">
            {t('Selected Work', 'ស្នាដៃជ្រើសរើស')}
          </span>
        </div>
        <a
          href="/projects"
          onClick={handleViewWork}
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-white/80 backdrop-blur-sm transition-all hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white font-khmer"
        >
          {t('View all work', 'មើលស្នាដៃទាំងអស់')}
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* Marquee rows */}
      <div className="space-y-4 px-0">
        <MarqueeRow images={MARQUEE_IMAGES} direction="left" speed={38} t={t} />
        <MarqueeRow images={[...MARQUEE_IMAGES].reverse()} direction="right" speed={44} t={t} />
      </div>

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marqueeScrollReverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="marqueeScroll"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
};

export default WorkMarquee;
