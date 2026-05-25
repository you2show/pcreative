import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../contexts/SoundContext';

const SoundToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { soundEnabled, toggleSound } = useSound();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleSound}
      className={`p-2 rounded-full transition-colors bg-white/10 hover:bg-white/20 ${className}`}
      aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
      title={soundEnabled ? 'Sound On' : 'Sound Off'}
    >
      {soundEnabled ? (
        <Volume2 size={18} className="text-indigo-300" />
      ) : (
        <VolumeX size={18} className="text-gray-500" />
      )}
    </motion.button>
  );
};

export default SoundToggle;
