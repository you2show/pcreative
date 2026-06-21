import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronsDown, ChevronsUp, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollBackgroundText from './ScrollBackgroundText';
import RevealOnScroll from './RevealOnScroll';

interface FAQItem {
  question: string;
  questionKm: string;
  answer: string;
  answerKm: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How long does it take to build a website?',
    questionKm: 'ការធ្វើវេបសាយចំណាយពេលប៉ុន្មាន?',
    answer: 'A typical website takes 2–4 weeks depending on complexity. Simple landing pages can be delivered in 1 week, while complex web apps may take 6–12 weeks. We always provide a clear timeline before starting.',
    answerKm: 'វេបសាយធម្មតាចំណាយពេល ២–៤ សប្ដាហ៍ អាស្រ័យលើភាពស្មុគស្មាញ។ ទំព័រ landing សាមញ្ញអាចបញ្ចប់ក្នុង ១ សប្ដាហ៍ ខណៈ web app ស្មុគស្មាញអាចចំណាយ ៦–១២ សប្ដាហ៍។ យើងផ្ដល់ timeline ច្បាស់មុនចាប់ផ្ដើម។',
  },
  {
    question: "What's the price for a website?",
    questionKm: 'តម្លៃធ្វើវេបសាយប៉ុន្មាន?',
    answer: 'Prices start from $300 for a simple landing page and go up based on features, pages, and complexity. We offer transparent pricing — use our Cost Estimator tool to get an instant estimate for your project.',
    answerKm: 'តម្លៃចាប់ផ្ដើមពី $300 សម្រាប់ landing page សាមញ្ញ ហើយកើនឡើងអាស្រ័យលើមុខងារ ទំព័រ និងភាពស្មុគស្មាញ។ ប្រើឧបករណ៍ Cost Estimator របស់យើងដើម្បីទទួលការប៉ាន់ស្មានភ្លាមៗ។',
  },
  {
    question: 'Do you work remotely with clients outside Cambodia?',
    questionKm: 'តើអ្នករំលែកការងារពីចម្ងាយជាមួយអតិថិជននៅក្រៅប្រទេសកម្ពុជាដែរឬទេ?',
    answer: 'Absolutely! We work with clients worldwide. All communication is done via Telegram, email, or video call. We support multiple time zones and deliver projects digitally.',
    answerKm: 'បាន! យើងធ្វើការជាមួយអតិថិជនទូទាំងពិភពលោក។ ការទំនាក់ទំនងទាំងអស់ធ្វើតាម Telegram, email, ឬ video call។ យើងគាំទ្រ timezone ច្រើន ហើយបញ្ជូនគម្រោងតាម digital។',
  },
  {
    question: 'What services do you offer?',
    questionKm: 'តើអ្នកផ្ដល់សេវាកម្មអ្វីខ្លះ?',
    answer: 'We offer Website Design & Development, Mobile App Development, Graphic Design & Branding, Architecture & Interior Design, MVAC Systems, Translation Services, and Digital Marketing.',
    answerKm: 'យើងផ្ដល់ ការរចនា និងអភិវឌ្ឍន៍វេបសាយ, ការអភិវឌ្ឍន៍កម្មវិធីទូរស័ព្ទ, ការរចនាក្រាហ្វិក & Branding, ស្ថាបត្យកម្ម & ការរចនាផ្ទៃក្នុង, ប្រព័ន្ធ MVAC, សេវាបកប្រែ, និងទីផ្សារឌីជីថល។',
  },
  {
    question: 'Do you provide support after project delivery?',
    questionKm: 'តើអ្នកផ្ដល់ការគាំទ្រក្រោយការបញ្ជូនគម្រោងដែរឬទេ?',
    answer: 'Yes! All projects include a post-launch support period. We offer monthly maintenance packages to keep your website fast, secure, and up to date.',
    answerKm: 'បាន! គម្រោងទាំងអស់មានរបៀបគាំទ្រក្រោយការចាប់ផ្ដើម។ យើងផ្ដល់កញ្ចប់ maintenance ប្រចាំខែ ដើម្បីរក្សាវេបសាយអ្នកឱ្យលឿន មានសុវត្ថិភាព និងទាន់សម័យ។',
  },
  {
    question: 'Can I update the website content myself?',
    questionKm: 'តើខ្ញុំអាចធ្វើបច្ចុប្បន្នភាពមាតិការវេបសាយដោយខ្លួនឯងបានទេ?',
    answer: 'Yes! We build websites with a user-friendly admin panel, so you can update text, images, products, and more without any coding knowledge.',
    answerKm: 'បាន! យើងសាងសង់វេបសាយជាមួយ admin panel ងាយប្រើ ដើម្បីឱ្យអ្នកអាចធ្វើបច្ចុប្បន្នភាពអត្ថបទ រូបភាព ផលិតផល ជាដើម ដោយគ្មានចំណេះដឹងសរសេរកូដ។',
  },
  {
    question: 'What payment methods do you accept?',
    questionKm: 'តើអ្នកទទួលការទូទាត់ប្រភេទណាខ្លះ?',
    answer: 'We accept ABA Bank, ACLEDA, Wing, PayPal, and USDT. Payment is typically split: 50% upfront and 50% upon delivery.',
    answerKm: 'យើងទទួល ABA Bank, ACLEDA, Wing, PayPal, និង USDT។ ការទូទាត់ជាធម្មតាបែងចែក: ៥០% ជាមុន និង ៥០% ពេលបញ្ចប់។',
  },
  {
    question: 'Will my website be mobile-friendly?',
    questionKm: 'តើវេបសាយរបស់ខ្ញុំអាចប្រើបាននៅលើទូរស័ព្ទដែរឬទេ?',
    answer: 'Absolutely. All websites we build are fully responsive — they look great and work perfectly on mobile phones, tablets, and desktop computers.',
    answerKm: 'ជាក់ស្ដែង! វេបសាយទាំងអស់ដែលយើងសាងសង់ responsive ពេញលេញ — មើលទៅស្អាត និងដំណើរការល្អឥតខ្ចោះលើទូរស័ព្ទ, tablet, និងកុំព្យូទ័រ។',
  },
  {
    question: 'How many revisions are included?',
    questionKm: 'តើមានការកែប្រែប៉ុន្មានដងរួមបញ្ចូល?',
    answer: 'Every project includes 2–3 rounds of revisions. We work closely with you at each stage to ensure the final result matches your vision. Additional revisions are available at a small fee.',
    answerKm: 'គម្រោងនីមួយៗមានការកែប្រែ ២–៣ ដង។ យើងធ្វើការជាមួយអ្នកក្នុងគ្រប់ដំណាក់កាលដើម្បីធានាថាលទ្ធផលចុងក្រោយត្រូវនឹងចក្ខុវិស័យរបស់អ្នក។',
  },
  {
    question: 'Do you offer SEO services?',
    questionKm: 'តើអ្នកផ្ដល់សេវា SEO ដែរឬទេ?',
    answer: 'Yes! All our websites are built with SEO best practices. We also offer dedicated SEO packages including keyword research, on-page optimization, and Google ranking strategies tailored for the Cambodian market.',
    answerKm: 'បាន! វេបសាយទាំងអស់ត្រូវបានសាងសង់ជាមួយ SEO best practices។ យើងក៏ផ្ដល់កញ្ចប់ SEO ដាច់ដោយឡែក រួមទាំង keyword research, on-page optimization, និង Google ranking strategies សម្រាប់ទីផ្សារកម្ពុជា។',
  },
  {
    question: 'Can you redesign my existing website?',
    questionKm: 'តើអ្នកអាចរចនាវេបសាយដែលមានស្រាប់របស់ខ្ញុំឡើងវិញបានទេ?',
    answer: 'Absolutely! We specialize in website redesigns. We will analyze your current site, understand your goals, and create a modern, faster, and more effective version that drives results.',
    answerKm: 'បាន! យើងជំនាញក្នុងការរចនាវេបសាយឡើងវិញ។ យើងនឹងវិភាគគេហទំព័របច្ចុប្បន្នរបស់អ្នក យល់ពីគោលដៅ ហើយបង្កើតកំណែទំនើប លឿនជាង និងមានប្រសិទ្ធភាពជាង។',
  },
  {
    question: 'Do you provide hosting and domain registration?',
    questionKm: 'តើអ្នកផ្ដល់ hosting និងចុះឈ្មោះ domain ដែរឬទេ?',
    answer: 'Yes! We can handle hosting setup and domain registration for you. We recommend reliable hosting providers and can manage everything so you don\'t have to worry about the technical side.',
    answerKm: 'បាន! យើងអាចដំណើរការ hosting និងចុះឈ្មោះ domain សម្រាប់អ្នក។ យើងណែនាំ hosting providers ល្អៗ និងអាចគ្រប់គ្រងអ្វីៗទាំងអស់ដើម្បីអ្នកមិនចាំបាច់ព្រួយបារម្ភពីផ្នែកបច្ចេកទេស។',
  },
  {
    question: 'What technologies do you use?',
    questionKm: 'តើអ្នកប្រើបច្ចេកវិទ្យាអ្វីខ្លះ?',
    answer: 'We use modern frameworks like React, Next.js, TypeScript, and Tailwind CSS for web development. For mobile apps, we use React Native and Flutter. Our designs are crafted in Figma and Adobe Creative Suite.',
    answerKm: 'យើងប្រើ frameworks ទំនើបដូចជា React, Next.js, TypeScript, និង Tailwind CSS សម្រាប់ web development។ សម្រាប់ mobile apps យើងប្រើ React Native និង Flutter។ ការរចនាយើងធ្វើក្នុង Figma និង Adobe Creative Suite។',
  },
];

