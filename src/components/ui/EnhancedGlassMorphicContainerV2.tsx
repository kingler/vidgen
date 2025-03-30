'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { supportsCssBackdropFilter } from '@/lib/browserUtils';
import { getGlassMorphicClasses, componentStyles } from '@/lib/designSystem';

interface EnhancedGlassMorphicContainerV2Props {
  children: ReactNode;
  className?: string;
  intense?: boolean; // More pronounced glass effect
  padding?: 'small' | 'medium' | 'large';
}

/**
 * An enhanced glass morphic container using the design system
 * Provides consistent styling and fallbacks for cross-browser compatibility
 */
export const EnhancedGlassMorphicContainerV2: React.FC<EnhancedGlassMorphicContainerV2Props> = ({
  children,
  className = '',
  intense = false,
  padding = 'medium'
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
  
  // Use the design system to generate the appropriate classes
  const getContainerClasses = () => {
    // If not mounted yet, use a base class (for SSR and hydration)
    if (!isMounted) {
      return `${componentStyles.container.rounded} ${componentStyles.container.padding[padding]}`;
    }
    
    // Get glass morphic classes from design system
    const glassMorphicClasses = getGlassMorphicClasses(supportsBlur, intense);
    
    return `${componentStyles.container.rounded} ${componentStyles.container.padding[padding]} ${glassMorphicClasses}`;
  };
  
  const containerClasses = getContainerClasses();
  
  return (
    <div className={`${containerClasses} ${className}`}>
      {children}
    </div>
  );
};

export default EnhancedGlassMorphicContainerV2;