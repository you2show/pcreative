import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Clock, CheckCircle, AlertCircle, ArrowRight, 
  FileText, Calendar, MessageCircle, X, ChevronRight,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectMilestone {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  date: string;
  description?: string;
}

interface ClientProject {
  id: string;
  name: string;
  progress: number;
  status: 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  milestones: ProjectMilestone[];
}

// Demo data for client portal
const DEMO_PROJECTS: ClientProject[] = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    progress: 72,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-04-30',
    milestones: [
      { id: 'm1', title: 'Discovery & Planning', status: 'completed', date: '2024-01-20' },
      { id: 'm2', title: 'UI/UX Design', status: 'completed', date: '2024-02-10' },
      { id: 'm3', title: 'Frontend Development', status: 'in-progress', date: '2024-03-15' },
      { id: 'm4', title: 'Backend Integration', status: 'pending', date: '2024-04-01' },
      { id: 'm5', title: 'Testing & Launch', status: 'pending', date: '2024-04-30' },
    ],
  },
  {
    id: '2',
    name: 'Brand Identity Redesign',
    progress: 100,
    status: 'completed',
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    milestones: [
      { id: 'm1', title: 'Research & Moodboard', status: 'completed', date: '2024-02-05' },
      { id: 'm2', title: 'Logo Design', status: 'completed', date: '2024-02-15' },
      { id: 'm3', title: 'Brand Guidelines', status: 'completed', date: '2024-02-25' },
      { id: 'm4', title: 'Delivery', status: 'completed', date: '2024-03-01' },
    ],
  },
];

interface ClientPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate authentication
    setTimeout(() => {
      if (accessCode === 'demo' || accessCode === '1234' || accessCode.length >= 4) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError(t('Invalid access code', 'លេខកូដមិនត្រឹមត្រូវ'));
      }
      setIsLoading(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9000] flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-xl"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <Briefcase className="text-indigo-400" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-khmer">
                  {t('Client Portal', 'ផ្ទាំងគ្រប់គ្រងអតិថិជន')}
                </h2>
                <p className="text-sm text-gray-400">
                  {t('Track your project progress', 'តាមដានវឌ្ឍនភាពគម្រោង')}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors" aria-label="Close">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
            {!isAuthenticated ? (
              /* Login Form */
              <div className="max-w-sm mx-auto py-12">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="text-indigo-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white font-khmer">
                    {t('Access Your Projects', 'ចូលមើលគម្រោងរបស់អ្នក')}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">
                    {t('Enter your project access code', 'បញ្ចូលលេខកូដចូលគម្រោង')}
                  </p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder={t('Access Code', 'លេខកូដ')}
                    className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                    {t('Access Portal', 'ចូលផ្ទាំង')}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    {t('Demo code: "demo"', 'លេខសាកល្បង: "demo"')}
                  </p>
                </form>
              </div>
            ) : selectedProject ? (
              /* Project Detail */
              <div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                  <ChevronRight size={16} className="rotate-180" />
                  {t('Back to projects', 'ត្រឡប់ទៅគម្រោង')}
                </button>
                
                <h3 className="text-2xl font-bold text-white mb-2">{selectedProject.name}</h3>
                
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{t('Overall Progress', 'វឌ្ឍនភាពសរុប')}</span>
                    <span className="text-indigo-400 font-bold">{selectedProject.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedProject.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Milestones */}
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-indigo-400" />
                  {t('Milestones', 'ដំណាក់កាល')}
                </h4>
                <div className="space-y-3">
                  {selectedProject.milestones.map((milestone, idx) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-xl border ${
                        milestone.status === 'completed' ? 'bg-green-500/5 border-green-500/20' :
                        milestone.status === 'in-progress' ? 'bg-indigo-500/5 border-indigo-500/20' :
                        'bg-gray-800/50 border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {milestone.status === 'completed' ? (
                            <CheckCircle className="text-green-400 shrink-0" size={18} />
                          ) : milestone.status === 'in-progress' ? (
                            <Clock className="text-indigo-400 shrink-0 animate-pulse" size={18} />
                          ) : (
                            <AlertCircle className="text-gray-500 shrink-0" size={18} />
                          )}
                          <span className={`font-medium ${milestone.status === 'pending' ? 'text-gray-400' : 'text-white'}`}>
                            {milestone.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{milestone.date}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              /* Projects List */
              <div className="space-y-4">
                {DEMO_PROJECTS.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedProject(project)}
                    className="p-5 bg-gray-800/50 border border-white/10 rounded-2xl cursor-pointer hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{project.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        project.status === 'active' ? 'bg-indigo-500/20 text-indigo-300' :
                        project.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><Calendar size={12} />{project.startDate}</span>
                      <span className="flex items-center gap-1"><FileText size={12} />{project.milestones.length} milestones</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClientPortal;
