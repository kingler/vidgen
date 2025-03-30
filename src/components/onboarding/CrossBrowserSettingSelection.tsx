'use client';

import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import CrossBrowserOptionPill from '@/components/ui/CrossBrowserOptionPill';
import EnhancedDetailInput from '@/components/ui/EnhancedDetailInput';
import CrossBrowserTablePromptPreview from '@/components/ui/CrossBrowserTablePromptPreview';
import StepContainer from '@/components/ui/StepContainer';

const settingOptions = [
  'Urban City', 'Medieval Castle', 'Space Station', 'Enchanted Forest',
  'Post-Apocalyptic', 'Desert Oasis', 'Underwater Realm', 'Cyberpunk Metropolis',
  'Floating Islands', 'Ancient Temple'
];

/**
 * Cross-browser compatible setting selection component
 * Ensures consistent styling and usability across all browsers
 */
export const CrossBrowserSettingSelection: React.FC = () => {
  const { storyParameters, updateParameter } = useOnboarding();
  const [selectedSetting, setSelectedSetting] = useState(storyParameters.setting || '');
  const [settingDetails, setSettingDetails] = useState(storyParameters.settingDetails || '');
  const [timeframe, setTimeframe] = useState(storyParameters.timeframe || '');
  
  const handleSettingSelect = (setting: string) => {
    setSelectedSetting(setting);
    updateParameter('setting', setting);
  };
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettingDetails(e.target.value);
    updateParameter('settingDetails', e.target.value);
  };
  
  const handleTimeframeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeframe(e.target.value);
    updateParameter('timeframe', e.target.value);
  };
  
  return (
    <StepContainer
      title="Where does your story take place?"
      currentStep={2}
      totalSteps={7}
      nextDisabled={!selectedSetting}
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {settingOptions.map(setting => (
          <CrossBrowserOptionPill
            key={setting}
            label={setting}
            selected={selectedSetting === setting}
            onClick={() => handleSettingSelect(setting)}
          />
        ))}
      </div>
      
      <EnhancedDetailInput
        label="Describe the setting"
        placeholder="e.g., a neon-lit city with towering skyscrapers"
        value={settingDetails}
        onChange={handleDetailsChange}
        hint="Add specific details about your world."
      />
      
      <EnhancedDetailInput
        label="Time period (optional)"
        placeholder="e.g., distant future, medieval era, 1980s"
        value={timeframe}
        onChange={handleTimeframeChange}
        hint="When does your story take place?"
      />
      
      <CrossBrowserTablePromptPreview />
    </StepContainer>
  );
};

export default CrossBrowserSettingSelection;