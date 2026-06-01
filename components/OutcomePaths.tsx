import React from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Building2,
  Camera,
  CheckCircle2,
  FileText,
  Languages,
  LayoutTemplate,
  Palette,
  Route,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';


const supportedLangs = ['en', 'km', 'fr', 'ja', 'ko', 'de', 'zh-CN', 'es', 'ar'];

const getLanguagePrefix = () => {
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment && supportedLangs.includes(firstSegment) ? `/${firstSegment}` : '';
};

const paths = [
  {
    icon: LayoutTemplate,
    title: 'Launch a website or app',
    titleKm: 'ចាប់ផ្តើមវេបសាយ ឬ App',
    audience: 'For founders and teams who need a clear online presence, polished UI, and a path from visitor to lead.',
    audienceKm: 'សម្រាប់ម្ចាស់អាជីវកម្ម និងក្រុមការងារដែលត្រូវការវត្តមានអនឡាញច្បាស់ UI ស្អាត និងលំហូរពីអ្នកទស្សនាទៅជា lead។',
    deliverables: ['Website / app prototype', 'Service page structure', 'SEO + conversion flow'],
    deliverablesKm: ['Prototype វេបសាយ / App', 'រចនាសម្ព័ន្ធទំព័រសេវាកម្ម', 'SEO + លំហូរ conversion'],
    primaryHref: '/services',
    primaryLabel: 'Explore digital services',
    primaryLabelKm: 'មើលសេវាកម្មឌីជីថល',
    secondaryHref: '/projects',
    secondaryLabel: 'See related work',
    secondaryLabelKm: 'មើលស្នាដៃពាក់ព័ន្ធ',
    accent: 'from-indigo-500 to-cyan-400',
  },
  {
    icon: Palette,
    title: 'Refresh a brand identity',
    titleKm: 'កែលម្អអត្តសញ្ញាណម៉ាក',
    audience: 'For brands that need stronger visuals, social content, packaging, or campaign assets that feel consistent.',
    audienceKm: 'សម្រាប់ម៉ាកដែលត្រូវការរូបភាពខ្លាំងជាងមុន មាតិកា social packaging ឬ asset ផ្សព្វផ្សាយដែលស្ថិតស្ថេរ។',
    deliverables: ['Logo + visual system', 'Social media templates', 'Marketing assets'],
    deliverablesKm: ['Logo + visual system', 'Template សម្រាប់ social media', 'សម្ភារៈទីផ្សារ'],
    primaryHref: '/services',
    primaryLabel: 'Review creative offers',
    primaryLabelKm: 'ពិនិត្យសេវាកម្មច្នៃប្រឌិត',
    secondaryHref: '/projects',
    secondaryLabel: 'View visual proof',
    secondaryLabelKm: 'មើលភស្តុតាងរូបភាព',
    accent: 'from-fuchsia-500 to-pink-400',
  },
  {
    icon: Building2,
    title: 'Plan a space or interior',
    titleKm: 'រៀបចំទីធ្លា ឬ Interior',
    audience: 'For home and business owners who need architecture concepts, 3D direction, or build-ready planning.',
    audienceKm: 'សម្រាប់ម្ចាស់ផ្ទះ និងអាជីវកម្មដែលត្រូវការ concept ស្ថាបត្យកម្ម ទិសដៅ 3D ឬផែនការសម្រាប់សាងសង់។',
    deliverables: ['Concept + floor plan', '3D modeling direction', 'Interior / landscape scope'],
    deliverablesKm: ['Concept + ប្លង់ជាន់', 'ទិសដៅម៉ូដែល 3D', 'Scope interior / សួនច្បារ'],
    primaryHref: '/services',
    primaryLabel: 'Open architecture service',
    primaryLabelKm: 'បើកសេវាកម្មស្ថាបត្យកម្ម',
    secondaryHref: '/company',
    secondaryLabel: 'Meet the studio',
    secondaryLabelKm: 'ស្គាល់ស្ទូឌីយោ',
    accent: 'from-emerald-500 to-teal-400',
  },
  {
    icon: Languages,
    title: 'Localize content or media',
    titleKm: 'បកប្រែ ឬផលិតមាតិកា Media',
    audience: 'For teams that need Khmer, English, and Arabic communication, photography, video, or launch content.',
    audienceKm: 'សម្រាប់ក្រុមដែលត្រូវការទំនាក់ទំនងខ្មែរ អង់គ្លេស អារ៉ាប់ ថតរូប វីដេអូ ឬមាតិកាបើកដំណើរការ។',
    deliverables: ['Translation + localization', 'Photo / video production', 'Launch-ready content'],
    deliverablesKm: ['បកប្រែ + localization', 'ផលិតរូបថត / វីដេអូ', 'មាតិកាសម្រាប់បើកដំណើរការ'],
    primaryHref: '/contact',
    primaryLabel: 'Send a brief',
    primaryLabelKm: 'ផ្ញើ brief',
    secondaryHref: '/services',
    secondaryLabel: 'Compare services',
    secondaryLabelKm: 'ប្រៀបធៀបសេវាកម្ម',
    accent: 'from-amber-500 to-orange-400',
  },
];

