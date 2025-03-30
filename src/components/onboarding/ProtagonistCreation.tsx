'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import OptionPill from '@/components/ui/OptionPill';
import DetailInput from '@/components/ui/DetailInput';
import PromptPreview from '@/components/ui/PromptPreview';
import ProgressSteps from '@/components/ui/ProgressSteps';

const protagonistOptions = [
  'Reluctant Hero', 'Antihero', 'Chosen One', 'Underdog', 'Detective',
  'Inventor', 'Warrior', 'Scholar', 'Rebel', 'Outcast', 'Leader', 'Explorer'
];

export const ProtagonistCreation: React.FC = () => {
  const router = useRouter();
  const { storyParameters, updateParameter } = useOnboarding();
  const [selectedProtagonist, setSelectedProtagonist] = useState(storyParameters.protagonist || '');
  const [protagonistDetails, setProtagonistDetails] = useState(storyParameters.protagonistDetails || '');
  
  const handleProtagonistSelect = (protagonist: string) => {
    setSelectedProtagonist(protagonist);
    updateParameter('protagonist', protagonist);
  };
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProtagonistDetails(e.target.value);
    updateParameter('protagonistDetails', e.target.value);
  };
  
  const handleNext = () => {
    if (selectedProtagonist) {
      router.push('/onboarding/step/4');
    }
  };
  
  const handleBack = () => {
    router.push('/onboarding/step/2');
  };
  
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md p-8">
      <ProgressSteps currentStep={3} totalSteps={7} />
      
      <h2 className="text-xl font-bold mb-6">Who is your main character?</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {protagonistOptions.map(protagonist => (
          <OptionPill
            key={protagonist}
            label={protagonist}
            selected={selectedProtagonist === protagonist}
            onClick={() => handleProtagonistSelect(protagonist)}
          />
        ))}
      </div>
      
      <DetailInput
        label="Character details"
        placeholder="e.g., a washed-up cybernetic jazz musician with a secret"
        value={protagonistDetails}
        onChange={handleDetailsChange}
        hint="Describe your character's unique traits, background, or motivation."
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
          disabled={!selectedProtagonist}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProtagonistCreation;