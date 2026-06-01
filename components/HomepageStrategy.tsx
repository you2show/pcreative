import React from 'react';
import { ArrowRight, BadgeCheck, BarChart3, Eye, Gauge, Handshake, Layers3, MousePointerClick, ShieldCheck, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

const conversionPrinciples = [
  {
    icon: Eye,
    title: 'Clear in seconds',
    titleKm: 'ច្បាស់ក្នុងប៉ុន្មានវិនាទី',
    body: 'A visitor should instantly understand your offer, value, and next step without reading a long paragraph.',
    bodyKm: 'អ្នកទស្សនាគួរយល់ភ្លាមៗពីសេវា តម្លៃ និងជំហានបន្ទាប់ ដោយមិនចាំបាច់អានអត្ថបទវែង។',
  },
  {
    icon: Smartphone,
    title: 'Mobile-first polish',
    titleKm: 'ស្អាតមុនគេនៅលើទូរស័ព្ទ',
    body: 'Most decisions start on a phone, so spacing, CTA size, images, and reading flow must feel effortless.',
    bodyKm: 'ការសម្រេចចិត្តភាគច្រើនចាប់ផ្តើមលើទូរស័ព្ទ ដូច្នេះគម្លាត ប៊ូតុង រូបភាព និងលំហូរអានត្រូវងាយស្រួល។',
  },
  {
    icon: ShieldCheck,
    title: 'Trust before CTA',
    titleKm: 'ទុកចិត្តមុនចុចទាក់ទង',
    body: 'Proof, process, quality visuals, and transparent expectations reduce hesitation before the user contacts you.',
    bodyKm: 'ភស្តុតាង ដំណើរការ រូបភាពមានគុណភាព និងការរំពឹងទុកច្បាស់ ជួយកាត់បន្ថយការស្ទាក់ស្ទើរ។',
  },
  {
    icon: Gauge,
    title: 'Fast and premium',
    titleKm: 'លឿន និងមានអារម្មណ៍ premium',
    body: 'Beautiful UI still needs speed, accessibility, SEO structure, and smooth micro-interactions to feel professional.',
    bodyKm: 'UI ស្អាតត្រូវភ្ជាប់ជាមួយល្បឿន accessibility រចនាសម្ព័ន្ធ SEO និង micro-interactions រលូន ដើម្បីមានអារម្មណ៍វិជ្ជាជីវៈ។',
  },
];

const journey = [
  { label: 'Notice', labelKm: 'ចាប់អារម្មណ៍', text: 'Premium visual hook', textKm: 'រូបរាងទាក់ទាញ' },
  { label: 'Believe', labelKm: 'ជឿទុកចិត្ត', text: 'Proof and clarity', textKm: 'ភស្តុតាង និងភាពច្បាស់' },
  { label: 'Want', labelKm: 'ចង់បាន', text: 'Business outcomes', textKm: 'លទ្ធផលអាជីវកម្ម' },
  { label: 'Contact', labelKm: 'ទាក់ទង', text: 'Low-friction CTA', textKm: 'CTA ងាយស្រួល' },
];

const qualityChecklist = [
  { icon: Layers3, label: 'Design system', labelKm: 'ប្រព័ន្ធរចនា' },
  { icon: MousePointerClick, label: 'Conversion flow', labelKm: 'លំហូរ conversion' },
  { icon: BarChart3, label: 'SEO-ready structure', labelKm: 'រចនាសម្ព័ន្ធ SEO' },
  { icon: BadgeCheck, label: 'Launch-ready build', labelKm: 'អភិវឌ្ឍរួចសម្រាប់ launch' },
];

const HomepageStrategy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="homepage-strategy" className="relative overflow-hidden bg-white py-24 dark:bg-gray-950 md:py-28">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_20%,rgba(99,102,241,0.12),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(236,72,153,0.10),transparent_30%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <RevealOnScroll variant="slide-right" className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-bold text-indigo-500 dark:text-indigo-300 font-khmer">
              <Handshake size={18} />
              {t('UX that earns trust', 'UX ដែលបង្កើតទំនុកចិត្ត')}
            </div>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-950 dark:text-white md:text-6xl font-khmer">
              {t('A beautiful homepage should', 'Homepage ស្អាតត្រូវ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">{t('sell without pressure.', 'លក់ដោយមិនដាក់សម្ពាធ។')}</span>
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400 font-khmer">
              {t(
                'We shape the first impression around clarity, emotion, proof, and a simple next step — so visitors feel safe to start a conversation about their website or app.',
                'យើងរៀបចំចំណាប់អារម្មណ៍ដំបូងដោយផ្អែកលើភាពច្បាស់ អារម្មណ៍ ភស្តុតាង និងជំហានបន្ទាប់ងាយៗ ដើម្បីឲ្យអ្នកទស្សនាមានអារម្មណ៍សុវត្ថិភាពក្នុងការចាប់ផ្តើមនិយាយអំពីវេបសាយ ឬ app របស់ពួកគេ។'
              )}
            </p>
            <a href="/contact" className="group inline-flex items-center gap-3 rounded-full bg-gray-950 px-7 py-4 font-bold text-white transition-all hover:-translate-y-1 hover:bg-indigo-600 dark:bg-white dark:text-gray-950 dark:hover:bg-indigo-100 font-khmer">
              {t('Request a homepage audit', 'ស្នើពិនិត្យ Homepage')}
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
          </RevealOnScroll>

          <RevealOnScroll variant="slide-left" delay={120}>
            <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-4 shadow-2xl shadow-indigo-500/10 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="grid gap-4 lg:grid-cols-[0.78fr_1fr]">
                <div className="rounded-[1.6rem] border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-gray-950/70">
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-indigo-500">Flow</div>
                  <div className="mt-5 space-y-3">
                    {journey.map((item, index) => (
                      <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3 dark:bg-white/[0.04]">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-xs font-black text-white">{index + 1}</div>
                        <div>
                          <h3 className="font-black text-gray-950 dark:text-white font-khmer">{t(item.label, item.labelKm)}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-khmer">{t(item.text, item.textKm)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-gray-950/70">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.24em] text-pink-500">Quality scan</div>
                      <h3 className="mt-2 text-2xl font-black text-gray-950 dark:text-white font-khmer">{t('What we refine first', 'អ្វីដែលយើងកែសម្រួលមុន')}</h3>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.8)]" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {qualityChecklist.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                          <Icon size={20} className="mb-3 text-indigo-500" />
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200 font-khmer">{t(item.label, item.labelKm)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {conversionPrinciples.map((card, index) => {
            const Icon = card.icon;
            return (
              <RevealOnScroll key={card.title} delay={index * 80}>
                <div className="group h-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.06]">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 text-white transition-transform group-hover:scale-110 dark:bg-white dark:text-gray-950">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-black text-gray-950 dark:text-white font-khmer">{t(card.title, card.titleKm)}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400 font-khmer">{t(card.body, card.bodyKm)}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomepageStrategy;
