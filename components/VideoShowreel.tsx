import React, { useState } from 'react';
import { Play, X, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollBackgroundText from './ScrollBackgroundText';
import RevealOnScroll from './RevealOnScroll';

// Default showreel YouTube video ID — can be changed to actual showreel
const DEFAULT_VIDEO_ID = 'dQw4w9WgXcQ';
const THUMBNAIL_URL = `https://img.youtube.com/vi/${DEFAULT_VIDEO_ID}/maxresdefault.jpg`;

interface VideoModalProps {
  videoId: string;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoId, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 z-[10300] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl animate-scale-up z-[10301]">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-full transition-colors"
        >
          <X size={22} />
        </button>
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="Ponloe Creative Showreel"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
        .animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>
    </div>,
    document.body
  );
};

const VideoShowreel: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
      <ScrollBackgroundText text="SHOWREEL" className="top-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll className="text-center mb-12">
          <span className="text-indigo-400 font-bold tracking-wider uppercase text-xs md:text-sm font-khmer">
            {t('Our Showreel', 'ការបង្ហាញស្នាដៃ')}
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-gray-900 dark:text-white font-khmer">
            {t('60 Seconds.', '60 វិនាទី។')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
              {t('See What We Build.', 'មើលអ្វីដែលយើងបង្កើត')}
            </span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-khmer text-sm md:text-base max-w-xl mx-auto">
            {t(
              'Brands. Websites. Architecture. Media. One minute shows it all.',
              'Brand, វេបសាយ, ស្ថាបត្យ, Media — មួយនាទីបង្ហាញទាំងអស់'
            )}
          </p>
        </RevealOnScroll>

        {/* Video Thumbnail */}
        <RevealOnScroll variant="zoom-in" delay={200}>
          <div
            className="relative w-full max-w-4xl mx-auto cursor-pointer group rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
            onClick={() => setIsOpen(true)}
          >
            {/* Thumbnail */}
            <img
              src={THUMBNAIL_URL}
              alt="Showreel thumbnail"
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ aspectRatio: '16/9' }}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200';
              }}
            />

            {/* Grain texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gray-950/40 group-hover:bg-gray-950/30 transition-colors duration-300" />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Multi-layer concentric rings */}
                <div className="play-ring-1 absolute top-1/2 left-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/40 pointer-events-none" />
                <div className="play-ring-2 absolute top-1/2 left-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-indigo-400/40 pointer-events-none" />
                <div className="play-ring-3 absolute top-1/2 left-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-purple-400/30 pointer-events-none" />
                {/* Subtle glow beneath the button */}
                <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-2xl scale-150 group-hover:scale-200 transition-transform duration-700" />
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white text-gray-950 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] transition-all duration-300 relative z-10 border-4 border-white/20">
                  <Play size={36} className="ml-1 fill-gray-950" />
                </div>
              </div>
            </div>

            {/* Bottom label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              <div>
                <p className="text-white font-bold text-lg md:text-xl font-khmer drop-shadow">
                  {t('Ponloe Creative Showreel 2024', 'ស្នាដៃ Ponloe Creative 2024')}
                </p>
                <p className="text-white/60 text-sm font-khmer">
                  {t('Web • App • Design • Architecture', 'វេប • App • រចនា • ស្ថាបត្យ')}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-white/10 backdrop-blur-md rounded-full border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white text-sm font-bold">
                <ExternalLink size={14} />
                YouTube
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Project type badges */}
        <RevealOnScroll delay={280}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { label: 'Branding', labelKm: 'Brand', href: '/projects' },
              { label: 'Web & App', labelKm: 'Web & App', href: '/projects' },
              { label: 'Architecture', labelKm: 'ស្ថាបត្យ', href: '/projects' },
            ].map((badge) => {
              const handleBadgeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                const prefix = window.location.pathname.split('/').filter(Boolean)[0];
                const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];
                const langPrefix = prefix && supportedLangs.includes(prefix) ? `/${prefix}` : '';
                window.history.pushState(null, '', `${langPrefix}${badge.href}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              };
              return (
                <a
                  key={badge.label}
                  href={badge.href}
                  onClick={handleBadgeClick}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-5 py-2 text-xs font-black text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all font-khmer"
                >
                  {t(badge.label, badge.labelKm)}
                  <span className="text-gray-300 dark:text-white/20">→</span>
                </a>
              );
            })}
          </div>
        </RevealOnScroll>
      </div>

      {isOpen && <VideoModal videoId={DEFAULT_VIDEO_ID} onClose={() => setIsOpen(false)} />}
    </section>
  );
};

export default VideoShowreel;
