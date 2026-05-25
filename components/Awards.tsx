import React from 'react';
import { Award, Shield, Star, Zap, Globe, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RevealOnScroll from './RevealOnScroll';

interface AwardItem {
  icon: React.ReactNode;
  title: string;
  titleKm: string;
  subtitle: string;
  subtitleKm: string;
  color: string;
  bgColor: string;
}

const AWARDS: AwardItem[] = [
  {
    icon: <Star size={28} />,
    title: 'Top Creative Agency',
    titleKm: 'ភ្នាក់ងារច្នៃប្រឌិតឈានមុខ',
    subtitle: 'Cambodia 2024',
    subtitleKm: 'កម្ពុជា ២០២៤',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10 border-yellow-400/20',
  },
  {
    icon: <Globe size={28} />,
    title: 'ISO Quality Certified',
    titleKm: 'ទទួលស្គាល់គុណភាព ISO',
    subtitle: 'Design & Development',
    subtitleKm: 'ការរចនា & អភិវឌ្ឍន៍',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10 border-blue-400/20',
  },
  {
    icon: <Shield size={28} />,
    title: 'Trusted Partner',
    titleKm: 'ដៃគូ​ដែល​ជឿជាក់',
    subtitle: 'Google & Meta',
    subtitleKm: 'Google & Meta',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10 border-green-400/20',
  },
  {
    icon: <Zap size={28} />,
    title: 'Fast Delivery',
    titleKm: 'ការដឹកជញ្ជូនលឿន',
    subtitle: '99% On-time Rate',
    subtitleKm: 'ទាន់ពេល ៩៩%',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10 border-purple-400/20',
  },
  {
    icon: <Award size={28} />,
    title: 'Best UX Design',
    titleKm: 'ការរចនា UX ល្អបំផុត',
    subtitle: 'SEA Awards 2023',
    subtitleKm: 'SEA Awards ២០២៣',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10 border-orange-400/20',
  },
  {
    icon: <CheckCircle size={28} />,
    title: '5-Star Rated',
    titleKm: 'វាយតម្លៃ ៥ ផ្កាយ',
    subtitle: '98% Client Satisfaction',
    subtitleKm: 'ការពេញចិត្ត ៩៨%',
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10 border-pink-400/20',
  },
];

const Awards: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll className="text-center mb-12">
          <span className="text-indigo-400 font-bold tracking-wider uppercase text-xs md:text-sm font-khmer">
            {t('Recognition', 'ការទទួលស្គាល់')}
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-gray-900 dark:text-white font-khmer">
            {t('Awards &', 'រង្វាន់ &')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              {t('Certifications', 'វិញ្ញាបនបត្រ')}
            </span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-khmer text-sm md:text-base max-w-xl mx-auto">
            {t(
              'Our work is recognized for quality, creativity, and reliability.',
              'ស្នាដៃរបស់យើងត្រូវបានទទួលស្គាល់ចំពោះគុណភាព ការច្នៃប្រឌិត និងភាពជឿជាក់។'
            )}
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {AWARDS.map((award, index) => (
            <RevealOnScroll key={index} variant="fade-up" delay={index * 80}>
              <div
                className={`group flex flex-col items-center text-center p-5 rounded-2xl border ${award.bgColor} hover:scale-105 transition-all duration-300 cursor-default`}
              >
                <div className={`${award.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {award.icon}
                </div>
                <h4 className={`font-bold text-sm font-khmer ${award.color} mb-1 leading-snug`}>
                  {t(award.title, award.titleKm)}
                </h4>
                <p className="text-gray-500 text-xs font-khmer leading-snug">
                  {t(award.subtitle, award.subtitleKm)}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
