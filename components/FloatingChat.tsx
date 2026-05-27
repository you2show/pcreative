
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTelegramConfig, getTelegramConfigFromGitHub } from '../lib/telegram';
import { getGitHubConfig } from '../lib/github';
import LiveChat from './LiveChat';

/* ── Brand SVG icons ── */
const TelegramSVG = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.9-.74 1.1-1.5.69l-4.14-3.05-2 1.96c-.23.23-.42.42-.83.42z"/>
  </svg>
);

const MessengerSVG = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.1l3.131 3.26 5.887-3.26-6.559 6.863z"/>
  </svg>
);

const WhatsAppSVG = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/** px gap between consecutive icon slots in each direction */
const STEP = 60;

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);
  const [telegramConfig, setTelegramConfig] = useState(getTelegramConfig);

  // On mount: try to load Telegram config from GitHub site-data.json, cache to localStorage
  useEffect(() => {
    const ghCfg = getGitHubConfig();
    if (!ghCfg) return;
    getTelegramConfigFromGitHub(ghCfg.username, ghCfg.repo, ghCfg.branch).then((cfg) => {
      if (cfg) {
        localStorage.setItem('telegram_chat_config', JSON.stringify(cfg));
        setTelegramConfig(cfg);
        window.dispatchEvent(new Event('telegram_config_updated'));
      }
    });
  }, []);

  // Re-read config when the admin saves Telegram settings
  useEffect(() => {
    const onUpdate = () => setTelegramConfig(getTelegramConfig());
    window.addEventListener('telegram_config_updated', onUpdate);
    return () => window.removeEventListener('telegram_config_updated', onUpdate);
  }, []);

  // Close menu when clicking outside (but not while live chat is open)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !isLiveChatOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
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

  const handleLiveChatClose = () => setIsLiveChatOpen(false);

  /**
   * Inline styles for each fan icon.
   * When open: translate to (dx, dy) at full scale.
   * When closed: collapse to origin at 30 % scale, invisible.
   */
  const fanStyle = (dx: number, dy: number, delayMs: number): React.CSSProperties => ({
    transform: isOpen
      ? `translate(${dx}px, ${dy}px) scale(1)`
      : 'translate(0, 0) scale(0.3)',
    opacity: isOpen ? 1 : 0,
    transition: `transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delayMs}ms, opacity 200ms ease ${delayMs}ms`,
    pointerEvents: isOpen ? 'auto' : 'none',
  });

  return (
    /* Positioned at the bottom-right corner; ScrollButton sits above */
    <div
      ref={menuRef}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[9990] font-khmer w-12 h-12"
    >
      {/* Live Chat widget */}
      <LiveChat isOpen={isLiveChatOpen} onClose={handleLiveChatClose} />

      {/* ── LEFT icons: Telegram (index 1) · Live Chat (index 2) ── */}

      {/* Telegram */}
      <div className="absolute inset-0 group" style={fanStyle(-STEP, 0, 0)}>
        <a
          href="https://t.me/ponloe_creative"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#229ED9] text-white shadow-lg shadow-[#229ED9]/40 hover:scale-110 transition-transform duration-200 active:scale-95"
          aria-label="Telegram"
        >
          <TelegramSVG size={22} />
        </a>
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-[11px] font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md">
          Telegram
        </span>
      </div>

      {/* Live Chat — only when Telegram bot is configured */}
      {telegramConfig && (
        <div className="absolute inset-0 group" style={fanStyle(-STEP * 2, 0, 60)}>
          <button
            onClick={handleLiveChatOpen}
            className="relative flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 hover:scale-110 transition-transform duration-200 active:scale-95"
            aria-label="Live Chat"
          >
            <MessageSquare size={22} />
            {/* Active/online indicator dot */}
            <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white">
              <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
            </span>
          </button>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-[11px] font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md">
            {t('Live Chat', 'ជជែកផ្ទាល់')}
          </span>
        </div>
      )}

      {/* ── TOP icons: WhatsApp (index 1) · Messenger (index 2) ── */}

      {/* WhatsApp */}
      <div className="absolute inset-0 group" style={fanStyle(0, -STEP, 30)}>
        <a
          href="https://wa.me/85515627458"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 hover:scale-110 transition-transform duration-200 active:scale-95"
          aria-label="WhatsApp"
        >
          <WhatsAppSVG size={22} />
        </a>
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-[11px] font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md">
          WhatsApp
        </span>
      </div>

      {/* Messenger */}
      <div className="absolute inset-0 group" style={fanStyle(0, -STEP * 2, 90)}>
        <a
          href="https://m.me/ponloe.creative"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0084FF] text-white shadow-lg shadow-[#0084FF]/40 hover:scale-110 transition-transform duration-200 active:scale-95"
          aria-label="Messenger"
        >
          <MessengerSVG size={22} />
        </a>
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-[11px] font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-md">
          Messenger
        </span>
      </div>

      {/* ── Main FAB button ── */}
      <button
        onClick={() => {
          if (isLiveChatOpen) {
            handleLiveChatClose();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className={`absolute inset-0 flex items-center justify-center w-12 h-12 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen || isLiveChatOpen
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
            : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white'
        }`}
        aria-label="Chat with us"
      >
        {isOpen || isLiveChatOpen ? <X size={22} /> : <MessageCircle size={22} />}

        {/* Pulse ring — only when fully closed */}
        {!isOpen && !isLiveChatOpen && (
          <span className="absolute -inset-1.5 rounded-full bg-indigo-500/30 animate-ping pointer-events-none" />
        )}
      </button>
    </div>
  );
};

export default FloatingChat;
