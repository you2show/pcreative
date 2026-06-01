import React from 'react';
import { ArrowRight, CheckCircle2, Code2, LayoutDashboard, Rocket, Smartphone, Sparkles, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';
import ScrollBackgroundText from './ScrollBackgroundText';

const experiencePillars = [
  {
    icon: LayoutDashboard,
    title: 'Conversion-led websites',
    titleKm: 'វេបសាយដែលជួយបម្លែងអតិថិជន',
    description: 'High-impact landing pages, service pages, portfolios, and CMS-ready content flows designed to turn visitors into leads.',
    descriptionKm: 'Landing page, ទំព័រសេវាកម្ម, portfolio និងលំហូរមាតិកាដែលរៀបចំឲ្យអ្នកទស្សនាក្លាយជាអតិថិជន។',
  },
  {
    icon: Smartphone,
    title: 'Mobile app experiences',
    titleKm: 'បទពិសោធន៍ Mobile App',
    description: 'App screens, onboarding, dashboards, booking flows, and polished UI systems that feel premium from the first tap.',
    descriptionKm: 'រចនាផ្ទាំង app, onboarding, dashboard, booking flow និង UI system ដែលមើលទៅ premium ចាប់ពីការចុចដំបូង។',
  },
  {
    icon: Code2,
    title: 'Real build strategy',
    titleKm: 'យុទ្ធសាស្ត្រសាងសង់ពិតប្រាកដ',
    description: 'Design decisions are paired with build-ready components, performance priorities, SEO structure, and launch planning.',
    descriptionKm: 'រាល់ការរចនាភ្ជាប់ជាមួយ component ដែលអភិវឌ្ឍបានពិត, performance, SEO និងផែនការបើកដំណើរការ។',
  },
];

const launchSteps = [
  'Brand-first UI direction',
  'Responsive web + app prototypes',
  'Content, SEO & conversion map',
  'Launch support and iteration',
];

const launchStepsKm = [
  'ទិសដៅ UI ផ្អែកលើអត្តសញ្ញាណម៉ាក',
  'Prototype សម្រាប់ web និង app',
  'ផែនទីមាតិកា SEO និង conversion',
  'គាំទ្រការបើកដំណើរការ និងកែលម្អបន្ត',
];

const ExperienceLab: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="experience-lab" className="relative overflow-hidden bg-gray-950 py-24 text-white md:py-32">
      <ScrollBackgroundText text="WOW LAB" className="top-0 opacity-80" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />
        <div className="absolute -right-24 bottom-10 h-[420px] w-[420px] rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_32%),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:100%_100%,48px_48px,48px_48px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <RevealOnScroll variant="slide-right" className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-indigo-200 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl font-khmer">
            <Sparkles size={18} className="text-pink-300" />
            {t('Premium Web & App Studio', 'ស្ទូឌីយោ Web & App គុណភាពខ្ពស់')}
          </div>

          <div className="space-y-5">
            <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl font-khmer">
              {t('Design that feels', 'ការរចនាដែលមានអារម្មណ៍')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-pink-300">{t('premium', 'premium')}</span>{' '}
              {t('and works hard.', 'ហើយជួយអាជីវកម្មពិត។')}
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-300 font-khmer">
              {t(
<<<<<<< HEAD
                'Clean UI, clear UX, fast build — made to look premium and feel easy.',
                'UI ស្អាត UX ច្បាស់ និង build លឿន — មើលទៅ premium ហើយប្រើងាយ។'
=======
                'We combine clean UI, clear UX flow, fast development, and launch-ready strategy so your website or app looks impressive and feels easy to use.',
                'យើងបញ្ចូល UI ស្អាត UX ច្បាស់ ការអភិវឌ្ឍលឿន និងយុទ្ធសាស្ត្រ launch-ready ដើម្បីឲ្យវេបសាយ ឬ app របស់អ្នកមើលទៅទាក់ទាញ និងប្រើងាយ។'
>>>>>>> origin/main
              )}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
              <div className="text-3xl font-black text-white">3 sec</div>
              <p className="mt-2 text-sm text-gray-400 font-khmer">{t('Clarity before hesitation', 'ច្បាស់មុនការស្ទាក់ស្ទើរ')}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
              <div className="text-3xl font-black text-white">Web + App</div>
              <p className="mt-2 text-sm text-gray-400 font-khmer">{t('Unified website and app experience', 'បទពិសោធន៍ website និង app តែមួយ')}</p>
            </div>
          </div>

          <a href="/projects" className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-bold text-gray-950 transition-all hover:-translate-y-1 hover:bg-indigo-50 hover:shadow-[0_18px_60px_rgba(129,140,248,0.35)] font-khmer">
            {t('View product-style projects', 'មើលគម្រោងរចនាបែបផលិតផល')}
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </a>
        </RevealOnScroll>

        <RevealOnScroll variant="slide-left" delay={120}>
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/20 to-pink-500/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gray-900/80 p-4 shadow-2xl shadow-black/50 backdrop-blur-2xl">
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-300" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">ponloe.app</span>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_0.72fr]">
                <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/10 p-5">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-200">Dashboard</div>
                      <h3 className="mt-2 text-2xl font-black font-khmer">{t('Client Portal', 'ផ្ទាំងអតិថិជន')}</h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-950">
                      <Rocket size={22} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[84, 62, 92].map((width, index) => (
                      <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                        <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                          <span>{t(['Design', 'Build', 'Launch'][index], ['រចនា', 'អភិវឌ្ឍ', 'បើកដំណើរការ'][index])}</span>
                          <span>{width}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-indigo-300 to-pink-300" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-black p-3 shadow-2xl md:-mb-10 md:mt-10">
                  <div className="rounded-[1.5rem] bg-gray-950 p-4">
                    <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/20" />
                    <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 p-4 text-center">
                      <Zap className="mx-auto mb-3 text-white" size={28} />
                      <div className="text-sm font-black font-khmer">{t('App Prototype', 'គំរូ App')}</div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {launchSteps.slice(0, 3).map((step, index) => (
                        <div key={step} className="flex items-center gap-2 rounded-xl bg-white/[0.06] p-3 text-xs text-gray-300 font-khmer">
                          <CheckCircle2 size={15} className="text-emerald-300" />
                          {t(step, launchStepsKm[index])}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      <div className="relative z-10 mx-auto mt-14 grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {experiencePillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <RevealOnScroll key={pillar.title} delay={index * 100} variant="fade-up">
              <div className="h-full rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300/40 hover:bg-white/[0.07]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-200">
                  <Icon size={23} />
                </div>
                <h3 className="text-xl font-black text-white font-khmer">{t(pillar.title, pillar.titleKm)}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-400 font-khmer">{t(pillar.description, pillar.descriptionKm)}</p>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
};

export default ExperienceLab;
