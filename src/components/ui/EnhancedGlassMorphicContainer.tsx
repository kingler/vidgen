'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { supportsCssBackdropFilter } from '@/lib/browserUtils';

interface EnhancedGlassMorphicContainerProps {
  children: ReactNode;
  className?: string;
  intense?: boolean; // More pronounced glass effect
}

/**
 * An enhanced glass morphic container with cross-browser compatibility
 * Provides fallbacks for browsers that don't support backdrop-filter
 */
export const EnhancedGlassMorphicContainer: React.FC<EnhancedGlassMorphicContainerProps> = ({
  children,
  className = '',
  intense = false
}) => {
  // Track if the browser supports backdrop-filter
  const [supportsBlur, setSupportsBlur] = useState(false);
  // Track if the component is mounted (for hydration safety)
  const [isMounted, setIsMounted] = useState(false);
  
  // Check for feature support after mounting
  useEffect(() => {
    setIsMounted(true);
    setSupportsBlur(supportsCssBackdropFilter());
  }, []);
  
  // Base classes that apply to all variants
  const baseClasses = "rounded-xl shadow-lg border border-white/10";
  
  // Determine background classes based on browser support and intensity
  const getBackgroundClasses = () => {
    // If not mounted yet, use fallback (for SSR and hydration)
    if (!isMounted) {
      return intense ? "bg-custom-gray-70" : "bg-custom-gray-50";
    }
    
    // If browser supports backdrop-filter, use glass effect
    if (supportsBlur) {
      return intense
        ? "bg-custom-gray-40 backdrop-blur-md shadow-xl"
        : "bg-custom-gray-30 backdrop-blur-sm";
    }
    
    // Fallback for browsers without backdrop-filter support
    return intense
      ? "bg-custom-gray-70" // Solid dark fallback for intense
      : "bg-custom-gray-50"; // Solid dark fallback for normal
  };
  
  const backgroundClasses = getBackgroundClasses();
  
  return (
    <div className={`${baseClasses} ${backgroundClasses} ${className}`}>
      {children}
    </div>
  );
};

export default EnhancedGlassMorphicContainer;