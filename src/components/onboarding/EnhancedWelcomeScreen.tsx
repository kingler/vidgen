'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import GlassMorphicContainer from '@/components/ui/GlassMorphicContainer';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { getRandomCinematicGradient } from '@/lib/backgroundUtils';

export const EnhancedWelcomeScreen: React.FC = () => {
  const router = useRouter();
  const { resetParameters } = useOnboarding();
  
  // Use a fallback gradient in case we don't have the image yet
  const fallbackGradient = getRandomCinematicGradient();
  
  const handleGenerateStory = () => {
    // Reset any existing parameters first
    resetParameters();
    router.push('/onboarding/step/1');
  };
  
  return (
    <AnimatedBackground 
      backgroundUrl="/backgrounds/default-movie-set.gif"
      fallbackGradient={fallbackGradient}
      vignetteIntensity="medium"
    >
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <GlassMorphicContainer className="max-w-md w-full mx-auto p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">
              AI MovieMaker
            </h1>
            <p className="text-white/80">
              Create cinematic scenes and full-length narratives with AI
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleGenerateStory}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black/30"
            >
              Generate a Story
            </button>
            
            <GlassMorphicContainer className="w-full">
              <button
                className="w-full py-3 px-4 text-white/70 font-medium rounded-md hover:text-white/90 transition-colors focus:outline-none opacity-50 cursor-not-allowed"
                disabled
              >
                Upload a Story (Coming Soon)
              </button>
            </GlassMorphicContainer>
          </div>
          
          <p className="mt-8 text-sm text-white/70 text-center">
            Start your creative journey with AI-generated narratives,
            <br />scenes, and character-driven stories.
          </p>
        </GlassMorphicContainer>
      </div>
    </AnimatedBackground>
  );
};

export default EnhancedWelcomeScreen;