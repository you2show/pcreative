import React from 'react';
import { ArrowRight, CheckCircle2, Compass, MessageCircle, Sparkles, Target, TimerReset, TrendingUp } from 'lucide-react';
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

const conversionCards = [
  {
    icon: Target,
    title: 'Clear offer above the fold',
    titleKm: 'សារសំខាន់ច្បាស់តាំងពីផ្នែកខាងលើ',
    description: 'Visitors immediately see what we build, who it helps, and the next action to take.',
    descriptionKm: 'ភ្ញៀវឃើញភ្លាមៗថាយើងបង្កើតអ្វី ជួយអ្នកណា និងត្រូវធ្វើអ្វីបន្ទាប់។',
  },
  {
    icon: TrendingUp,
    title: 'Proof before pitch',
    titleKm: 'បង្ហាញភស្តុតាងមុនពេលលក់',
    description: 'Project outcomes, trust signals, and process clarity reduce hesitation before inquiry.',
    descriptionKm: 'លទ្ធផលគម្រោង សញ្ញាទុកចិត្ត និងដំណើរការច្បាស់ ជួយកាត់បន្ថយការស្ទាក់ស្ទើរមុនទាក់ទង។',
  },
  {
    icon: MessageCircle,
    title: 'Low-friction contact path',
    titleKm: 'ផ្លូវទំនាក់ទំនងងាយស្រួល',
    description: 'Every section points to a short brief, consultation, or portfolio path without forcing a hard sell.',
    descriptionKm: 'គ្រប់ section នាំទៅកាន់ brief ខ្លី ការប្រឹក្សា ឬ portfolio ដោយមិនបង្ខំការលក់ខ្លាំង។',
  },
];

const sprintSteps = [
  '15-min discovery call',
  'Homepage + offer audit',
  'Visual direction board',
  'Launch-ready action plan',
];

const sprintStepsKm = [
  'ពិភាក្សា 15 នាទី',
  'វាយតម្លៃ homepage និង offer',
  'បង្កើតទិសដៅរូបភាព',
  'ផែនការបើកដំណើរការរួចរាល់',
];

const HomeConversion: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-24 md:py-32" aria-labelledby="home-conversion-title">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(99,102,241,0.18),transparent_32%),radial-gradient(circle_at_82%_22%,rgba(236,72,153,0.14),transparent_30%),linear-gradient(180deg,transparent,rgba(99,102,241,0.06),transparent)]" />
      <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <RevealOnScroll>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-indigo-600 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:text-indigo-200 font-khmer">
                <Sparkles size={15} />
                {t('Homepage conversion upgrade', 'ការកែលម្អ Homepage ឲ្យមាន Conversion')}
              </div>
              <h2 id="home-conversion-title" className="mt-6 text-4xl font-black leading-tight tracking-[-0.04em] text-gray-950 dark:text-white md:text-6xl font-khmer">
                {t('Make every scroll feel like a reason to contact us.', 'ធ្វើឲ្យរាល់ការរមូរមានហេតុផលឲ្យភ្ញៀវចង់ទាក់ទង។')}
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 font-khmer">
                {t(
                  'The homepage is already visually strong. To make it sell better, we added a clearer visitor journey: promise, proof, service paths, and a fast consultation route.',
                  'Homepage មានរូបរាងល្អរួចហើយ។ ដើម្បីឲ្យវាជួយលក់សេវាកម្មកាន់តែខ្លាំង យើងបន្ថែមដំណើរភ្ញៀវឲ្យច្បាស់៖ សន្យា ភស្តុតាង ផ្លូវសេវាកម្ម និងផ្លូវប្រឹក្សាលឿន។'
                )}
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <div className="rounded-[2rem] border border-gray-200 bg-white/85 p-4 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl dark:border-white/10 dark:bg-gray-950/70">
              <div className="rounded-[1.6rem] bg-gray-950 p-5 text-white dark:bg-white/[0.05]">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-indigo-200">Creative Sprint</p>
                    <h3 className="mt-2 text-2xl font-black font-khmer">{t('From visitor to lead', 'ពីភ្ញៀវទៅជា Lead')}</h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-950">
                    <Compass size={24} />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {sprintSteps.map((step, index) => (
                    <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">0{index + 1}</span>
                        <CheckCircle2 size={17} className="text-emerald-300" />
                      </div>
                      <p className="text-sm font-bold leading-6 text-gray-100 font-khmer">{t(step, sprintStepsKm[index])}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-4">
                  <TimerReset className="shrink-0 text-white" size={22} />
                  <p className="text-sm font-bold leading-6 text-white font-khmer">
                    {t('Best for brands that need a polished first impression and more qualified inquiries.', 'សាកសមសម្រាប់ម៉ាកដែលចង់បាន first impression ស្អាត និង inquiry មានគុណភាពច្រើនជាងមុន។')}
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {conversionCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <RevealOnScroll key={card.title} delay={index * 90}>
                <article className="group h-full rounded-[2rem] border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-white/[0.045] dark:hover:border-white/20">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:text-indigo-200">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-black text-gray-950 dark:text-white font-khmer">{t(card.title, card.titleKm)}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400 font-khmer">{t(card.description, card.descriptionKm)}</p>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={260}>
          <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-xl shadow-indigo-500/10 dark:border-white/10 dark:bg-gray-950/80 md:flex-row md:p-6">
            <div>
              <p className="text-xl font-black text-gray-950 dark:text-white font-khmer">{t('Want this direction for your brand?', 'ចង់បានទិសដៅបែបនេះសម្រាប់ម៉ាករបស់អ្នកទេ?')}</p>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400 font-khmer">{t('Send us a short brief and we will suggest the best service path for your budget and timeline.', 'ផ្ញើ brief ខ្លីមកយើង ហើយយើងនឹងណែនាំផ្លូវសេវាកម្មដែលសមនឹងថវិកា និងពេលវេលារបស់អ្នក។')}</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a href="/contact" onClick={(event) => navigateToPage(event, '/contact')} className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-sm font-black text-white transition-all hover:-translate-y-1 hover:bg-indigo-600 dark:bg-white dark:text-gray-950 dark:hover:bg-indigo-100 font-khmer">
                {t('Start a brief', 'ចាប់ផ្តើម Brief')}
                <ArrowRight size={17} />
              </a>
              <a href="/services" onClick={(event) => navigateToPage(event, '/services')} className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-black text-gray-700 transition-all hover:-translate-y-1 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:text-gray-200 dark:hover:border-white/25 font-khmer">
                {t('Explore services', 'មើលសេវាកម្ម')}
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default HomeConversion;
