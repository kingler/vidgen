'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import OptionPill from '@/components/ui/OptionPill';
import DetailInput from '@/components/ui/DetailInput';
import PromptPreview from '@/components/ui/PromptPreview';
import ProgressSteps from '@/components/ui/ProgressSteps';

const antagonistOptions = [
  'Power-Hungry Villain', 'Rival', 'Natural Force', 'Inner Demon', 'Organization',
  'Corrupt System', 'Monster', 'Zealot', 'Rogue AI', 'Mysterious Entity'
];

export const AntagonistCreation: React.FC = () => {
  const router = useRouter();
  const { storyParameters, updateParameter } = useOnboarding();
  const [selectedAntagonist, setSelectedAntagonist] = useState(storyParameters.antagonist || '');
  const [antagonistDetails, setAntagonistDetails] = useState(storyParameters.antagonistDetails || '');
  const [conflict, setConflict] = useState(storyParameters.conflict || '');
  
  const handleAntagonistSelect = (antagonist: string) => {
    setSelectedAntagonist(antagonist);
    updateParameter('antagonist', antagonist);
  };
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAntagonistDetails(e.target.value);
    updateParameter('antagonistDetails', e.target.value);
  };

  const handleConflictChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConflict(e.target.value);
    updateParameter('conflict', e.target.value);
  };
  
  const handleNext = () => {
    if (selectedAntagonist) {
      router.push('/onboarding/step/5');
    }
  };
  
  const handleBack = () => {
    router.push('/onboarding/step/3');
  };
  
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md p-8">
      <ProgressSteps currentStep={4} totalSteps={7} />
      
      <h2 className="text-xl font-bold mb-6">What challenges your protagonist?</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {antagonistOptions.map(antagonist => (
          <OptionPill
            key={antagonist}
            label={antagonist}
            selected={selectedAntagonist === antagonist}
            onClick={() => handleAntagonistSelect(antagonist)}
          />
        ))}
      </div>
      
      <DetailInput
        label="Antagonist details"
        placeholder="e.g., a corrupt corporate executive with augmented abilities"
        value={antagonistDetails}
        onChange={handleDetailsChange}
        hint="Describe your antagonist's unique traits or motivations."
      />

      <DetailInput
        label="Central conflict"
        placeholder="e.g., a struggle for control of a revolutionary technology"
        value={conflict}
        onChange={handleConflictChange}
        hint="What's the heart of the conflict in your story?"
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
          disabled={!selectedAntagonist}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AntagonistCreation;