
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
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);

  useEffect(() => {
    const cycle = window.setInterval(() => {
      setIndex(current => {
        setPreviousIndex(current);
        return (current + 1) % ROTATING_WORDS_EN.length;
      });
    }, 2600);

    return () => window.clearInterval(cycle);
  }, []);

  const currentWord = t(ROTATING_WORDS_EN[index], ROTATING_WORDS_KM[index]);
  const previousWord = previousIndex === null ? null : t(ROTATING_WORDS_EN[previousIndex], ROTATING_WORDS_KM[previousIndex]);

  return (
    <span className="hero-word-stack" aria-live="polite" aria-label={currentWord}>
      {previousWord && (
        <span key={`prev-${previousIndex}-${index}`} className="hero-word-prev" aria-hidden="true">
          {previousWord}
        </span>
      )}
      <span key={`current-${index}`} className="hero-word-current">
        {currentWord}
      </span>
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
          <div className="space-y-6 text-center lg:text-left relative z-20">
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
            <div className="relative space-y-3">
                <div className="absolute -left-6 top-4 hidden h-28 w-28 rounded-full bg-indigo-500/15 blur-3xl dark:block" aria-hidden="true" />
                <h1 className="hero-headline relative text-5xl sm:text-6xl md:text-7xl font-black leading-[1.02] tracking-[-0.045em] text-gray-950 dark:text-white font-khmer">
                    <span className="hero-line-reveal block">
                      {t('We Craft', 'យើងបង្កើត')}
                    </span>
                    <span className="hero-gradient-text relative inline-block pb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg">
                        <RotatingWord t={t} />
                    </span>
                    <span className="hero-subline block text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-500 dark:text-gray-300 tracking-[-0.01em]">
                        <ScrambleText
                          text={t('With Digital Perfection', 'ដោយភាពល្អឥតខ្ចោះ')}
                          delay={450}
                          duration={900}
                        />
                    </span>
                </h1>
            </div>
            
            <p className="hero-copy text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-khmer max-w-lg mx-auto lg:mx-0">
              {t(
                  'Premium digital products that feel simple, fast, and trustworthy.',
                  'ផលិតផលឌីជីថល premium ដែលសាមញ្ញ លឿន និងគួរឱ្យទុកចិត្ត។'
              )}
            </p>
            
            {/* Actions Component (Buttons & Stats) */}
            <HeroActions t={t} />
          </div>
          
          {/* Right Content - Visuals */}
          <Suspense fallback={<div className="min-h-[220px] lg:h-[600px] w-full" />}>
            <HeroVisuals team={team} onMemberClick={setSelectedMember} />
          </Suspense>
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
