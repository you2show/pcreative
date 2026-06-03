import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

const PROJECTS = [
  {
    title: 'Khmer Roots Branding',
    titleKm: 'Brand Khmer Roots',
    category: 'Brand Identity',
    categoryKm: 'អត្តសញ្ញាណម៉ាក',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600',
    href: '/projects',
  },
  {
    title: 'Phnom Penh Villa Complex',
    titleKm: 'គម្រោងវីឡាភ្នំពេញ',
    category: 'Architecture',
    categoryKm: 'ស្ថាបត្យកម្ម',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600',
    href: '/projects',
  },
  {
    title: 'E-Commerce Platform UI',
    titleKm: 'ការរចនា UI E-Commerce',
    category: 'UI / UX',
    categoryKm: 'ការរចនា UI/UX',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=600',
    href: '/projects',
  },
  {
    title: 'Arabic Calligraphy Series',
    titleKm: 'ស្នាដៃអក្សរអារ៉ាប់',
    category: 'Calligraphy',
    categoryKm: 'អក្សរផ្ចង់',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=600',
    href: '/projects',
  },
  {
    title: 'Restaurant Visual Campaign',
    titleKm: 'យុទ្ធនាការ Visual ភោជនីយដ្ឋាន',
    category: 'Campaign',
    categoryKm: 'យុទ្ធនាការ',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
    href: '/projects',
  },
  {
    title: 'Tech Startup Website',
    titleKm: 'វេបសាយ Startup បច្ចេកវិទ្យា',
    category: 'Web Development',
    categoryKm: 'វេបសាយ',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=600',
    href: '/projects',
  },
];

const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];
const getLanguagePrefix = () => {
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment && supportedLangs.includes(firstSegment) ? `/${firstSegment}` : '';
};

const CursorGallery: React.FC = () => {
  const { t } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const target = useRef({ x: 0, y: 0 });
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice.current) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const animate = () => {
      setSmoothPos(prev => ({
        x: prev.x + (target.current.x - prev.x) * 0.1,
        y: prev.y + (target.current.y - prev.y) * 0.1,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState(null, '', `${getLanguagePrefix()}/projects`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden" aria-labelledby="cursor-gallery-title">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(99,102,241,0.08),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.26em] text-indigo-500 dark:text-indigo-400 font-khmer">
                {t('Featured Projects', 'គម្រោងពិសេស')}
              </span>
              <h2 id="cursor-gallery-title" className="mt-2 text-4xl md:text-5xl font-black leading-tight tracking-[-0.04em] text-gray-950 dark:text-white font-khmer">
                {t('Hover to preview.', 'Hover ដើម្បីមើល។')}
                <span className="block text-gray-400 dark:text-gray-500 font-medium text-2xl md:text-3xl mt-1">
                  {t('Click to explore.', 'ចុចដើម្បីស្វែងយល់។')}
                </span>
              </h2>
            </div>
            <a
              href="/projects"
              onClick={handleNavigate}
              className="group inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 px-5 py-3 text-sm font-black text-gray-900 dark:text-white transition-all hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 backdrop-blur-sm font-khmer shrink-0"
            >
              {t('All Projects', 'គម្រោងទាំងអស់')}
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </RevealOnScroll>

        {/* Project list */}
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {PROJECTS.map((project, i) => (
            <RevealOnScroll key={i} delay={i * 60}>
              <a
                href={project.href}
                onClick={handleNavigate}
                className="group relative flex items-center justify-between py-5 md:py-6 gap-6 transition-all duration-300 hover:px-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Index */}
                <span className="hidden sm:block text-xs font-black tabular-nums text-gray-300 dark:text-gray-700 w-6 shrink-0 transition-colors group-hover:text-indigo-400">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Title + category */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight truncate transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-300 font-khmer">
                    {t(project.title, project.titleKm)}
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-600 mt-0.5 font-bold font-khmer">
                    {t(project.category, project.categoryKm)}
                  </p>
                </div>

                {/* Year */}
                <span className="text-sm font-bold text-gray-400 dark:text-gray-600 shrink-0">{project.year}</span>

                {/* Arrow */}
                <div className="shrink-0 w-9 h-9 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-indigo-300 group-hover:bg-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-500/30">
                  <ArrowUpRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </a>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {/* Floating cursor preview image (desktop only) */}
      {hoveredIndex !== null && !isTouchDevice.current && (
        <div
          className="pointer-events-none fixed z-[9999] top-0 left-0"
          style={{
            transform: `translate3d(${smoothPos.x + 20}px, ${smoothPos.y - 130}px, 0)`,
            willChange: 'transform',
          }}
          aria-hidden="true"
        >
          <div className="relative w-[260px] h-[180px] overflow-hidden rounded-2xl shadow-2xl shadow-black/40 border border-white/10 animate-cursor-preview">
            <img
              src={PROJECTS[hoveredIndex].image}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">{PROJECTS[hoveredIndex].category}</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cursorPreviewIn {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-cursor-preview {
          animation: cursorPreviewIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards;
        }
      `}</style>
    </section>
  );
};

export default CursorGallery;
