'use client';

import React from 'react';

interface EnhancedDetailInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  className?: string;
}

export const EnhancedDetailInput: React.FC<EnhancedDetailInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  hint,
  className = ''
}) => {
  return (
    <div className={`w-full mb-4 ${className}`}>
      <label 
        htmlFor={label.replace(/\s+/g, '-').toLowerCase()} 
        className="block text-sm font-medium text-white mb-1"
      >
        {label}
      </label>
      <input
        id={label.replace(/\s+/g, '-').toLowerCase()}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-white/30 rounded-md text-sm bg-custom-gray-30 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      {hint && (
        <p className="mt-1 text-xs text-white/70">{hint}</p>
      )}
    </div>
  );
};

export default EnhancedDetailInput;