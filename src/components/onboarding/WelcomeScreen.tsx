'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';

export const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  const { resetParameters } = useOnboarding();
  
  const handleGenerateStory = () => {
    // Reset any existing parameters first
    resetParameters();
    router.push('/onboarding/step/1');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-800">
            AI MovieMaker
          </h1>
          <p className="text-slate-600">
            Create cinematic scenes and full-length narratives with AI
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleGenerateStory}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Generate a Story
          </button>
          
          <button
            className="w-full py-3 px-4 bg-slate-200 text-slate-700 font-medium rounded-md hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 opacity-50 cursor-not-allowed"
            disabled
          >
            Upload a Story (Coming Soon)
          </button>
        </div>
        
        <p className="mt-8 text-sm text-slate-500 text-center">
          Start your creative journey with AI-generated narratives,
          <br />scenes, and character-driven stories.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;