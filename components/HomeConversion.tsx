import React from 'react';
import { ArrowRight, Camera, LayoutDashboard, MousePointerClick, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];

const getLanguagePrefix = () => {
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment && supportedLangs.includes(firstSegment) ? `/${firstSegment}` : '';
};

const navigateToPage = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith('/')) return;
  event.preventDefault();
  window.history.pushState(null, '', `${getLanguagePrefix()}${href}` || '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const visualFrames = [
  {
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=85&w=1200',
    icon: Camera,
    label: 'Hero image first',
    labelKm: 'រូបធំមុនគេ',
    stat: '01',
  },
  {
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=85&w=1200',
    icon: LayoutDashboard,
    label: 'Visual proof wall',
    labelKm: 'បង្ហាញស្នាដៃជារូប',
    stat: '02',
  },
  {
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=85&w=1200',
    icon: MousePointerClick,
    label: 'One clear action',
    labelKm: 'ប៊ូតុងតែមួយច្បាស់',
    stat: '03',
  },
];

const designMoves = [
  { label: 'Less copy', labelKm: 'អក្សរតិច' },
  { label: 'Bigger images', labelKm: 'រូបធំ' },
  { label: 'Stronger contrast', labelKm: 'Contrast ខ្លាំង' },
];

const HomeConversion: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-20 md:py-28" aria-labelledby="home-conversion-title">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(99,102,241,0.22),transparent_34%),radial-gradient(circle_at_86%_28%,rgba(236,72,153,0.16),transparent_32%),linear-gradient(180deg,transparent,rgba(15,23,42,0.05),transparent)]" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-indigo-600 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:text-indigo-200 font-khmer">
              <Sparkles size={15} />
              {t('Visual-first homepage', 'Homepage ផ្តោតលើរូបភាព')}
            </div>
            <h2 id="home-conversion-title" className="mt-6 text-4xl font-black leading-tight tracking-[-0.04em] text-gray-950 dark:text-white md:text-6xl font-khmer">
              {t('Show the work. Say less.', 'បង្ហាញស្នាដៃ។ សរសេរឲ្យតិច។')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400 font-khmer">
              {t('A stronger homepage can feel like a gallery: big visuals, short labels, one obvious next step.', 'Homepage គួរមានអារម្មណ៍ដូច gallery៖ រូបធំៗ label ខ្លីៗ និងជំហានបន្ទាប់ច្បាស់មួយ។')}
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <RevealOnScroll delay={80}>
            <article className="group relative min-h-[520px] overflow-hidden rounded-[2.5rem] border border-white/20 bg-gray-950 shadow-2xl shadow-indigo-500/15">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=85&w=1600"
                alt={t('Large creative workspace preview', 'រូបភាព workspace ធំ')}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="max-w-xl rounded-[2rem] border border-white/15 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-2xl md:p-6">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-indigo-100">Featured direction</p>
                  <h3 className="mt-3 text-3xl font-black leading-tight md:text-5xl font-khmer">
                    {t('Make the first screen cinematic.', 'ធ្វើឲ្យអេក្រង់ដំបូងស្អាតដូចភាពយន្ត។')}
                  </h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {designMoves.map((move) => (
                      <span key={move.label} className="rounded-full bg-white/15 px-4 py-2 text-xs font-black backdrop-blur-md font-khmer">
                        {t(move.label, move.labelKm)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </RevealOnScroll>

          <div className="grid gap-5">
            {visualFrames.map((frame, index) => {
              const Icon = frame.icon;
              return (
                <RevealOnScroll key={frame.label} delay={index * 90 + 120}>
                  <article className="group relative min-h-[160px] overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-950 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/10">
                    <img
                      src={frame.image}
                      alt={t(frame.label, frame.labelKm)}
                      className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950/92 via-gray-950/42 to-transparent" />
                    <div className="relative flex h-full min-h-[160px] items-center justify-between gap-5 p-5 text-white">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                          <Icon size={25} />
                        </div>
                        <div>
                          <span className="text-xs font-black uppercase tracking-[0.24em] text-indigo-100">{frame.stat}</span>
                          <h3 className="mt-1 text-2xl font-black font-khmer">{t(frame.label, frame.labelKm)}</h3>
                        </div>
                      </div>
                      <ArrowRight className="shrink-0 opacity-70 transition-transform group-hover:translate-x-1" size={22} />
                    </div>
                  </article>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>

        <RevealOnScroll delay={320}>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-gray-200 bg-white/85 p-5 shadow-xl shadow-indigo-500/10 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/75 sm:flex-row">
            <p className="text-lg font-black text-gray-950 dark:text-white font-khmer">
              {t('Ready for a bolder first impression?', 'ត្រៀមធ្វើ first impression ឲ្យកាន់តែខ្លាំងទេ?')}
            </p>
            <a href="/contact" onClick={(event) => navigateToPage(event, '/contact')} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-black text-white transition-all hover:-translate-y-1 hover:bg-indigo-600 dark:bg-white dark:text-gray-950 dark:hover:bg-indigo-100 sm:w-auto font-khmer">
              {t('Start visual brief', 'ចាប់ផ្តើម Brief រូបភាព')}
              <ArrowRight size={17} />
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default HomeConversion;
