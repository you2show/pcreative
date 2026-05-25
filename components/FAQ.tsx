import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
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

const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <ScrollBackgroundText text="FAQ" className="top-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll className="text-center mb-12 md:mb-16">
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
          <p className="text-gray-600 dark:text-gray-400 font-khmer text-base md:text-lg max-w-2xl mx-auto">
            {t(
              "Can't find the answer you're looking for? Reach out to us directly.",
              'រកមិនឃើញចម្លើយដែលអ្នកត្រូវការ? ទំនាក់ទំនងមកយើងផ្ទាល់។'
            )}
          </p>
        </RevealOnScroll>

        <div className="space-y-3">
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>

        <RevealOnScroll className="mt-10 text-center">
          <p className="text-gray-500 font-khmer text-sm mb-4">
            {t('Still have questions?', 'នៅមានសំណួរទៀតឬ?')}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-khmer text-sm transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
          >
            {t('Contact Us', 'ទំនាក់ទំនងយើង')}
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default FAQ;
