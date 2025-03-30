'use client';

/**
 * Utility functions for browser feature detection
 */

/**
 * Checks if the browser supports CSS backdrop-filter
 * @returns {boolean} Whether backdrop-filter is supported
 */
export const supportsCssBackdropFilter = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return false;
  
  // Check if CSS.supports is available and supports backdrop-filter
  return 'CSS' in window && CSS.supports('backdrop-filter', 'blur(10px)');
};

/**
 * Checks if the browser is Safari
 * @returns {boolean} Whether the current browser is Safari
 */
export const isSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Safari doesn't have 'chrome' in userAgent but has 'Safari'
  return (
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
    // Also detect Safari by checking for specific WebKit features but not Chrome
    (!!navigator.userAgent.match(/AppleWebKit/) && 
     !navigator.userAgent.match(/Chrome/))
  );
};

/**
 * Hook to get feature support in components
 * This can be used in actual React components
 */
export const useBrowserFeatures = () => {
  const isClient = typeof window !== 'undefined';
  
  // Return a simple object with feature flags
  return {
    supportsBackdropFilter: isClient ? supportsCssBackdropFilter() : false,
    isSafari: isClient ? isSafari() : false,
    // Add other feature detections as needed
  };
};