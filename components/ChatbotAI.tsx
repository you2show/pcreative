import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Predefined responses for common queries (works offline without API)
const AI_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello! 👋 Welcome to Ponloe Creative. How can I help you today?",
    "Hi there! I'm the Ponloe Creative AI assistant. What can I assist you with?",
  ],
  services: [
    "We offer a wide range of services:\n\n🌐 **Web Development** - Custom websites, web apps, e-commerce\n🎨 **Graphic Design** - Logos, branding, UI/UX\n📱 **Mobile Apps** - iOS & Android development\n🏠 **Architecture** - 3D visualization, floor plans\n📹 **Media Production** - Video, photography\n🌐 **Translation** - Khmer, English, and more\n\nWould you like to know more about any specific service?",
  ],
  pricing: [
    "Our pricing varies based on project complexity:\n\n💻 **Website**: Starting from $300-$2,000+\n📱 **Mobile App**: Starting from $1,500-$10,000+\n🎨 **Logo Design**: Starting from $50-$500\n\nWe offer free consultations! Would you like to schedule one?",
  ],
  contact: [
    "You can reach us through:\n\n📧 Email: contact@ponloe.app\n💬 Telegram: @PonloeCreative\n📞 Phone: Available during business hours\n\nOr simply fill out the contact form on our website!",
  ],
  timeline: [
    "Typical project timelines:\n\n🌐 **Simple Website**: 1-2 weeks\n🛒 **E-commerce**: 3-6 weeks\n📱 **Mobile App**: 4-12 weeks\n🎨 **Brand Identity**: 1-3 weeks\n\nExact timelines depend on project scope. Shall I get you a quote?",
  ],
  default: [
    "Thank you for your question! I can help you with:\n\n• Our services & pricing\n• Project timelines\n• How to get started\n• Technical questions\n\nWhat would you like to know more about?",
    "I appreciate your interest! Let me help you with information about Ponloe Creative. You can ask me about our services, pricing, or how to start a project with us.",
  ],
};

const getAIResponse = (message: string): string => {
  const lower = message.toLowerCase();
  
  if (lower.match(/^(hi|hello|hey|សួស្តី|good\s*(morning|evening|afternoon))/)) {
    return AI_RESPONSES.greeting[Math.floor(Math.random() * AI_RESPONSES.greeting.length)];
  }
  if (lower.match(/service|what.*do|offer|provide|សេវា/)) {
    return AI_RESPONSES.services[0];
  }
  if (lower.match(/price|cost|how much|ថ្លៃ|តម្លៃ|pricing/)) {
    return AI_RESPONSES.pricing[0];
  }
  if (lower.match(/contact|reach|email|phone|ទំនាក់ទំនង/)) {
    return AI_RESPONSES.contact[0];
  }
  if (lower.match(/time|how long|duration|deadline|ពេល/)) {
    return AI_RESPONSES.timeline[0];
  }
  
  return AI_RESPONSES.default[Math.floor(Math.random() * AI_RESPONSES.default.length)];
};

const ChatbotAI: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: t(
        "Hi! 👋 I'm Ponloe AI Assistant. Ask me anything about our services, pricing, or how we can help your project!",
        "សួស្តី! 👋 ខ្ញុំជាជំនួយការ AI របស់ Ponloe Creative។ សួរខ្ញុំអំពីសេវាកម្ម តម្លៃ ឬរបៀបដែលយើងអាចជួយគម្រោងរបស់អ្នក!"
      ),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = getAIResponse(userMessage.content);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-[8000] w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
            aria-label={t('Open AI Chatbot', 'បើក AI Chatbot')}
          >
            <Bot size={24} className="text-white" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-[8000] w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Ponloe AI</h4>
                  <p className="text-xs text-green-400">{t('Online 24/7', 'អនឡាញ ២៤/៧')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Bot size={14} className="text-indigo-400" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-md' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-bl-md border border-gray-100 dark:border-white/5'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <User size={14} className="text-gray-700 dark:text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-indigo-400" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-gray-500 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 dark:border-white/10 bg-white/95 dark:bg-gray-900/95">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('Ask me anything...', 'សួរខ្ញុំអ្វីក៏បាន...')}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-xl transition-colors"
                  aria-label="Send message"
                >
                  <Send size={16} className="text-white" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotAI;
