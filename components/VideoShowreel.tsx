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
            {t('Our Work', 'ស្នាដៃយើង')}
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-gray-900 dark:text-white font-khmer">
            {t('Watch Our', 'មើល')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
              {t('Showreel', 'ការបង្ហាញ')}
            </span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-khmer text-sm md:text-base max-w-xl mx-auto">
            {t(
              'See our creative process and the results we deliver for clients across Cambodia and beyond.',
              'សូមមើលដំណើរការច្នៃប្រឌិត និងលទ្ធផលដែលយើងផ្ដល់ជូនអតិថិជននៅទូទាំងកម្ពុជា។'
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

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gray-950/40 group-hover:bg-gray-950/30 transition-colors duration-300" />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Pulse rings */}
                <div className="absolute inset-0 rounded-full bg-gray-300 dark:bg-white/20 animate-ping scale-150" />
                <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-white/10 animate-ping scale-125 animation-delay-300" />
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white text-gray-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 relative z-10">
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
      </div>

      {isOpen && <VideoModal videoId={DEFAULT_VIDEO_ID} onClose={() => setIsOpen(false)} />}
    </section>
  );
};

export default VideoShowreel;
