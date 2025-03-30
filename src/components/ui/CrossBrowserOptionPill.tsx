'use client';

import React from 'react';
import EnhancedGlassMorphicContainer from './EnhancedGlassMorphicContainer';

interface CrossBrowserOptionPillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * An enhanced option pill with better cross-browser compatibility and contrast
 */
export const CrossBrowserOptionPill: React.FC<CrossBrowserOptionPillProps> = ({
  label,
  selected,
  onClick,
  className = '',
}) => {
  // Enhanced styling for better visibility in all browsers
  return (
    <EnhancedGlassMorphicContainer
      intense={selected}
      className={`${className} cursor-pointer transition-all duration-300 transform ${
        selected ? 'scale-105 ring-2 ring-blue-500/70' : 'hover:scale-105'
      }`}
    >
      <button
        className={`w-full px-4 py-2 text-sm font-medium rounded-md focus:outline-none ${
          selected
            ? 'text-white bg-gradient-to-r from-blue-600/40 to-indigo-600/40 font-medium'
            : 'text-white hover:text-white' // Always use white text for better contrast
        }`}
        onClick={onClick}
        type="button"
      >
        {label}
      </button>
    </EnhancedGlassMorphicContainer>
  );
};

export default CrossBrowserOptionPill;