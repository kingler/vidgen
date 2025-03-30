'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EnhancedPromptWorkflow from '@/components/planning/EnhancedPromptWorkflow';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { SceneData } from '@/types/planning';

/**
 * Planning page
 * 
 * This page takes the information from the onboarding process and uses 
 * AI to enhance it into a detailed movie plan with scenes ready for image generation
 */
export default function PlanningPage() {
  const router = useRouter();
  const [initialPrompt] = useState<string>(
    "A sci-fi adventure featuring a reluctant hero who discovers advanced technology in a dystopian future."
  );
  
  // This would be populated from the onboarding context in a real implementation
  
  const handleEnhancementComplete = (sceneData: SceneData[]) => {
    console.log('Scene data generated:', sceneData);
    
    // In a real implementation, we would save the scene data to context or state
    // and then navigate to the editor
    
    router.push('/editor');
  };
  
  return (
    <AnimatedBackground
      backgroundUrl="/backgrounds/default-movie-set.gif"
      vignetteIntensity="medium"
    >
      <div className="min-h-screen flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-6xl mx-auto">
          <EnhancedPromptWorkflow
            initialPrompt={initialPrompt}
            onComplete={handleEnhancementComplete}
          />
        </div>
      </div>
    </AnimatedBackground>
  );
}