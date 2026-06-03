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
  Zap,
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
    tag: 'Digital',
    tagKm: 'ឌីជីថល',
    audience: 'Build a clear online home that guides visitors from first impression to inquiry.',
    audienceKm: 'បង្កើតវត្តមានអនឡាញច្បាស់ ដែលនាំអ្នកទស្សនាពីចំណាប់អារម្មណ៍ដំបូងទៅកាន់ការសាកសួរ។',
    deliverables: ['Website / app prototype', 'Service page structure', 'SEO + lead flow'],
    deliverablesKm: ['Prototype វេបសាយ / App', 'រចនាសម្ព័ន្ធទំព័រសេវាកម្ម', 'SEO + លំហូរ lead'],
    primaryHref: '/services',
    primaryLabel: 'Explore digital services',
    primaryLabelKm: 'មើលសេវាកម្មឌីជីថល',
    secondaryHref: '/projects',
    secondaryLabel: 'See related work',
    secondaryLabelKm: 'មើលស្នាដៃពាក់ព័ន្ធ',
    accent: 'from-indigo-500 to-cyan-400',
    accentBorder: 'border-indigo-400/60',
    accentBg: 'bg-indigo-500/10',
    accentText: 'text-indigo-500',
    accentDot: 'bg-indigo-500',
    image: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?auto=format&fit=crop&q=85&w=900',
    imageAlt: 'Website and app interface design preview',
    imageAltKm: 'រូបភាព preview រចនា website និង app',
  },
  {
    icon: Palette,
    title: 'Refresh a brand identity',
    titleKm: 'កែលម្អអត្តសញ្ញាណម៉ាក',
    tag: 'Creative',
    tagKm: 'ច្នៃប្រឌិត',
    audience: 'Make your logo, social visuals, and campaign assets feel consistent and premium.',
    audienceKm: 'ធ្វើឲ្យ logo, រូបភាព social និង asset ផ្សព្វផ្សាយរបស់អ្នកមើលទៅស្ថិតស្ថេរ និង premium។',
    deliverables: ['Logo + visual system', 'Social media templates', 'Marketing assets'],
    deliverablesKm: ['Logo + visual system', 'Template សម្រាប់ social media', 'សម្ភារៈទីផ្សារ'],
    primaryHref: '/services',
    primaryLabel: 'Review creative offers',
    primaryLabelKm: 'ពិនិត្យសេវាកម្មច្នៃប្រឌិត',
    secondaryHref: '/projects',
    secondaryLabel: 'View visual proof',
    secondaryLabelKm: 'មើលភស្តុតាងរូបភាព',
    accent: 'from-fuchsia-500 to-pink-400',
    accentBorder: 'border-fuchsia-400/60',
    accentBg: 'bg-fuchsia-500/10',
    accentText: 'text-fuchsia-500',
    accentDot: 'bg-fuchsia-500',
    image: 'https://images.unsplash.com/photo-1613909207039-6b173b755cc1?auto=format&fit=crop&q=85&w=900',
    imageAlt: 'Brand identity and creative visuals preview',
    imageAltKm: 'រូបភាព preview អត្តសញ្ញាណម៉ាក និង creative visual',
  },
  {
    icon: Building2,
    title: 'Plan a space or interior',
    titleKm: 'រៀបចំទីធ្លា ឬ Interior',
    tag: 'Architecture',
    tagKm: 'ស្ថាបត្យកម្ម',
    audience: 'Turn a home, office, or shop idea into a visual plan your team can discuss.',
    audienceKm: 'បំលែងគំនិតផ្ទះ ការិយាល័យ ឬហាង ទៅជាផែនការរូបភាពដែលក្រុមអាចពិភាក្សាបាន។',
    deliverables: ['Concept + floor plan', '3D modeling direction', 'Interior / landscape scope'],
    deliverablesKm: ['Concept + ប្លង់ជាន់', 'ទិសដៅម៉ូដែល 3D', 'Scope interior / សួនច្បារ'],
    primaryHref: '/services',
    primaryLabel: 'Open architecture service',
    primaryLabelKm: 'បើកសេវាកម្មស្ថាបត្យកម្ម',
    secondaryHref: '/company',
    secondaryLabel: 'Meet the studio',
    secondaryLabelKm: 'ស្គាល់ស្ទូឌីយោ',
    accent: 'from-emerald-500 to-teal-400',
    accentBorder: 'border-emerald-400/60',
    accentBg: 'bg-emerald-500/10',
    accentText: 'text-emerald-500',
    accentDot: 'bg-emerald-500',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=85&w=900',
    imageAlt: 'Interior and architecture concept preview',
    imageAltKm: 'រូបភាព preview interior និង architecture concept',
  },
  {
    icon: Languages,
    title: 'Localize content or media',
    titleKm: 'បកប្រែ ឬផលិតមាតិកា Media',
    tag: 'Media',
    tagKm: 'មេឌា',
    audience: 'Prepare Khmer, English, Arabic, photo, and video content for a smooth launch.',
    audienceKm: 'រៀបចំមាតិកាខ្មែរ អង់គ្លេស អារ៉ាប់ រូបថត និងវីដេអូ សម្រាប់ការបើកដំណើរការរលូន។',
    deliverables: ['Translation + localization', 'Photo / video production', 'Launch-ready content'],
    deliverablesKm: ['បកប្រែ + localization', 'ផលិតរូបថត / វីដេអូ', 'មាតិកាសម្រាប់បើកដំណើរការ'],
    primaryHref: '/contact',
    primaryLabel: 'Send a brief',
    primaryLabelKm: 'ផ្ញើ brief',
    secondaryHref: '/services',
    secondaryLabel: 'Compare services',
    secondaryLabelKm: 'ប្រៀបធៀបសេវាកម្ម',
    accent: 'from-amber-500 to-orange-400',
    accentBorder: 'border-amber-400/60',
    accentBg: 'bg-amber-500/10',
    accentText: 'text-amber-500',
    accentDot: 'bg-amber-500',
    image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=85&w=900',
    imageAlt: 'Photo video and localized content preview',
    imageAltKm: 'រូបភាព preview រូបថត វីដេអូ និងមាតិកាបកប្រែ',
  },
];