interface AccordionItemProps {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ faq, isOpen, onToggle, index }) => {
  const { t } = useLanguage();

  return (
    <RevealOnScroll variant="fade-up" delay={index * 60}>
      <div
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          isOpen
            ? 'border-indigo-500/40 bg-gray-100 dark:bg-white/[0.06]'
            : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/10 hover:bg-gray-100 dark:hover:bg-white/[0.04]'
        }`}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 text-left p-5 md:p-6"
        >
          <span className="font-bold text-gray-900 dark:text-white font-khmer text-sm md:text-base pr-2 leading-snug">
            {t(faq.question, faq.questionKm)}
          </span>
          <ChevronDown
            size={20}
            className={`text-indigo-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[400px]' : 'max-h-0'}`}
        >
          <p className="px-5 md:px-6 pb-5 md:pb-6 text-gray-600 dark:text-gray-400 font-khmer text-sm md:text-base leading-relaxed">
            {t(faq.answer, faq.answerKm)}
          </p>
        </div>
      </div>
    </RevealOnScroll>
  );
};

const FAQIllustration: React.FC = () => (
  <div className="relative w-full flex items-center justify-center select-none">
    {/* Glow backdrop */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
    </div>

    {/* Main floating card */}
    <div className="relative animate-float">
      <svg
        viewBox="0 0 420 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-sm drop-shadow-2xl"
        aria-hidden="true"
      >
        {/* Background card */}
        <rect x="30" y="40" width="360" height="380" rx="32" fill="url(#cardGrad)" opacity="0.12" />
        <rect x="30" y="40" width="360" height="380" rx="32" stroke="url(#borderGrad)" strokeWidth="1.5" fill="none" />

        {/* Central question mark circle */}
        <circle cx="210" cy="210" r="90" fill="url(#circleGrad)" opacity="0.18" />
        <circle cx="210" cy="210" r="72" fill="url(#circleGrad2)" opacity="0.25" />

        {/* Big ? */}
        <text
          x="210"
          y="248"
          textAnchor="middle"
          fontSize="120"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          fill="url(#textGrad)"
          opacity="0.9"
        >?</text>

        {/* Floating chat bubble — top left */}
        <g className="animate-float-delayed">
          <rect x="42" y="58" width="120" height="52" rx="14" fill="#6366f1" opacity="0.9" />
          <polygon points="58,110 72,110 65,126" fill="#6366f1" opacity="0.9" />
          <rect x="56" y="72" width="52" height="8" rx="4" fill="white" opacity="0.8" />
          <rect x="56" y="86" width="36" height="8" rx="4" fill="white" opacity="0.5" />
        </g>

        {/* Floating chat bubble — bottom right */}
        <g style={{ animationDelay: '0.8s' }} className="animate-float">
          <rect x="248" y="318" width="130" height="52" rx="14" fill="#a855f7" opacity="0.85" />
          <polygon points="360,318 374,318 367,302" fill="#a855f7" opacity="0.85" />
          <rect x="262" y="332" width="60" height="8" rx="4" fill="white" opacity="0.8" />
          <rect x="262" y="346" width="42" height="8" rx="4" fill="white" opacity="0.5" />
        </g>

        {/* Small decorative dots */}
        <circle cx="88" cy="330" r="10" fill="#6366f1" opacity="0.5" />
        <circle cx="110" cy="310" r="6" fill="#a855f7" opacity="0.4" />
        <circle cx="338" cy="90" r="8" fill="#818cf8" opacity="0.45" />
        <circle cx="360" cy="112" r="5" fill="#c084fc" opacity="0.35" />

        {/* Star / sparkle top-right */}
        <g opacity="0.7">
          <line x1="356" y1="62" x2="356" y2="78" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="348" y1="70" x2="364" y2="70" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="350" y1="64" x2="362" y2="76" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="362" y1="64" x2="350" y2="76" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Star / sparkle bottom-left */}
        <g opacity="0.5">
          <line x1="68" y1="370" x2="68" y2="382" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="62" y1="376" x2="74" y2="376" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
        </g>

        <defs>
          <linearGradient id="cardGrad" x1="30" y1="40" x2="390" y2="420" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="borderGrad" x1="30" y1="40" x2="390" y2="420" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="1" stopColor="#a855f7" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="circleGrad" cx="50%" cy="50%" r="50%">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="circleGrad2" cx="50%" cy="50%" r="50%">
            <stop stopColor="#818cf8" />
            <stop offset="1" stopColor="#c084fc" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#818cf8" />
            <stop offset="1" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    {/* Orbiting small dots */}
    <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-indigo-400/60 animate-ping-slow" />
    <div className="absolute bottom-12 left-8 w-2 h-2 rounded-full bg-purple-400/50 animate-ping-slow" style={{ animationDelay: '1.2s' }} />
  </div>
);

