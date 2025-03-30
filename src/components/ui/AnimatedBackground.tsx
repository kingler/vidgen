'use client';

import React, { useState, useEffect } from 'react';
import { getBackgroundWithFallback, getRandomCinematicGradient } from '@/lib/backgroundUtils';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  backgroundUrl?: string; // Optional URL for background image or GIF
  fallbackGradient?: string; // Optional fallback gradient if image fails to load
  vignetteIntensity?: 'light' | 'medium' | 'heavy'; // Control darkness of vignette
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  backgroundUrl = '/backgrounds/default-movie-set.gif', // Default background
  fallbackGradient,
  vignetteIntensity = 'medium',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [actualBackground, setActualBackground] = useState<string>(backgroundUrl);
  const [isImageBackground, setIsImageBackground] = useState(true);

  // Map vignette intensity to CSS values
  const vignetteMap = {
    light: 'bg-gradient-to-r from-custom-gray-30 via-transparent to-custom-gray-30',
    medium: 'bg-gradient-radial from-transparent via-transparent to-custom-gray-50',
    heavy: 'bg-gradient-radial from-transparent via-transparent to-custom-gray-70',
  };

  const vignetteClass = vignetteMap[vignetteIntensity];

  // Determine background to use with fallback handling
  useEffect(() => {
    const loadBackground = async () => {
      // Start with not loaded
      setIsLoaded(false);
      
      // Get the actual background (image or fallback)
      const fallback = fallbackGradient || getRandomCinematicGradient();
      const result = await getBackgroundWithFallback(backgroundUrl, fallback);
      
      // Check if we're using an image or gradient
      const isImage = result === backgroundUrl;
      setIsImageBackground(isImage);
      setActualBackground(result);
      
      // If it's a gradient, we're "loaded" immediately
      if (!isImage) {
        setIsLoaded(true);
      }
    };
    
    loadBackground();
  }, [backgroundUrl, fallbackGradient]);
  
  // Handle image loading if we're using an image background
  useEffect(() => {
    if (isImageBackground) {
      const preloadImage = new window.Image();
      preloadImage.src = actualBackground;
      preloadImage.onload = () => setIsLoaded(true);
      
      return () => {
        // Clean up
        preloadImage.onload = null;
      };
    }
  }, [actualBackground, isImageBackground]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image/Video */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {isImageBackground ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${actualBackground})` }}
          />
        ) : (
          <div 
            className="absolute inset-0"
            style={{ background: actualBackground }}
          />
        )}
      </div>

      {/* Vignette Effect */}
      <div className={`absolute inset-0 ${vignetteClass}`} />

      {/* Overlay to darken the background */}
      <div className="absolute inset-0 bg-custom-gray-40" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen w-full">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;