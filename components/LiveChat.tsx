import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Loader2, MessageSquare, User, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTelegramConfig, sendTelegramMessage, getTelegramUpdates, escapeHtml, TelegramUpdate } from '../lib/telegram';

const CHAT_SESSION_KEY = 'livechat_session';

interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  time: Date;
}

interface PersistedSession {
  name: string;
  contact: string;
  selectedTopics: string[];
  step: 'form' | 'chat';
  messages: Array<{ id: string; sender: 'user' | 'admin'; text: string; time: string }>;
  sessionMsgId: number | null;
  lastUpdateId: number;
  sentMsgIds: number[];
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceTopic {
  id: string;
  emoji: string;
  label: string;
  labelKm: string;
}

const SERVICE_TOPICS: ServiceTopic[] = [
  { id: 'webdev',       emoji: '💻', label: 'Web & App Dev',    labelKm: 'វេបសាយ & App' },
  { id: 'graphic',      emoji: '🎨', label: 'Graphic Design',   labelKm: 'រចនាក្រាហ្វិក' },
  { id: 'architecture', emoji: '🏠', label: 'Architecture',     labelKm: 'ស្ថាបត្យកម្ម' },
  { id: 'media',        emoji: '📹', label: 'Video & Photo',    labelKm: 'វីដេអូ & រូបភាព' },
  { id: 'translation',  emoji: '🌐', label: 'Translation',      labelKm: 'បកប្រែ' },
  { id: 'courses',      emoji: '📚', label: 'Online Courses',   labelKm: 'វគ្គសិក្សា' },
  { id: 'calligraphy',  emoji: '✍️', label: 'Calligraphy',      labelKm: 'អក្សរផ្ចង់' },
  { id: 'mvac',         emoji: '❄️', label: 'MVAC / AC',        labelKm: 'ម៉ាស៊ីនត្រជាក់' },
];

const LiveChat: React.FC<LiveChatProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<'form' | 'chat'>('form');

