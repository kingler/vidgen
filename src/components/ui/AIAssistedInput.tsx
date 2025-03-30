'use client';

import React, { useState } from 'react';
import GlassMorphicContainer from './GlassMorphicContainer';

interface AIAssistedInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  className?: string;
  onGenerateSimilar?: () => void; // Optional callback for generating similar content
  isGenerating?: boolean; // Loading state for AI generation
}

export const AIAssistedInput: React.FC<AIAssistedInputProps> = ({
  label,
  placeholder = '',
  value,
  onChange,
  hint,
  className = '',
  onGenerateSimilar,
  isGenerating = false,
}) => {
  // Local states
  const [isFocused, setIsFocused] = useState(false);
  
  // Use the provided hint
  const useHint = () => {
    if (hint) {
      // Create a synthetic event to pass to onChange
      const syntheticEvent = {
        target: { value: hint },
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full p-2 rounded-md border border-white/30 bg-black/30 text-white placeholder-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        
        {/* Show AI assistance buttons when input is focused or has hint */}
        {(isFocused || !value) && hint && (
          <div className="absolute right-0 top-full mt-1 flex gap-1 z-10">
            <GlassMorphicContainer className="p-1">
              <button
                onClick={useHint}
                className="text-xs px-2 py-1 text-white/90 hover:text-white flex items-center gap-1 transition-colors"
                disabled={isGenerating}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                Use Hint
              </button>
            </GlassMorphicContainer>
            
            {onGenerateSimilar && (
              <GlassMorphicContainer className="p-1">
                <button
                  onClick={onGenerateSimilar}
                  className="text-xs px-2 py-1 text-white/90 hover:text-white flex items-center gap-1 transition-colors"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="h-3 w-3 border-t-2 border-r-2 border-white rounded-full animate-spin mr-1" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  )}
                  Generate Similar
                </button>
              </GlassMorphicContainer>
            )}
          </div>
        )}
      </div>
      
      {/* Display hint below the input */}
      {hint && !value && !isFocused && (
        <p className="mt-1 text-xs text-white/70 italic">
          Hint: {hint}
        </p>
      )}
    </div>
  );
};

export default AIAssistedInput;