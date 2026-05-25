
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PortfolioFiltersProps {
  categories: { id: string; label: string }[];
  currentFilter: string;
  onFilterChange: (id: string) => void;
}

const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({ categories, currentFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap justify-start md:justify-end gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onFilterChange(cat.id)}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 border font-khmer ${
            currentFilter === cat.id 
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 border-gray-900 dark:border-white' 
            : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default PortfolioFilters;
