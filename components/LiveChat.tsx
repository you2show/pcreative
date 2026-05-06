import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Loader2, MessageSquare, User, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTelegramConfig, sendTelegramMessage, getTelegramUpdates, TelegramUpdate } from '../lib/telegram';

interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  time: Date;
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<'form' | 'chat'>('form');

  // User info form
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [formError, setFormError] = useState('');

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Telegram session
  const config = getTelegramConfig();
  const sessionMsgIdRef = useRef<number | null>(null);
  const lastUpdateIdRef = useRef<number>(0);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when entering chat step
  useEffect(() => {
    if (step === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  // Reset everything when closed
  useEffect(() => {
    if (!isOpen) {
      setStep('form');
      setMessages([]);
      setName('');
      setContact('');
      setFormError('');
      setInput('');
      sessionMsgIdRef.current = null;
      lastUpdateIdRef.current = 0;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
  }, [isOpen]);

  // Poll Telegram for admin replies every 3 seconds
  const startPolling = useCallback(() => {
    if (!config || pollingRef.current) return;
    pollingRef.current = setInterval(async () => {
      if (!sessionMsgIdRef.current) return;
      try {
        const offset = lastUpdateIdRef.current > 0 ? lastUpdateIdRef.current + 1 : undefined;
        const updates = await getTelegramUpdates(config, offset);
        for (const update of updates) {
          lastUpdateIdRef.current = Math.max(lastUpdateIdRef.current, update.update_id);
          const msg = update.message;
          if (!msg || msg.from?.is_bot) continue;
          // Only show messages that are replies to our session's first message
          if (msg.reply_to_message?.message_id === sessionMsgIdRef.current) {
            const text: string = msg.text || msg.caption || '';
            if (!text) continue;
            setMessages(prev => {
              if (prev.some(m => m.id === `tg-${update.update_id}`)) return prev;
              return [
                ...prev,
                {
                  id: `tg-${update.update_id}`,
                  sender: 'admin',
                  text,
                  time: new Date(msg.date * 1000),
                },
              ];
            });
          }
        }
      } catch {
        // Silently ignore polling errors
      }
    }, 3000);
  }, [config]);

  useEffect(() => {
    if (step === 'chat' && isOpen && config) {
      startPolling();
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [step, isOpen, config, startPolling]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError(t('Please enter your name', 'សូមបញ្ចូលឈ្មោះ'));
      return;
    }
    if (!contact.trim()) {
      setFormError(t('Please enter email or phone', 'សូមបញ្ចូលអ៊ីម៉ែល ឬលេខទូរស័ព្ទ'));
      return;
    }
    setFormError('');
    setStep('chat');
    setMessages([
      {
        id: 'welcome',
        sender: 'admin',
        text: t(
          'Hello! How can we help you today? 😊',
          'សួស្ដី! តើយើងអាចជួយអ្នកបានដោយរបៀបណា? 😊'
        ),
        time: new Date(),
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || !config || isSending) return;
    const text = input.trim();
    setInput('');
    setIsSending(true);

    const localId = `local-${Date.now()}`;
    setMessages(prev => [...prev, { id: localId, sender: 'user', text, time: new Date() }]);

    try {
      if (!sessionMsgIdRef.current) {
        // First message — include user info header so admin can see who it is
        const header = `💬 <b>New Live Chat</b>\n👤 <b>${name}</b>\n📩 ${contact}`;
        const fullText = `${header}\n\n${text}`;
        const msgId = await sendTelegramMessage(config, fullText);
        if (msgId) sessionMsgIdRef.current = msgId;
      } else {
        // Subsequent messages are sent as replies to keep them grouped in Telegram
        await sendTelegramMessage(config, `<b>${name}:</b> ${text}`, sessionMsgIdRef.current);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'admin',
          text: t(
            '⚠️ Message failed to send. Please try again.',
            '⚠️ ការផ្ញើបានបរាជ័យ។ សូមព្យាយាមម្ដងទៀត។'
          ),
          time: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!config || !isOpen) return null;

  return (
    <div className="absolute bottom-16 right-0 w-[320px] sm:w-[360px] bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-up origin-bottom-right font-khmer"
      style={{ maxHeight: 'min(520px, calc(100vh - 120px))' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-indigo-600 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <MessageSquare size={18} className="text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-600" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">{t('Live Chat', 'ជជែកផ្ទាល់')}</p>
            <p className="text-indigo-200 text-xs">{t('We reply fast!', 'យើងឆ្លើយរហ័ស!')}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-indigo-200 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {step === 'form' ? (
        /* ── Pre-chat form ── */
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 p-5 overflow-y-auto">
          <p className="text-gray-400 text-sm leading-relaxed">
            {t(
              'Please introduce yourself before we start chatting.',
              'សូមណែនាំខ្លួនអ្នកមុនពេលចាប់ផ្ដើមជជែក។'
            )}
          </p>

          <div className="space-y-3">
            <div className="relative">
              <User size={14} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('Your name', 'ឈ្មោះ')}
                className="w-full pl-9 pr-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="relative">
              <Mail size={14} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder={t('Email or phone number', 'អ៊ីម៉ែល ឬ លេខទូរស័ព្ទ')}
                className="w-full pl-9 pr-4 py-3 bg-gray-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {formError && (
            <p className="text-red-400 text-xs">{formError}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all text-sm active:scale-95"
          >
            {t('Start Chat', 'ចាប់ផ្ដើមជជែក')}
          </button>
        </form>
      ) : (
        /* ── Chat interface ── */
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-indigo-300' : 'text-gray-500'} text-right`}>
                    {formatTime(msg.time)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-gray-900 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('Type a message...', 'វាយសារ...')}
              disabled={isSending}
              className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all active:scale-95 shrink-0"
            >
              {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveChat;