  // User info form
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [formError, setFormError] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Telegram session
  const config = getTelegramConfig();
  const sessionMsgIdRef = useRef<number | null>(null);
  const sentMsgIdsRef = useRef<Set<number>>(new Set());
  const lastUpdateIdRef = useRef<number>(0);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore saved session from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_SESSION_KEY);
      if (!raw) return;
      const session: PersistedSession = JSON.parse(raw);
      if (session.name) setName(session.name);
      if (session.contact) setContact(session.contact);
      if (session.selectedTopics?.length) setSelectedTopics(session.selectedTopics);
      if (session.step === 'chat' && session.messages?.length) {
        setStep('chat');
        setMessages(session.messages.map(m => ({ ...m, time: new Date(m.time) })));
        sessionMsgIdRef.current = session.sessionMsgId ?? null;
        lastUpdateIdRef.current = session.lastUpdateId ?? 0;
        sentMsgIdsRef.current = new Set(session.sentMsgIds ?? []);
      }
    } catch {
      // Ignore corrupt storage
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist session whenever relevant state changes
  useEffect(() => {
    try {
      const session: PersistedSession = {
        name,
        contact,
        selectedTopics,
        step,
        messages: messages.map(m => ({ ...m, time: m.time.toISOString() })),
        sessionMsgId: sessionMsgIdRef.current,
        lastUpdateId: lastUpdateIdRef.current,
        sentMsgIds: Array.from(sentMsgIdsRef.current),
      };
      localStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage errors
    }
  }, [name, contact, selectedTopics, step, messages]);

  // Patch a single field in the persisted session (used for refs that don't trigger state effects)
  const patchSession = useCallback((patch: Partial<PersistedSession>) => {
    try {
      const raw = localStorage.getItem(CHAT_SESSION_KEY);
      const session = raw ? JSON.parse(raw) : {};
      localStorage.setItem(CHAT_SESSION_KEY, JSON.stringify({ ...session, ...patch }));
    } catch { /* ignore */ }
  }, []);

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

  // Stop polling when popup is closed (state is kept for next open)
  useEffect(() => {
    if (!isOpen) {
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
          const newId = Math.max(lastUpdateIdRef.current, update.update_id);
          if (newId !== lastUpdateIdRef.current) {
            lastUpdateIdRef.current = newId;
            // Persist updated offset so polling resumes correctly after reopen
            patchSession({ lastUpdateId: newId });
          }
          // Accept both group messages and channel posts
          const msg = update.message ?? update.channel_post;
          if (!msg || msg.from?.is_bot) continue;
          // Determine whether this non-bot message belongs to the current chat session.
          // Three strategies, in priority order:
          //   1. Explicit Telegram reply (works everywhere — admin presses Reply button).
          //   2. Forum supergroup: message_thread_id equals the session's first message ID,
          //      so all messages posted inside the topic are treated as session replies.
          //   3. Regular group fallback: any human message with a message_id greater than
          //      the session's first message ID is treated as an admin reply.  This lets
          //      the admin simply type in the group without pressing the Reply button.
          const replyId = msg.reply_to_message?.message_id;
          const sessionId = sessionMsgIdRef.current!;
          const inSession =
            (replyId !== undefined && sentMsgIdsRef.current.has(replyId)) ||
            (msg.message_thread_id !== undefined && sentMsgIdsRef.current.has(msg.message_thread_id)) ||
            msg.message_id > sessionId;
          if (inSession) {
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
  }, [config, patchSession]);

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

  const toggleTopic = (id: string) => {
    setSelectedTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

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
        // First message — include user info + selected topics so admin sees context
        const topicsLine = selectedTopics.length > 0
          ? '\n🏷 ' + selectedTopics
              .map(id => {
                const topic = SERVICE_TOPICS.find(s => s.id === id);
                return topic ? `${topic.emoji} ${escapeHtml(topic.label)}` : 'Unknown';
              })
              .join(', ')
          : '';
        const header = `💬 <b>New Live Chat</b>\n👤 <b>${escapeHtml(name)}</b>\n📩 ${escapeHtml(contact)}${topicsLine}`;
        const fullText = `${header}\n\n${escapeHtml(text)}`;
        const msgId = await sendTelegramMessage(config, fullText);
        if (msgId) {
          sessionMsgIdRef.current = msgId;
          sentMsgIdsRef.current.add(msgId);
          // Persist the session message ID so it survives popup close/reopen
          patchSession({ sessionMsgId: msgId, sentMsgIds: Array.from(sentMsgIdsRef.current) });
        }
      } else {
        // Subsequent messages are sent as replies to keep them grouped in Telegram
        const msgId = await sendTelegramMessage(config, `<b>${escapeHtml(name)}:</b> ${escapeHtml(text)}`, sessionMsgIdRef.current);
        if (msgId) {
          sentMsgIdsRef.current.add(msgId);
          patchSession({ sentMsgIds: Array.from(sentMsgIdsRef.current) });
        }
      }
    } catch (err) {
      console.error('[LiveChat] sendTelegramMessage failed:', err);
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
      style={{ maxHeight: 'min(580px, calc(100vh - 180px))' }}
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

          {/* Service topic chips */}
          <div>
            <p className="text-gray-500 text-xs mb-2">
              {t('Interested in? (optional)', 'ចង់ដឹងអំពី? (មិនចាំបាច់)')}
            </p>
            <div className="flex flex-wrap gap-2">
              {SERVICE_TOPICS.map(topic => {
                const active = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      active
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-gray-800 border-white/10 text-gray-400 hover:border-indigo-500/50 hover:text-gray-200'
                    }`}
                  >
                    <span aria-hidden="true">{topic.emoji}</span>
                    {t(topic.label, topic.labelKm)}
                  </button>
                );
              })}
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
