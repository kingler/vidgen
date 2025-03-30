'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import OptionPill from '@/components/ui/OptionPill';
import DetailInput from '@/components/ui/DetailInput';
import PromptPreview from '@/components/ui/PromptPreview';
import ProgressSteps from '@/components/ui/ProgressSteps';

const settingOptions = [
  'Urban City', 'Medieval Castle', 'Space Station', 'Enchanted Forest',
  'Post-Apocalyptic', 'Desert Oasis', 'Underwater Realm', 'Cyberpunk Metropolis',
  'Floating Islands', 'Ancient Temple'
];

export const SettingSelection: React.FC = () => {
  const router = useRouter();
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
  
  const handleNext = () => {
    if (selectedSetting) {
      router.push('/onboarding/step/3');
    }
  };
  
  const handleBack = () => {
    router.push('/onboarding/step/1');
  };
  
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md p-8">
      <ProgressSteps currentStep={2} totalSteps={7} />
      
      <h2 className="text-xl font-bold mb-6">Where does your story take place?</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {settingOptions.map(setting => (
          <OptionPill
            key={setting}
            label={setting}
            selected={selectedSetting === setting}
            onClick={() => handleSettingSelect(setting)}
          />
        ))}
      </div>
      
      <DetailInput
        label="Describe the setting"
        placeholder="e.g., a neon-lit city with towering skyscrapers"
        value={settingDetails}
        onChange={handleDetailsChange}
        hint="Add specific details about your world."
      />
      
      <DetailInput
        label="Time period (optional)"
        placeholder="e.g., distant future, medieval era, 1980s"
        value={timeframe}
        onChange={handleTimeframeChange}
        hint="When does your story take place?"
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
          disabled={!selectedSetting}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SettingSelection;