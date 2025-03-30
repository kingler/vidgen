'use client';

import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import CrossBrowserOptionPill from '@/components/ui/CrossBrowserOptionPill';
import EnhancedDetailInput from '@/components/ui/EnhancedDetailInput';
import CrossBrowserTablePromptPreview from '@/components/ui/CrossBrowserTablePromptPreview';
import StepContainer from '@/components/ui/StepContainer';

const toneOptions = [
  'Dark', 'Upbeat', 'Whimsical', 'Tense', 'Melancholic',
  'Comedic', 'Nostalgic', 'Epic', 'Romantic', 'Mysterious'
];

/**
 * Cross-browser compatible tone and theme selection component
 * Ensures consistent styling and usability across all browsers
 */
export const CrossBrowserToneThemeSelection: React.FC = () => {
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
  
  return (
    <StepContainer
      title="What's the tone and theme of your story?"
      currentStep={5}
      totalSteps={7}
      nextDisabled={!selectedTone}
    >
      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">Select a tone:</label>
        <div className="flex flex-wrap gap-2">
          {toneOptions.map(tone => (
            <CrossBrowserOptionPill
              key={tone}
              label={tone}
              selected={selectedTone === tone}
              onClick={() => handleToneSelect(tone)}
            />
          ))}
        </div>
      </div>
      
      <EnhancedDetailInput
        label="Theme"
        placeholder="e.g., the consequences of unchecked technological advancement"
        value={theme}
        onChange={handleThemeChange}
        hint="What bigger ideas or concepts does your story explore?"
      />
      
      <CrossBrowserTablePromptPreview />
    </StepContainer>
  );
};

export default CrossBrowserToneThemeSelection;