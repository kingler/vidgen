'use client';

import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import CrossBrowserOptionPill from '@/components/ui/CrossBrowserOptionPill';
import EnhancedDetailInput from '@/components/ui/EnhancedDetailInput';
import CrossBrowserTablePromptPreview from '@/components/ui/CrossBrowserTablePromptPreview';
import StepContainer from '@/components/ui/StepContainer';

const antagonistOptions = [
  'Power-Hungry Villain', 'Rival', 'Natural Force', 'Inner Demon', 'Organization',
  'Corrupt System', 'Monster', 'Zealot', 'Rogue AI', 'Mysterious Entity'
];

/**
 * Cross-browser compatible antagonist creation component
 * Ensures consistent styling and usability across all browsers
 */
export const CrossBrowserAntagonistCreation: React.FC = () => {
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
  
  return (
    <StepContainer
      title="What challenges your protagonist?"
      currentStep={4}
      totalSteps={7}
      nextDisabled={!selectedAntagonist}
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {antagonistOptions.map(antagonist => (
          <CrossBrowserOptionPill
            key={antagonist}
            label={antagonist}
            selected={selectedAntagonist === antagonist}
            onClick={() => handleAntagonistSelect(antagonist)}
          />
        ))}
      </div>
      
      <EnhancedDetailInput
        label="Antagonist details"
        placeholder="e.g., a corrupt corporate executive with augmented abilities"
        value={antagonistDetails}
        onChange={handleDetailsChange}
        hint="Describe your antagonist's unique traits or motivations."
      />

      <EnhancedDetailInput
        label="Central conflict"
        placeholder="e.g., a struggle for control of a revolutionary technology"
        value={conflict}
        onChange={handleConflictChange}
        hint="What's the heart of the conflict in your story?"
      />
      
      <CrossBrowserTablePromptPreview />
    </StepContainer>
  );
};

export default CrossBrowserAntagonistCreation;