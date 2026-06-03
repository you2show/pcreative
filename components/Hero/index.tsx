
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { MemberDetailModal, AuthorArticlesModal, ArticleDetailModal } from '../TeamModals';
import { TeamMember, Post } from '../../types';
import ScrambleText from '../ScrambleText';
import { Image, MousePointer2, Sparkles } from 'lucide-react';

import HeroActions from './HeroActions';
import Hero3DScene from '../Hero3DScene';

// Rotating words that cycle in the hero headline
const ROTATING_WORDS_EN = ['Websites', 'Brands', 'Apps', 'Campaigns', 'Experiences'];
const ROTATING_WORDS_KM = ['វេបសាយ', 'ម៉ាក', 'Apps', 'យុទ្ធនាការ', 'បទពិសោធន៍'];

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
  <div className="relative w-full overflow-hidden border-y border-gray-100 dark:border-white/5 py-3 bg-gray-50/60 dark:bg-white/[0.02] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.04)]">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md animate-fade-in group hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-default shadow-sm dark:shadow-indigo-500/10">
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

            <p className="hero-copy text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-khmer max-w-md mx-auto lg:mx-0">
              {t(
                  'Bold digital visuals that make people stop, trust, and contact you.',
                  'រូបភាពឌីជីថលខ្លាំងៗ ឲ្យមនុស្សឈប់មើល ទុកចិត្ត និងទាក់ទងអ្នក។'
              )}
            </p>

            <div className="hero-proof-strip grid max-w-2xl grid-cols-3 gap-3 mx-auto lg:mx-0">
              {[
                { icon: Image, label: t('Big visuals', 'រូបធំ') },
                { icon: Sparkles, label: t('Premium mood', 'Mood ស្អាត') },
                { icon: MousePointer2, label: t('Clear CTA', 'CTA ច្បាស់') },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="group relative min-h-24 overflow-hidden rounded-3xl border border-gray-200 bg-white/75 p-3 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/20 hover:border-indigo-200/50 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-black/30 dark:hover:border-indigo-400/20 creative-card">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,0.32),transparent_42%)] opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex h-full flex-col justify-between">
                    <Icon size={22} className="text-indigo-500 dark:text-indigo-300 transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-sm font-black text-gray-800 dark:text-white font-khmer">{label}</span>
                  </div>
                </div>
              ))}
            </div>

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
