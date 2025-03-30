'use client';

import React from 'react';

interface OptionPillProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
}

export const OptionPill: React.FC<OptionPillProps> = ({ 
  label, 
  selected = false, 
  onClick 
}) => {
  return (
    <button
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
        ${selected 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }
      `}
      onClick={onClick}
      type="button"
      aria-pressed={selected}
    >
      {label}
    </button>
  );
};

export default OptionPill;