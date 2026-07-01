import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { hapticLanguageChange, triggerHapticIfEnabled } from '../utils/haptic';

export const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();
  const toggle = () => {
    setLanguage(language === 'en' ? 'km' : 'en');
    triggerHapticIfEnabled(hapticLanguageChange);
  };
  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none transition-colors"
      aria-label={t('Switch Language', 'ប្តូរភាសា')}
    >
      <motion.div animate={{ rotate: language === 'en' ? 0 : 180 }} transition={{ duration: 0.3 }}>
        <Globe className="w-4 h-4 text-indigo-300" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-[10px] font-bold text-white w-6 text-center"
        >
          {language.toUpperCase()}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};
