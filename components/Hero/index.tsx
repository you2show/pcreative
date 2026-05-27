
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { MemberDetailModal, AuthorArticlesModal, ArticleDetailModal } from '../TeamModals';
import { TeamMember, Post } from '../../types';
import ScrambleText from '../ScrambleText';

import HeroActions from './HeroActions';
import Hero3DScene from '../Hero3DScene';

// Rotating words that cycle in the hero headline
const ROTATING_WORDS_EN = ['Experiences', 'Websites', 'Brands', 'Solutions', 'Products'];
const ROTATING_WORDS_KM = ['បទពិសោធន៍', 'វេបសាយ', 'ម៉ាក', 'ដំណោះស្រាយ', 'ផលិតផល'];

const RotatingWord: React.FC<{ t: (en: string, km?: string) => string }> = ({ t }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % ROTATING_WORDS_EN.length);
        setVisible(true);
      }, 350);
    }, 2500);
    return () => clearInterval(cycle);
  }, []);

  return (
    <span
      className="inline-block transition-all duration-350"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-12px)',
      }}
    >
      {t(ROTATING_WORDS_EN[index], ROTATING_WORDS_KM[index])}
    </span>
  );
};

const HeroVisuals = React.lazy(() => import('./HeroVisuals'));

// Horizontal marquee ticker of keywords shown at the bottom of the hero
const TICKER_ITEMS = [
  'GRAPHIC DESIGN', '✦', 'WEB DEVELOPMENT', '✦', 'ARCHITECTURE', '✦',
  'BRANDING', '✦', 'MOBILE APPS', '✦', 'TRANSLATION', '✦',
  'MVAC SYSTEMS', '✦', 'CALLIGRAPHY', '✦', 'DIGITAL MARKETING', '✦',
  'UI / UX', '✦', 'INTERIOR DESIGN', '✦',
];

const HeroTicker: React.FC = () => (
  <div className="relative w-full overflow-hidden border-y border-gray-100 dark:border-white/5 py-3 bg-gray-50/60 dark:bg-white/[0.02] backdrop-blur-sm">
    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 dark:from-gray-950 to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent z-10 pointer-events-none" />
    <div className="flex w-max animate-hero-ticker">
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span
          key={i}
          className={`shrink-0 mx-4 text-[11px] font-black tracking-[0.2em] uppercase ${
            item === '✦'
              ? 'text-indigo-400 dark:text-indigo-500'
              : 'text-gray-400 dark:text-gray-600'
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const { team = [], insights = [] } = useData(); 
  
  // Modal States
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [authorPosts, setAuthorPosts] = useState<Post[] | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [shouldRenderVisuals, setShouldRenderVisuals] = useState(false);

  // Parallax Refs for Background
  const containerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll
  useEffect(() => {
    if (selectedMember || authorPosts || selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMember, authorPosts, selectedPost]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const update = () => setShouldRenderVisuals(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  const handleShowArticles = (member: TeamMember) => {
      if (!insights) return;
      const posts = insights.filter(p => p.authorId === member.id);
      setAuthorPosts(posts);
  };

  return (
    <>
    <section ref={containerRef} id="home" aria-label="Hero section" className="relative min-h-screen flex items-center pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden perspective-1000">
      
      {/* 3D Background Scene */}
      <Hero3DScene />

      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div 
            className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] opacity-60"
        />
        <div 
            className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] opacity-60"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content - Typography & CTA */}
          <div className="space-y-8 text-center lg:text-left relative z-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md animate-fade-in group hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-bold text-indigo-300 tracking-widest uppercase font-khmer">
                  {t('Open for new projects', 'ទទួលគម្រោងថ្មីៗ')}
              </span>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-2">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white font-khmer">
                    {t('We Craft', 'យើងបង្កើត')}{' '}
                    <br className="hidden sm:block" />
                    {/* Animated rotating word */}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg pb-2 inline-block min-w-0">
                        <RotatingWord t={t} />
                    </span>
                    <br />
                    {/* Subtitle word with scramble */}
                    <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-500 dark:text-gray-400 tracking-normal">
                        <ScrambleText
                          text={t('With Digital Perfection', 'ដោយភាពល្អឥតខ្ចោះ')}
                          delay={600}
                          duration={1000}
                        />
                    </span>
                </h1>

            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-khmer max-w-xl mx-auto lg:mx-0">
              {t(
                  "Cambodia's digital future, built by architects, developers & artists.",
                  'ក្រុមស្ថាបត្យករ អ្នកអភិវឌ្ឍន៍ និងអ្នករចនា — ដៃគូឌីជីថលនៅកម្ពុជា។'
              )}
            </p>
            
            {/* Actions Component (Buttons & Stats) */}
            <HeroActions t={t} />
          </div>
          
          {/* Right Content - Visuals */}
          {shouldRenderVisuals ? (
            <Suspense fallback={<div className="hidden lg:block h-[600px] w-full" />}>
              <HeroVisuals team={team} onMemberClick={setSelectedMember} />
            </Suspense>
          ) : (
            <div className="hidden lg:block h-[600px] w-full" />
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedMember && (
          <MemberDetailModal 
            member={selectedMember} 
            onClose={() => setSelectedMember(null)}
            onShowArticles={handleShowArticles}
          />
      )}

      {authorPosts && selectedMember && (
          <AuthorArticlesModal 
             author={selectedMember}
             posts={authorPosts}
             onClose={() => setAuthorPosts(null)}
             onSelectPost={setSelectedPost}
          />
      )}

      {selectedPost && (
          <ArticleDetailModal 
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
      )}

    </section>

      {/* Keyword ticker below hero */}
      <HeroTicker />
    </>
  );
};

export default Hero;
