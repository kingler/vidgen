'use client';

import React from 'react';

interface DetailInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
}

export const DetailInput: React.FC<DetailInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  hint
}) => {
  return (
    <div className="w-full mb-4">
      <label 
        htmlFor={label.replace(/\s+/g, '-').toLowerCase()} 
        className="block text-sm font-medium mb-1"
      >
        {label}
      </label>
      <input
        id={label.replace(/\s+/g, '-').toLowerCase()}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {hint && (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
};

export default DetailInput;