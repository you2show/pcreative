import React from 'react';
import { ArrowRight, CheckCircle2, LayoutTemplate, RefreshCw, ShieldCheck, Smartphone, Timer, Wand2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

const paths = [
  {
    icon: LayoutTemplate,
    title: 'Launch a premium website',
    titleKm: 'បើកដំណើរការវេបសាយ premium',
    pain: 'For businesses that need a polished first impression, clear service pages, and lead-focused contact flow.',
    painKm: 'សម្រាប់អាជីវកម្មដែលត្រូវការចំណាប់អារម្មណ៍ដំបូងល្អ ទំព័រសេវាកម្មច្បាស់ និងលំហូរទំនាក់ទំនងដែលបង្កើត lead។',
    deliverables: ['Landing page', 'Service structure', 'SEO-ready content', 'Contact funnel'],
    deliverablesKm: ['Landing page', 'រចនាសម្ព័ន្ធសេវាកម្ម', 'មាតិកា SEO-ready', 'Contact funnel'],
    timeline: '2–4 weeks',
    accent: 'from-indigo-500 to-cyan-400',
  },
  {
    icon: RefreshCw,
    title: 'Upgrade an existing brand',
    titleKm: 'កែលម្អម៉ាក/វេបសាយដែលមានស្រាប់',
    pain: 'For teams whose current website looks outdated, loads slowly, or does not communicate quality clearly.',
    painKm: 'សម្រាប់ក្រុមដែលវេបសាយបច្ចុប្បន្នមើលទៅចាស់ ដំណើរការយឺត ឬមិនបង្ហាញគុណភាពបានច្បាស់។',
    deliverables: ['UX audit', 'Visual refresh', 'Performance cleanup', 'Conversion fixes'],
    deliverablesKm: ['UX audit', 'កែលម្អរូបរាង', 'កែលម្អ performance', 'កែ conversion'],
    timeline: '1–3 weeks',
    accent: 'from-fuchsia-500 to-pink-400',
  },
  {
    icon: Smartphone,
    title: 'Prototype a mobile app',
    titleKm: 'ធ្វើ prototype សម្រាប់ Mobile App',
    pain: 'For founders who need app screens, user flows, and a clickable prototype before investing in full development.',
    painKm: 'សម្រាប់ម្ចាស់គំនិតដែលត្រូវការ screen, user flow និង clickable prototype មុនវិនិយោគអភិវឌ្ឍពេញលេញ។',
    deliverables: ['App UX flow', 'UI screens', 'Clickable prototype', 'Build roadmap'],
    deliverablesKm: ['App UX flow', 'UI screens', 'Clickable prototype', 'ផែនការ build'],
    timeline: '2–5 weeks',
    accent: 'from-emerald-500 to-teal-400',
  },
];

const trustSignals = [
  { icon: ShieldCheck, label: 'Clear scope before build', labelKm: 'Scope ច្បាស់មុនអភិវឌ្ឍ' },
  { icon: Timer, label: 'Milestone-based delivery', labelKm: 'ប្រគល់តាម milestone' },
  { icon: Wand2, label: 'Premium UI direction', labelKm: 'ទិសដៅ UI គុណភាពខ្ពស់' },
];

const OutcomePaths: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="outcome-paths" className="relative overflow-hidden bg-gray-50 py-24 dark:bg-gray-900/70 md:py-28">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,0.12),transparent_32%),radial-gradient(circle_at_85%_75%,rgba(16,185,129,0.10),transparent_30%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="mx-auto mb-14 max-w-3xl text-center">
          <span className="font-khmer text-sm font-black uppercase tracking-[0.24em] text-indigo-500 dark:text-indigo-300">
            {t('Choose your project path', 'ជ្រើសផ្លូវគម្រោងរបស់អ្នក')}
          </span>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-gray-950 dark:text-white md:text-6xl font-khmer">
            {t('Help visitors self-select', 'ជួយឲ្យអតិថិជនជ្រើសរើសដោយខ្លួនឯង')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-400">{t('faster.', 'ឲ្យលឿន។')}</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-400 font-khmer">
            {t(
              'A strong service homepage should not make people guess. These outcome paths turn “I need something digital” into a clear starting point with scope, value, and timing.',
              'Homepage សេវាកម្មល្អមិនគួរឲ្យអតិថិជនស្មានទេ។ ផ្លូវគម្រោងទាំងនេះបំលែង “ខ្ញុំត្រូវការអ្វីមួយ digital” ទៅជាចំណុចចាប់ផ្តើមច្បាស់ មាន scope តម្លៃ និងពេលវេលា។'
            )}
          </p>
        </RevealOnScroll>

        <div className="grid gap-6 lg:grid-cols-3">
          {paths.map((path, index) => {
            const Icon = path.icon;
            return (
              <RevealOnScroll key={path.title} delay={index * 100}>
                <article className="group relative h-full overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-gray-950/80 dark:hover:border-white/20">
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${path.accent}`} />
                  <div className="mb-6 flex items-center justify-between">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${path.accent} text-white shadow-lg shadow-indigo-500/20`}>
                      <Icon size={25} />
                    </div>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500 dark:bg-white/10 dark:text-gray-300">
                      {path.timeline}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-950 dark:text-white font-khmer">{t(path.title, path.titleKm)}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-400 font-khmer">{t(path.pain, path.painKm)}</p>

                  <div className="mt-6 space-y-3">
                    {path.deliverables.map((deliverable, deliverableIndex) => (
                      <div key={deliverable} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3 text-sm font-bold text-gray-700 dark:bg-white/[0.04] dark:text-gray-300 font-khmer">
                        <CheckCircle2 size={17} className="shrink-0 text-emerald-500" />
                        {t(deliverable, path.deliverablesKm[deliverableIndex])}
                      </div>
                    ))}
                  </div>

                  <a href="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-indigo-500 transition-colors group-hover:text-indigo-600 dark:text-indigo-300 font-khmer">
                    {t('Discuss this path', 'ពិភាក្សាផ្លូវនេះ')}
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={260}>
          <div className="mt-10 grid gap-4 rounded-[2rem] border border-gray-200 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] md:grid-cols-3">
            {trustSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div key={signal.label} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-gray-950/70">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Icon size={20} />
                  </div>
                  <p className="text-sm font-black text-gray-800 dark:text-gray-200 font-khmer">{t(signal.label, signal.labelKm)}</p>
                </div>
              );
            })}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default OutcomePaths;
