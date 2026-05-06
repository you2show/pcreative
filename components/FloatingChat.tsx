
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Facebook, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTelegramConfig } from '../lib/telegram';
import LiveChat from './LiveChat';

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);
  const telegramConfig = getTelegramConfig();

  // Close menu when clicking outside (but not when live chat is open)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isLiveChatOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLiveChatOpen]);

  const handleLiveChatOpen = () => {
    setIsLiveChatOpen(true);
    setIsOpen(false);
  };

  const handleLiveChatClose = () => {
    setIsLiveChatOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-24 md:right-28 z-[9990] font-khmer" ref={menuRef}>
      {/* Live Chat Widget */}
      <LiveChat isOpen={isLiveChatOpen} onClose={handleLiveChatClose} />

      {/* Chat Menu */}
      <div 
        className={`absolute bottom-16 right-0 flex flex-col gap-3 transition-all duration-300 transform origin-bottom-right ${
          isOpen && !isLiveChatOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none translate-y-4'
        }`}
      >
        {/* Live Chat option — only shown when Telegram bot is configured */}
        {telegramConfig && (
          <button
            onClick={handleLiveChatOpen}
            className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl shadow-xl border border-gray-100 transition-transform hover:scale-105 group min-w-[160px]"
          >
            <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-full">
              <MessageSquare size={20} />
            </div>
            <span className="font-bold text-sm">{t('Live Chat', 'ជជែកផ្ទាល់')}</span>
          </button>
        )}

        <a 
          href="https://m.me/ponloe.creative"
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl shadow-xl border border-gray-100 transition-transform hover:scale-105 group min-w-[160px]"
        >
          <div className="p-2 bg-[#0084FF]/10 text-[#0084FF] rounded-full">
            <Facebook size={20} />
          </div>
          <span className="font-bold text-sm">Messenger</span>
        </a>

        <a 
          href="https://t.me/ponloe_creative"
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-2xl shadow-xl border border-gray-100 transition-transform hover:scale-105 group min-w-[160px]"
        >
          <div className="p-2 bg-[#229ED9]/10 text-[#229ED9] rounded-full">
            <Send size={20} />
          </div>
          <span className="font-bold text-sm">Telegram</span>
        </a>
      </div>

      {/* Main Button */}
      <button
        onClick={() => {
          if (isLiveChatOpen) {
            handleLiveChatClose();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
            isOpen || isLiveChatOpen ? 'bg-gray-900 text-white rotate-90' : 'bg-indigo-600 text-white hover:bg-indigo-500'
        }`}
        aria-label="Chat with us"
      >
        {isOpen || isLiveChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
        
        {/* Pulse Effect (Only when closed) */}
        {!isOpen && !isLiveChatOpen && (
            <span className="absolute -inset-1 rounded-full bg-indigo-500 opacity-30 animate-ping pointer-events-none"></span>
        )}
      </button>
    </div>
  );
};

export default FloatingChat;
