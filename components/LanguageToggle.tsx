import React from 'react';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { hapticLanguageChange } from '../utils/haptic';

interface LanguageToggleProps {
  className?: string;
  showLabel?: boolean;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '', showLabel = false }) => {
  const { language, setLanguage, languageName } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'km' : 'en';
    setLanguage(newLang);
    hapticLanguageChange();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300
                 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white ${className}`}
      aria-label={language === 'en' ? 'Switch to Khmer' : 'ប្តូរទៅភាសាអង់គ្លេស'}
      title={language === 'en' ? 'Switch to Khmer' : 'Switch to English'}
    >
      <Languages size={18} className="text-indigo-400" />
      <span className="text-xs font-bold tracking-wider uppercase font-khmer min-w-[24px] text-center">
        {language === 'en' ? 'KM' : 'EN'}
      </span>
      {showLabel && (
        <span className="text-sm font-medium ml-1">
          {languageName}
        </span>
      )}
    </motion.button>
  );
};

export default LanguageToggle;