const INITIAL_VISIBLE = 5;

const FAQ: React.FC = () => {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);
  const listTopRef = useRef<HTMLDivElement>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const handleShowLess = () => {
    setShowAll(false);
    // Scroll back to top of the list so user isn't stranded
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const visibleFaqs = showAll ? FAQS : FAQS.slice(0, INITIAL_VISIBLE);
  const hasMore = FAQS.length > INITIAL_VISIBLE;

  return (
    <section id="faq" className="py-16 md:py-24 bg-black relative overflow-hidden">
      <ScrollBackgroundText text="FAQ" className="top-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Two-column layout on large screens */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16 xl:gap-24">

          {/* Left column — illustration */}
          <RevealOnScroll variant="slide-right" className="lg:w-5/12 xl:w-2/5 lg:sticky lg:top-28 mb-10 lg:mb-0 flex-shrink-0">
            <FAQIllustration />
            {/* Stats row below illustration */}
            <div className="mt-6 grid grid-cols-2 gap-4 px-4">
              {[
                { value: '13+', label: t('FAQ Topics', 'ប្រធានបទ FAQ') },
                { value: '24/7', label: t('Support', 'ការគាំទ្រ') },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-white/[0.03] p-4 text-center"
                >
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-khmer mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Right column — heading + accordion */}
          <div className="lg:w-7/12 xl:w-3/5">
            <RevealOnScroll className="mb-10 md:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-5">
                <HelpCircle size={16} />
                <span className="font-khmer">{t('FAQ', 'សំណួរចម្លើយ')}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white font-khmer mb-4">
                {t('Frequently Asked', 'សំណួរដែលសួររឿយៗ')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  {t('Questions', 'សំណួរ')}
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-khmer text-base md:text-lg">
                {t(
                  "Can't find the answer you're looking for? Reach out to us directly.",
                  'រកមិនឃើញចម្លើយដែលអ្នកត្រូវការ? ទំនាក់ទំនងមកយើងផ្ទាល់។'
                )}
              </p>
            </RevealOnScroll>

            {/* Accordion list with optional fade mask */}
            <div ref={listTopRef} className="relative">
              <div className="space-y-3">
                {visibleFaqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    faq={faq}
                    index={index}
                    isOpen={openIndex === index}
                    onToggle={() => toggle(index)}
                  />
                ))}
              </div>

              {/* Fade mask at bottom when collapsed */}
              {hasMore && !showAll && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent pointer-events-none rounded-b-2xl" />
              )}
            </div>

            {/* Show All / Show Less + Contact row */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              {hasMore && (
                <button
                  onClick={showAll ? handleShowLess : () => setShowAll(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-bold font-khmer text-sm transition-all hover:scale-105"
                >
                  {showAll ? (
                    <>
                      <ChevronsUp size={16} />
                      {t('Show Less', 'បង្រួម')}
                    </>
                  ) : (
                    <>
                      <ChevronsDown size={16} />
                      {t(`Show All (${FAQS.length})`, `មើលទាំងអស់ (${FAQS.length})`)}
                    </>
                  )}
                </button>
              )}

              <div className={`flex flex-col items-center sm:items-start gap-1 ${hasMore ? 'sm:ml-auto' : ''}`}>
                <p className="text-gray-500 font-khmer text-xs">
                  {t('Still have questions?', 'នៅមានសំណួរទៀតឬ?')}
                </p>
                <a
                  href={`/${language}/contact`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-khmer text-sm transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
                >
                  {t('Contact Us', 'ទំនាក់ទំនងយើង')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
