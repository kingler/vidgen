'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import OptionPill from '@/components/ui/OptionPill';
import DetailInput from '@/components/ui/DetailInput';
import PromptPreview from '@/components/ui/PromptPreview';
import ProgressSteps from '@/components/ui/ProgressSteps';

const toneOptions = [
  'Dark', 'Upbeat', 'Whimsical', 'Tense', 'Melancholic',
  'Comedic', 'Nostalgic', 'Epic', 'Romantic', 'Mysterious'
];

export const ToneThemeSelection: React.FC = () => {
  const router = useRouter();
  const { storyParameters, updateParameter } = useOnboarding();
  const [selectedTone, setSelectedTone] = useState(storyParameters.tone || '');
  const [theme, setTheme] = useState(storyParameters.theme || '');
  
  const handleToneSelect = (tone: string) => {
    setSelectedTone(tone);
    updateParameter('tone', tone);
  };
  
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value);
    updateParameter('theme', e.target.value);
  };
  
  const handleNext = () => {
    if (selectedTone) {
      router.push('/onboarding/step/6');
    }
  };
  
  const handleBack = () => {
    router.push('/onboarding/step/4');
  };
  
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md p-8">
      <ProgressSteps currentStep={5} totalSteps={7} />
      
      <h2 className="text-xl font-bold mb-6">What&apos;s the tone and theme of your story?</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select a tone:</label>
        <div className="flex flex-wrap gap-2">
          {toneOptions.map(tone => (
            <OptionPill
              key={tone}
              label={tone}
              selected={selectedTone === tone}
              onClick={() => handleToneSelect(tone)}
            />
          ))}
        </div>
      </div>
      
      <DetailInput
        label="Theme"
        placeholder="e.g., the consequences of unchecked technological advancement"
        value={theme}
        onChange={handleThemeChange}
        hint="What bigger ideas or concepts does your story explore?"
      />
      
      <PromptPreview />
      
      <div className="flex justify-between mt-8">
        <button 
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          onClick={handleBack}
        >
          Back
        </button>
        
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={!selectedTone}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ToneThemeSelection;