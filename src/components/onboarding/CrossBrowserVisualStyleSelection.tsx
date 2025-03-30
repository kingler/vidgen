'use client';

import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import CrossBrowserOptionPill from '@/components/ui/CrossBrowserOptionPill';
import EnhancedDetailInput from '@/components/ui/EnhancedDetailInput';
import CrossBrowserTablePromptPreview from '@/components/ui/CrossBrowserTablePromptPreview';
import StepContainer from '@/components/ui/StepContainer';

const visualStyleOptions = [
  'Photorealistic', 'Animated', 'Noir', 'Watercolor', 'Cinematic',
  'Comic Book', 'Surrealist', 'Retro', 'Minimalist', 'Fantasy'
];

const colorPaletteOptions = [
  'Vibrant', 'Muted', 'Monochrome', 'Pastel', 'Dark', 
  'Neon', 'Warm', 'Cool', 'Sepia', 'High Contrast'
];

/**
 * Cross-browser compatible visual style selection component
 * Ensures consistent styling and usability across all browsers
 */
export const CrossBrowserVisualStyleSelection: React.FC = () => {
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
  
  return (
    <StepContainer
      title="Choose a visual style"
      currentStep={6}
      totalSteps={7}
      nextDisabled={!selectedStyle}
    >
      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">Visual style:</label>
        <div className="flex flex-wrap gap-2">
          {visualStyleOptions.map(style => (
            <CrossBrowserOptionPill
              key={style}
              label={style}
              selected={selectedStyle === style}
              onClick={() => handleStyleSelect(style)}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">Color palette (optional):</label>
        <div className="flex flex-wrap gap-2">
          {colorPaletteOptions.map(color => (
            <CrossBrowserOptionPill
              key={color}
              label={color}
              selected={colorPalette === color}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      </div>
      
      <EnhancedDetailInput
        label="Style details"
        placeholder="e.g., inspired by Blade Runner with heavy use of neon and shadow"
        value={styleDetails}
        onChange={handleDetailsChange}
        hint="Describe specific visual elements or influences."
      />
      
      <CrossBrowserTablePromptPreview />
    </StepContainer>
  );
};

export default CrossBrowserVisualStyleSelection;