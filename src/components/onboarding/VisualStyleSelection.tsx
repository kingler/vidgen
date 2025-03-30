'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import OptionPill from '@/components/ui/OptionPill';
import DetailInput from '@/components/ui/DetailInput';
import PromptPreview from '@/components/ui/PromptPreview';
import ProgressSteps from '@/components/ui/ProgressSteps';

const visualStyleOptions = [
  'Photorealistic', 'Animated', 'Noir', 'Watercolor', 'Cinematic',
  'Comic Book', 'Surrealist', 'Retro', 'Minimalist', 'Fantasy'
];

const colorPaletteOptions = [
  'Vibrant', 'Muted', 'Monochrome', 'Pastel', 'Dark', 
  'Neon', 'Warm', 'Cool', 'Sepia', 'High Contrast'
];

export const VisualStyleSelection: React.FC = () => {
  const router = useRouter();
  const { storyParameters, updateParameter } = useOnboarding();
  const [selectedStyle, setSelectedStyle] = useState(storyParameters.visualStyle || '');
  const [styleDetails, setStyleDetails] = useState(storyParameters.visualStyleDetails || '');
  const [colorPalette, setColorPalette] = useState(storyParameters.colorPalette || '');
  
  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    updateParameter('visualStyle', style);
  };

  const handleColorSelect = (color: string) => {
    setColorPalette(color);
    updateParameter('colorPalette', color);
  };
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStyleDetails(e.target.value);
    updateParameter('visualStyleDetails', e.target.value);
  };
  
  const handleNext = () => {
    if (selectedStyle) {
      router.push('/onboarding/step/7');
    }
  };
  
  const handleBack = () => {
    router.push('/onboarding/step/5');
  };
  
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md p-8">
      <ProgressSteps currentStep={6} totalSteps={7} />
      
      <h2 className="text-xl font-bold mb-6">Choose a visual style</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Visual style:</label>
        <div className="flex flex-wrap gap-2">
          {visualStyleOptions.map(style => (
            <OptionPill
              key={style}
              label={style}
              selected={selectedStyle === style}
              onClick={() => handleStyleSelect(style)}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Color palette (optional):</label>
        <div className="flex flex-wrap gap-2">
          {colorPaletteOptions.map(color => (
            <OptionPill
              key={color}
              label={color}
              selected={colorPalette === color}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      </div>
      
      <DetailInput
        label="Style details"
        placeholder="e.g., inspired by Blade Runner with heavy use of neon and shadow"
        value={styleDetails}
        onChange={handleDetailsChange}
        hint="Describe specific visual elements or influences."
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
          disabled={!selectedStyle}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VisualStyleSelection;