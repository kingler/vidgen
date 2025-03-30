'use client';

import React, { ReactNode } from 'react';

interface GlassMorphicContainerProps {
  children: ReactNode;
  className?: string;
  intense?: boolean; // More pronounced glass effect
}

export const GlassMorphicContainer: React.FC<GlassMorphicContainerProps> = ({
  children,
  className = '',
  intense = false
}) => {
  const baseClasses = "rounded-xl backdrop-blur-md shadow-lg border border-white/10";
  const intensityClasses = intense 
    ? "bg-white/10 shadow-xl" 
    : "bg-white/20";
  
  return (
    <div className={`${baseClasses} ${intensityClasses} ${className}`}>
      {children}
    </div>
  );
};

export default GlassMorphicContainer;