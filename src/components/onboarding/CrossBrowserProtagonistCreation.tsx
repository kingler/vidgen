'use client';

import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import CrossBrowserOptionPill from '@/components/ui/CrossBrowserOptionPill';
import EnhancedDetailInput from '@/components/ui/EnhancedDetailInput';
import CrossBrowserTablePromptPreview from '@/components/ui/CrossBrowserTablePromptPreview';
import StepContainer from '@/components/ui/StepContainer';

const protagonistOptions = [
  'Reluctant Hero', 'Antihero', 'Chosen One', 'Underdog', 'Detective',
  'Inventor', 'Warrior', 'Scholar', 'Rebel', 'Outcast', 'Leader', 'Explorer'
];

/**
 * Cross-browser compatible protagonist creation component
 * Ensures consistent styling and usability across all browsers
 */
export const CrossBrowserProtagonistCreation: React.FC = () => {
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
  
  return (
    <StepContainer
      title="Who is your main character?"
      currentStep={3}
      totalSteps={7}
      nextDisabled={!selectedProtagonist}
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {protagonistOptions.map(protagonist => (
          <CrossBrowserOptionPill
            key={protagonist}
            label={protagonist}
            selected={selectedProtagonist === protagonist}
            onClick={() => handleProtagonistSelect(protagonist)}
          />
        ))}
      </div>
      
      <EnhancedDetailInput
        label="Character details"
        placeholder="e.g., a washed-up cybernetic jazz musician with a secret"
        value={protagonistDetails}
        onChange={handleDetailsChange}
        hint="Describe your character's unique traits, background, or motivation."
      />
      
      <CrossBrowserTablePromptPreview />
    </StepContainer>
  );
};

export default CrossBrowserProtagonistCreation;