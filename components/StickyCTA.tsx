import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Loader2, Check, AlertCircle, Calendar, Clock, User, Mail, Smartphone } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredTime: string;
  message: string;
}

const INITIAL_FORM: ConsultationFormData = {
  name: '',
  email: '',
  phone: '',
  service: 'Web Development',
  preferredTime: 'Morning (9am–12pm)',
  message: '',
};

const TELEGRAM_BOT_TOKEN = '8263160608:AAFngJ6_jVXnFYlqs0lKZQplu8wh-UxS2Bo';
const TELEGRAM_CHAT_ID = '1276188382';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState<ConsultationFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const text = `📅 *Free Consultation Request* 📅\n\n👤 *Name:* ${form.name}\n📧 *Email:* ${form.email}\n📱 *Phone:* ${form.phone || 'N/A'}\n🛠 *Service:* ${form.service}\n🕐 *Preferred Time:* ${form.preferredTime}\n\n💬 *Message:*\n${form.message || 'N/A'}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' }),
      });
      const data = await response.json();
      if (data.ok) {
        setSubmitted(true);
      } else {
        throw new Error(data.description);
      }
    } catch {
      setError(t('Failed to send. Please try again.', 'ការផ្ញើបានបរាជ័យ។ សូមព្យាយាមម្ដងទៀត។'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setForm(INITIAL_FORM);
      setError('');
    }, 300);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-md" onClick={handleClose} />

      <div className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-scale-up z-[11001]">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-6 pb-8">
          <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <Calendar size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-khmer">
                {t('Free Consultation', 'ពិគ្រោះយោបល់ឥតគិតថ្លៃ')}
              </h3>
              <p className="text-white/70 text-xs font-khmer">
                {t('We respond within 24 hours', 'យើងឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោង')}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} />
              </div>
              <h4 className="text-xl font-bold text-white font-khmer mb-2">
                {t('Request Received!', 'ទទួលបានសំណើ!')}
              </h4>
              <p className="text-gray-400 font-khmer text-sm">
                {t("We'll contact you within 24 hours to schedule your free consultation.", 'យើងនឹងទំនាក់ទំនងអ្នកក្នុងរយៈពេល ២៤ ម៉ោង ដើម្បីកំណត់ពេលពិគ្រោះ។')}
              </p>
              <button onClick={handleClose} className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors font-khmer">
                {t('Close', 'បិទ')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide font-khmer flex items-center gap-1.5">
                    <User size={12} /> {t('Name', 'ឈ្មោះ')} *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-khmer"
                    placeholder={t('Your name', 'ឈ្មោះ')}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide font-khmer flex items-center gap-1.5">
                    <Smartphone size={12} /> {t('Phone', 'ទូរស័ព្ទ')}
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-khmer"
                    placeholder="+855 ..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide font-khmer flex items-center gap-1.5">
                  <Mail size={12} /> {t('Email', 'អ៊ីមែល')} *
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-khmer"
                  placeholder="your@email.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide font-khmer">{t('Service', 'សេវាកម្ម')}</label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-khmer"
                  >
                    <option value="Web Development">{t('Web Development', 'ការអភិវឌ្ឍវេប')}</option>
                    <option value="Mobile App">{t('Mobile App', 'កម្មវិធីទូរស័ព្ទ')}</option>
                    <option value="Graphic Design">{t('Graphic Design', 'ក្រាហ្វិករចនា')}</option>
                    <option value="Architecture">{t('Architecture', 'ស្ថាបត្យកម្ម')}</option>
                    <option value="Other">{t('Other', 'ផ្សេងៗ')}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide font-khmer flex items-center gap-1.5">
                    <Clock size={12} /> {t('Best Time', 'ពេលល្អបំផុត')}
                  </label>
                  <select
                    name="preferredTime"
                    value={form.preferredTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-khmer"
                  >
                    <option value="Morning (9am–12pm)">{t('Morning (9–12pm)', 'ព្រឹក (9–12)')}</option>
                    <option value="Afternoon (12pm–5pm)">{t('Afternoon (12–5pm)', 'រសៀល (12–5)')}</option>
                    <option value="Evening (5pm–8pm)">{t('Evening (5–8pm)', 'ល្ងាច (5–8)')}</option>
                    <option value="Anytime">{t('Anytime', 'ពេលណាក៏បាន')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide font-khmer">{t('Tell us about your project (optional)', 'ប្រាប់យើងអំពីគម្រោង (ស្រេចចិត្ត)')}</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-khmer resize-none"
                  placeholder={t('Brief description...', 'ពិពណ៌នាខ្លី...')}
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2 text-red-400 text-sm font-khmer">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base hover:scale-[1.02] transition-all flex items-center justify-center gap-2 font-khmer disabled:opacity-60 shadow-lg shadow-indigo-500/25"
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> {t('Sending...', 'កំពុងផ្ញើ...')}</>
                ) : (
                  <>{t('Book Free Consultation', 'ចុះឈ្មោះពិគ្រោះឥតគិតថ្លៃ')} <Calendar size={18} /></>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-up { animation: scaleUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>
    </div>,
    document.body
  );
};

interface StickyCTAProps {
  onConsultationOpen: () => void;
}

const StickyCTA: React.FC<StickyCTAProps> = ({ onConsultationOpen }) => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const key = 'sticky_cta_dismissed';
    if (sessionStorage.getItem(key)) { setDismissed(true); return; }

    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('sticky_cta_dismissed', '1');
  };

  if (dismissed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9900] transition-transform duration-500 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-gray-950 border-t border-indigo-500/30 shadow-[0_-4px_30px_rgba(99,102,241,0.2)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            <p className="text-white font-khmer text-sm md:text-base font-medium text-center sm:text-left">
              {t('🚀 Ready to start your project?', '🚀 ត្រៀមចាប់ផ្ដើមគម្រោងរបស់អ្នក?')}{' '}
              <span className="text-indigo-400 font-bold">{t('Get a free consultation today!', 'ទទួលការពិគ្រោះឥតគិតថ្លៃថ្ងៃនេះ!')}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onConsultationOpen}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full text-sm transition-all hover:scale-105 font-khmer shadow-lg shadow-indigo-500/30"
            >
              {t('Book Free Consult', 'ចុះឈ្មោះពិគ្រោះ')} <ArrowRight size={16} />
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCTA;
