import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ExitIntentPopupProps {
  onConsultationOpen: () => void;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onConsultationOpen }) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const key = 'exit_intent_shown';
    if (sessionStorage.getItem(key)) return;

    // Wait a bit before listening — avoid triggering on page load scroll
    const timeout = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !triggered.current) {
          triggered.current = true;
          setIsVisible(true);
          sessionStorage.setItem(key, '1');
        }
      };
      document.addEventListener('mouseleave', handleMouseLeave);
      // Cleanup stored to remove listener properly
      (window as any).__exitIntentCleanup = () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      if ((window as any).__exitIntentCleanup) {
        (window as any).__exitIntentCleanup();
        delete (window as any).__exitIntentCleanup;
      }
    };
  }, []);

  const handleClose = () => setIsVisible(false);

  const handleCTA = () => {
    setIsVisible(false);
    onConsultationOpen();
  };

  if (!isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10500] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md animate-fade-in"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-scale-up z-[10501]">
        {/* Decorative gradient top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/20 blur-3xl pointer-events-none" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="p-8 text-center relative z-10">
          <div className="text-5xl mb-4">👋</div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer mb-3 leading-snug">
            {t('Wait — Before You Go!', 'ចាំមុន — មុនចេញ!')}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 font-khmer text-sm md:text-base leading-relaxed mb-6">
            {t(
              "Get a FREE 30-minute consultation with our expert team. No strings attached — just valuable advice for your project.",
              'ទទួល ការពិគ្រោះ ៣០ នាទី ឥតគិតថ្លៃ ជាមួយក្រុមជំនាញរបស់យើង។ គ្មានការចង — គ្រាន់តែដំណឹងល្អសម្រាប់គម្រោងរបស់អ្នក។'
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleCTA}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all hover:scale-105 font-khmer shadow-lg shadow-indigo-500/25"
            >
              <Calendar size={18} />
              {t('Book Free Consult', 'ចុះឈ្មោះពិគ្រោះ')}
            </button>
            <button
              onClick={handleClose}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold rounded-xl transition-all font-khmer border border-gray-200 dark:border-white/10"
            >
              {t('Maybe Later', 'ពេលក្រោយ')}
            </button>
          </div>

          <p className="mt-4 text-gray-600 text-xs font-khmer">
            {t('Limited slots available each week', 'មាន slot កំណត់ក្នុងមួយសប្ដាហ៍')}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>
    </div>,
    document.body
  );
};

export default ExitIntentPopup;
