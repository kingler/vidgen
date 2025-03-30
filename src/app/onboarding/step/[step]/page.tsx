'use client';

import React, { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import EnhancedGlassMorphicContainer from '@/components/ui/EnhancedGlassMorphicContainer';
import CrossBrowserGenreSelection from '@/components/onboarding/CrossBrowserGenreSelection';
import CrossBrowserSettingSelection from '@/components/onboarding/CrossBrowserSettingSelection';
import CrossBrowserProtagonistCreation from '@/components/onboarding/CrossBrowserProtagonistCreation';
import CrossBrowserAntagonistCreation from '@/components/onboarding/CrossBrowserAntagonistCreation';
import CrossBrowserToneThemeSelection from '@/components/onboarding/CrossBrowserToneThemeSelection';
import CrossBrowserVisualStyleSelection from '@/components/onboarding/CrossBrowserVisualStyleSelection';
import CrossBrowserReviewGenerate from '@/components/onboarding/CrossBrowserReviewGenerate';

export default function StepPage({ params }: { params: Promise<{ step: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const step = parseInt(resolvedParams.step);
  const { getCurrentStep } = useOnboarding();
  
  // Validate step and redirect if necessary
  useEffect(() => {
    const currentStep = getCurrentStep();
    
    // If trying to access a step that's too far ahead
    if (step > currentStep + 1) {
      router.push(`/onboarding/step/${currentStep}`);
    }
    
    // If step is invalid
    if (isNaN(step) || step < 1 || step > 7) {
      router.push('/onboarding/step/1');
    }
  }, [step, getCurrentStep, router]);
  
  // Render appropriate step component
  switch (step) {
    case 1:
      return <CrossBrowserGenreSelection />;
    case 2:
      return <CrossBrowserSettingSelection />;
    case 3:
      return <CrossBrowserProtagonistCreation />;
    case 4:
      return <CrossBrowserAntagonistCreation />;
    case 5:
      return <CrossBrowserToneThemeSelection />;
    case 6:
      return <CrossBrowserVisualStyleSelection />;
    case 7:
      return <CrossBrowserReviewGenerate />;
    default:
      return (
        <EnhancedGlassMorphicContainer className="max-w-md w-full mx-auto p-8">
          <h2 className="text-xl font-bold text-white mb-6">Invalid Step</h2>
          <p className="text-white/80 mb-4">This step is under development...</p>
          <div className="flex justify-center mt-8">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black/30"
              onClick={() => router.push('/')}
            >
              Return Home
            </button>
          </div>
        </EnhancedGlassMorphicContainer>
      );
  }
}