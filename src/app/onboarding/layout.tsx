'use client';

import React from 'react';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { getRandomCinematicGradient } from '@/lib/backgroundUtils';

// Use a fallback gradient since we can't directly create GIF files through the tool
const FALLBACK_GRADIENT = getRandomCinematicGradient();

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimatedBackground
      backgroundUrl="/backgrounds/default-movie-set.gif"
      fallbackGradient={FALLBACK_GRADIENT}
      vignetteIntensity="medium"
    >
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {children}
      </div>
    </AnimatedBackground>
  );
}