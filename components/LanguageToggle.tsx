import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { hapticLanguageChange, triggerHapticIfEnabled } from '../utils/haptic';

const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'km' : 'en';
    setLanguage(nextLang);
    triggerHapticIfEnabled(hapticLanguageChange);
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <button
        onClick={toggleLanguage}
        className="relative flex items-center bg-white/5 border border-white/10 rounded-full p-1 h-9 w-16 group hover:border-white/20 transition-colors"
        aria-label={language === 'en' ? "ប្តូរទៅភាសាខ្មែរ" : "Switch to English"}
        title={language === 'en' ? "Khmer" : "English"}
      >
        <motion.div
          className="absolute w-7 h-7 bg-gradient-brand rounded-full shadow-glow-sm"
          animate={{ x: language === 'en' ? 0 : 28 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <div className="flex justify-between w-full px-2 z-10 pointer-events-none">
          <span className={`text-[10px] font-bold transition-colors ${language === 'en' ? 'text-white' : 'text-white/40'}`}>
            EN
          </span>
          <span className={`text-[10px] font-bold transition-colors ${language === 'km' ? 'text-white' : 'text-white/40'}`}>
            KM
          </span>
        </div>
      </button>
    </div>
  );
};

export default LanguageToggle;
