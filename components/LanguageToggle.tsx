import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setLanguage(language === 'en' ? 'km' : 'en')}
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full
                 bg-white/5 border border-white/10 hover:border-white/20
                 hover:bg-white/10 transition-all duration-300 focus-visible:ring-2
                 focus-visible:ring-indigo-500 outline-none ${className}`}
      aria-label={language === 'en' ? 'Switch to Khmer' : 'ប្តូរទៅភាសាអង់គ្លេស'}
      title={t('Switch Language', 'ប្តូរភាសា')}
    >
      <Globe size={14} className="text-white/50 group-hover:text-indigo-400 transition-colors" />
      <span className="text-xs font-bold tracking-wider text-white/70 group-hover:text-white uppercase font-khmer">
        {language === 'en' ? 'EN' : 'KM'}
      </span>
      <motion.div
        layoutId="activeLang"
        className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
      />
    </motion.button>
  );
};

export default LanguageToggle;
