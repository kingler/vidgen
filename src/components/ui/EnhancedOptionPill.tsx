'use client';

import React from 'react';
import GlassMorphicContainer from './GlassMorphicContainer';

interface EnhancedOptionPillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export const EnhancedOptionPill: React.FC<EnhancedOptionPillProps> = ({
  label,
  selected,
  onClick,
  className = '',
}) => {
  return (
    <GlassMorphicContainer
      intense={selected}
      className={`${className} cursor-pointer transition-all duration-300 transform ${
        selected ? 'scale-105 ring-2 ring-blue-500/70' : 'hover:scale-105'
      }`}
    >
      <button
        className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none ${
          selected
            ? 'text-white bg-gradient-to-r from-blue-600/20 to-indigo-600/20'
            : 'text-white/90 hover:text-white'
        }`}
        onClick={onClick}
        type="button"
      >
        {label}
      </button>
    </GlassMorphicContainer>
  );
};

export default EnhancedOptionPill;