const quickChoices = [
  {
    question: 'Need a website or app?',
    questionKm: 'ត្រូវការ Website ឬ App?',
    answer: 'Start with digital services',
    answerKm: 'ចាប់ផ្តើមពីសេវាកម្មឌីជីថល',
    href: '/services',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=500',
  },
  {
    question: 'Need a stronger brand look?',
    questionKm: 'ត្រូវការ brand look ខ្លាំងជាងមុន?',
    answer: 'Review creative offers',
    answerKm: 'ពិនិត្យសេវាកម្មច្នៃប្រឌិត',
    href: '/services',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=500',
  },
  {
    question: 'Need proof before deciding?',
    questionKm: 'ចង់មើលភស្តុតាងមុនសម្រេច?',
    answer: 'Browse project examples',
    answerKm: 'មើលឧទាហរណ៍គម្រោង',
    href: '/projects',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=500',
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
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_20%,rgba(99,102,241,0.13),transparent_35%),radial-gradient(circle_at_88%_70%,rgba(16,185,129,0.10),transparent_32%),linear-gradient(160deg,rgba(255,255,255,0.95),rgba(238,242,255,0.5))] dark:bg-[radial-gradient(circle_at_10%_20%,rgba(99,102,241,0.16),transparent_35%),radial-gradient(circle_at_88%_70%,rgba(16,185,129,0.12),transparent_32%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <RevealOnScroll className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 font-khmer text-xs font-black uppercase tracking-[0.22em] text-indigo-600 shadow-md shadow-indigo-500/15 backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:text-indigo-200">
            <Route size={14} /> {t('Find the right next step', 'រកជំហានបន្ទាប់ដែលត្រឹមត្រូវ')}
          </span>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-gray-950 dark:text-white md:text-[3.6rem] md:leading-[1.12] font-khmer">
            {t('Choose your', 'ជ្រើសរើស')}{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-400 bg-clip-text text-transparent">
              {t('best service path.', 'ផ្លូវសេវាកម្មដែលសាកសម។')}
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-500 dark:text-gray-400 font-khmer">
            {t(
              'Pick the result you need, compare the right offer, and contact Ponloe Creative with a clearer brief.',
              'ជ្រើសលទ្ធផលដែលអ្នកត្រូវការ ប្រៀបធៀបសេវាកម្មត្រឹមត្រូវ ហើយទាក់ទង Ponloe Creative ជាមួយ brief កាន់តែច្បាស់។'
            )}
          </p>
        </RevealOnScroll>

        {/* ── QUICK CHOICE CARDS ── */}
        <RevealOnScroll delay={100}>
          <div className="mb-10 grid gap-3 rounded-[2rem] border border-indigo-100/80 bg-white/90 p-3 shadow-xl shadow-indigo-500/8 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/65 sm:grid-cols-3">
            {quickChoices.map((choice, index) => (
              <a
                key={choice.question}
                href={choice.href}
                onClick={(event) => navigateToPage(event, choice.href)}
                className="group relative flex min-h-[9.5rem] flex-col justify-end overflow-hidden rounded-[1.4rem] bg-gray-950 p-5 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/25 creative-card spotlight-hover"
              >
                <img
                  src={choice.image}
                  alt={t(choice.question, choice.questionKm)}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-75"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/40 to-transparent" />
                <div className="relative">
                  <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-xs font-black backdrop-blur-md transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white group-hover:scale-110">
                    {index + 1}
                  </span>
                  <p className="text-sm font-black leading-snug font-khmer">{t(choice.question, choice.questionKm)}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-indigo-200 font-khmer">
                    {t(choice.answer, choice.answerKm)}
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
              </a>
            ))}
          </div>
        </RevealOnScroll>

        {/* ── SERVICE PATH LIST ── */}
        <div className="flex flex-col gap-5">
          {paths.map((path, index) => {
            const Icon = path.icon;
            return (
              <RevealOnScroll key={path.title} delay={index * 80}>
                <article className={`group relative overflow-hidden rounded-[1.8rem] border bg-white shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl dark:bg-gray-950/80 dark:shadow-black/30 ${path.accentBorder} hover:border-opacity-100 dark:border-white/10 dark:hover:border-white/20 creative-card gradient-outline-hover`}>
                  {/* Accent top bar — thickens on hover */}
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${path.accent} transition-all duration-500 group-hover:h-1.5`} />
                  {/* Ambient glow reveal on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 60% 40% at 10% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)' }}
                  />

                  <div className="flex flex-col gap-0 md:flex-row">

                    {/* LEFT: Number + Icon + Info */}
                    <div className="flex flex-1 flex-col justify-between p-6 md:p-8">

                      {/* Top row: number badge + tag */}
                      <div className="mb-5 flex items-center gap-3">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${path.accent} text-xs font-black text-white shadow-lg`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-widest ${path.accentBg} ${path.accentText} ${path.accentBorder}`}>
                          {t(path.tag, path.tagKm)}
                        </span>
                        <div className="ml-auto hidden md:block">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${path.accent} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                            <Icon size={21} />
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-black leading-tight text-gray-950 dark:text-white font-khmer md:text-[1.65rem]">
                        {t(path.title, path.titleKm)}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400 font-khmer">
                        {t(path.audience, path.audienceKm)}
                      </p>

                      {/* Deliverables list */}
                      <ul className="mt-5 space-y-2.5">
                        {path.deliverables.map((deliverable, di) => (
                          <li key={deliverable} className="flex items-center gap-3 font-khmer">
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${path.accentBg}`}>
                              <CheckCircle2 size={13} className={path.accentText} />
                            </span>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {t(deliverable, path.deliverablesKm[di])}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTAs */}
                      <div className="mt-7 flex flex-wrap gap-3">
                        <a
                          href={path.primaryHref}
                          onClick={(event) => navigateToPage(event, path.primaryHref)}
                          className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${path.accent} px-5 py-2.5 text-sm font-black text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg font-khmer`}
                        >
                          {t(path.primaryLabel, path.primaryLabelKm)}
                          <ArrowRight size={16} />
                        </a>
                        <a
                          href={path.secondaryHref}
                          onClick={(event) => navigateToPage(event, path.secondaryHref)}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-black text-gray-600 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:text-gray-950 dark:border-white/10 dark:text-gray-300 dark:hover:border-white/25 dark:hover:text-white font-khmer"
                        >
                          {t(path.secondaryLabel, path.secondaryLabelKm)}
                        </a>
                      </div>
                    </div>

                    {/* RIGHT: Image */}
                    <div className="relative hidden w-72 shrink-0 overflow-hidden md:block lg:w-80">
                      <img
                        src={path.image}
                        alt={t(path.imageAlt, path.imageAltKm)}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-transparent dark:from-gray-950/80" />
                    </div>
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* ── PAGE CONNECTIONS ── */}
        <RevealOnScroll delay={240}>
          <div className="mt-10 overflow-hidden rounded-[1.8rem] border border-gray-200/80 bg-white/85 p-4 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {pageConnections.map((connection) => {
                const Icon = connection.icon;
                return (
                  <a
                    key={connection.href}
                    href={connection.href}
                    onClick={(event) => navigateToPage(event, connection.href)}
                    className="group flex items-start gap-3 rounded-[1.1rem] bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-50 hover:shadow-md hover:shadow-indigo-500/10 dark:bg-gray-950/70 dark:hover:bg-white/[0.07] creative-card"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/25">
                      <Icon size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white font-khmer">{t(connection.label, connection.labelKm)}</p>
                      <p className="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-400 font-khmer">{t(connection.copy, connection.copyKm)}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>

        {/* ── BOTTOM CTA BANNER ── */}
        <RevealOnScroll delay={310}>
          <div className="mt-6 flex flex-col items-center justify-between gap-5 overflow-hidden rounded-[1.8rem] bg-gray-950 px-7 py-6 text-white shadow-2xl shadow-indigo-500/20 ring-1 ring-inset ring-white/[0.07] dark:bg-white/[0.06] md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-emerald-500/20 text-emerald-300">
                <Sparkles size={22} />
              </div>
              <div>
                <p className="text-base font-black font-khmer md:text-lg">{t('Not sure which path fits?', 'មិនប្រាកដថាផ្លូវណាសាកសម?')}</p>
                <p className="mt-0.5 text-sm text-gray-400 font-khmer">{t('Send a short brief and the team can map the right scope before design starts.', 'ផ្ញើ brief ខ្លីៗ ហើយក្រុមការងារអាចរៀបចំ scope ត្រឹមត្រូវមុនចាប់ផ្តើម design។')}</p>
              </div>
            </div>
            <a
              href="/contact"
              onClick={(event) => navigateToPage(event, '/contact')}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-gray-950 shadow-lg transition-all hover:-translate-y-1 hover:bg-indigo-50 font-khmer"
            >
              <Zap size={15} className="text-indigo-500" />
              {t('Start with a brief', 'ចាប់ផ្តើមជាមួយ brief')}
              <ArrowRight size={15} />
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default OutcomePaths;