const pageConnections = [
  { icon: Blocks, label: 'Services', labelKm: 'សេវាកម្ម', copy: 'Match your need to the right offer.', copyKm: 'ផ្គូផ្គងតម្រូវការទៅសេវាកម្មត្រឹមត្រូវ។', href: '/services' },
  { icon: Camera, label: 'Projects', labelKm: 'គម្រោង', copy: 'Check the visual proof before you decide.', copyKm: 'ពិនិត្យភស្តុតាងរូបភាពមុនសម្រេចចិត្ត។', href: '/projects' },
  { icon: BadgeCheck, label: 'Company', labelKm: 'ក្រុមហ៊ុន', copy: 'Understand the people and process.', copyKm: 'យល់ពីក្រុមការងារ និងដំណើរការ។', href: '/company' },
  { icon: FileText, label: 'Contact', labelKm: 'ទំនាក់ទំនង', copy: 'Turn the idea into a scoped plan.', copyKm: 'បំលែងគំនិតទៅជាផែនការមាន scope។', href: '/contact' },
];

const OutcomePaths: React.FC = () => {
  const { t } = useLanguage();

  const navigateToPage = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    window.history.pushState(null, '', `${getLanguagePrefix()}${path}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="outcome-paths" className="relative overflow-hidden bg-gray-50 py-24 dark:bg-gray-900/70 md:py-28">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,0.14),transparent_32%),radial-gradient(circle_at_85%_75%,rgba(16,185,129,0.12),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(238,242,255,0.45))] dark:bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,0.16),transparent_32%),radial-gradient(circle_at_85%_75%,rgba(16,185,129,0.12),transparent_30%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="mx-auto mb-14 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 font-khmer text-xs font-black uppercase tracking-[0.22em] text-indigo-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:text-indigo-200">
            <Route size={15} /> {t('Find the right next step', 'រកជំហានបន្ទាប់ដែលត្រឹមត្រូវ')}
          </span>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-gray-950 dark:text-white md:text-6xl font-khmer">
            {t('Help visitors choose', 'ជួយឲ្យអតិថិជនជ្រើសរើស')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-400">{t('with confidence.', 'ដោយមានទំនុកចិត្ត។')}</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-400 font-khmer">
            {t(
              'The homepage now works like a guided intake: visitors can recognize their situation, jump to the most relevant page, and understand what Ponloe Creative can deliver before they contact you.',
              'Homepage ឥឡូវដំណើរការដូចជា guided intake៖ អ្នកទស្សនាអាចស្គាល់ស្ថានភាពរបស់ខ្លួន ចូលទៅទំព័រដែលពាក់ព័ន្ធបំផុត ហើយយល់ថា Ponloe Creative អាចប្រគល់អ្វីបាន មុនពេលទាក់ទង។'
            )}
          </p>
        </RevealOnScroll>

        <div className="grid gap-6 lg:grid-cols-2">
          {paths.map((path, index) => {
            const Icon = path.icon;
            return (
              <RevealOnScroll key={path.title} delay={index * 90}>
                <article className="group relative h-full overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-gray-950/80 dark:hover:border-white/20 md:p-7">
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${path.accent}`} />
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl transition-transform duration-500 group-hover:scale-125" />

                  <div className="relative mb-6 flex items-start justify-between gap-5">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${path.accent} text-white shadow-lg shadow-indigo-500/20`}>
                      <Icon size={25} />
                    </div>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-gray-500 dark:bg-white/10 dark:text-gray-300">
                      {t('Best fit', 'សាកសមបំផុត')}
                    </span>
                  </div>

                  <h3 className="relative text-2xl font-black text-gray-950 dark:text-white font-khmer">{t(path.title, path.titleKm)}</h3>
                  <p className="relative mt-4 text-sm leading-7 text-gray-600 dark:text-gray-400 font-khmer">{t(path.audience, path.audienceKm)}</p>

                  <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
                    {path.deliverables.map((deliverable, deliverableIndex) => (
                      <div key={deliverable} className="flex items-start gap-2 rounded-2xl bg-gray-50 p-3 text-sm font-bold leading-6 text-gray-700 dark:bg-white/[0.04] dark:text-gray-300 font-khmer">
                        <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" />
                        {t(deliverable, path.deliverablesKm[deliverableIndex])}
                      </div>
                    ))}
                  </div>

                  <div className="relative mt-7 flex flex-wrap gap-3">
                    <a href={path.primaryHref} onClick={(event) => navigateToPage(event, path.primaryHref)} className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-indigo-600 dark:bg-white dark:text-gray-950 dark:hover:bg-indigo-200 font-khmer">
                      {t(path.primaryLabel, path.primaryLabelKm)}
                      <ArrowRight size={17} />
                    </a>
                    <a href={path.secondaryHref} onClick={(event) => navigateToPage(event, path.secondaryHref)} className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-black text-gray-700 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:text-gray-200 dark:hover:border-white/25 font-khmer">
                      {t(path.secondaryLabel, path.secondaryLabelKm)}
                    </a>
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={260}>
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-gray-200 bg-white/85 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <div className="grid gap-3 md:grid-cols-4">
              {pageConnections.map((connection) => {
                const Icon = connection.icon;
                return (
                  <a key={connection.href} href={connection.href} onClick={(event) => navigateToPage(event, connection.href)} className="group flex items-start gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:-translate-y-1 hover:bg-indigo-50 dark:bg-gray-950/70 dark:hover:bg-white/[0.07]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white font-khmer">{t(connection.label, connection.labelKm)}</p>
                      <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400 font-khmer">{t(connection.copy, connection.copyKm)}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={320}>
          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-[2rem] bg-gray-950 p-6 text-white shadow-2xl shadow-indigo-500/10 dark:bg-white/[0.06] md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
                <Sparkles size={22} />
              </div>
              <div>
                <p className="text-lg font-black font-khmer">{t('Not sure which path fits?', 'មិនប្រាកដថាផ្លូវណាសាកសម?')}</p>
                <p className="mt-1 text-sm text-gray-300 font-khmer">{t('Send a short brief and the team can map the right scope before design starts.', 'ផ្ញើ brief ខ្លីៗ ហើយក្រុមការងារអាចរៀបចំ scope ត្រឹមត្រូវមុនចាប់ផ្តើម design។')}</p>
              </div>
            </div>
            <a href="/contact" onClick={(event) => navigateToPage(event, '/contact')} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-gray-950 transition-all hover:-translate-y-1 hover:bg-indigo-100 font-khmer">
              {t('Start with a brief', 'ចាប់ផ្តើមជាមួយ brief')}
              <ArrowRight size={17} />
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default OutcomePaths;
