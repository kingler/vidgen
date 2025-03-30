'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import EnhancedGlassMorphicContainerV2 from '@/components/ui/EnhancedGlassMorphicContainerV2';
import StepContainer from '@/components/ui/StepContainer';
import { buildPromptFromParameters } from '@/lib/promptBuilder';

/**
 * Cross-browser compatible review and generate component
 * Uses the new design system for consistent styling
 */
export const CrossBrowserReviewGenerate: React.FC = () => {
  const router = useRouter();
  const { storyParameters, updateNestedParameter } = useOnboarding();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [chapterCount, setChapterCount] = useState(storyParameters.storyStructure?.chapterCount || 3);
  const [scenesPerChapter, setScenesPerChapter] = useState(storyParameters.storyStructure?.scenesPerChapter || 3);
  
  const handleChapterCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setChapterCount(value);
    updateNestedParameter('storyStructure', 'chapterCount', value);
  };
  
  const handleScenesPerChapterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setScenesPerChapter(value);
    updateNestedParameter('storyStructure', 'scenesPerChapter', value);
  };
  
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // In a real implementation, this would call an API to generate the story
    // For now, simulate a generation process with a timeout
    setTimeout(() => {
      // Instead of going directly to the editor, go to the planning page
      router.push('/planning');
    }, 2000);
  };
  
  // Custom onNext handler to trigger generation instead of navigation
  const handleNext = () => {
    handleGenerate();
  };
  
  const finalPrompt = buildPromptFromParameters(storyParameters);
  
  return (
    <StepContainer
      title="Review your story parameters"
      currentStep={7}
      totalSteps={7}
      onNext={handleNext}
      nextDisabled={isGenerating}
      backVisible={!isGenerating}
    >
      <div className="mb-6 space-y-4">
        <EnhancedGlassMorphicContainerV2 className="p-4 mb-4" padding="small">
          <h3 className="font-semibold text-md mb-2 text-white">Story Details</h3>
          <div className="space-y-1 text-sm">
            {storyParameters.genre && (
              <p className="text-white"><span className="font-medium">Genre:</span> {storyParameters.genre} 
                {storyParameters.genreDetails && ` (${storyParameters.genreDetails})`}
              </p>
            )}
            
            {storyParameters.setting && (
              <p className="text-white"><span className="font-medium">Setting:</span> {storyParameters.setting}
                {storyParameters.settingDetails && ` (${storyParameters.settingDetails})`}
              </p>
            )}
            
            {storyParameters.timeframe && (
              <p className="text-white"><span className="font-medium">Time Period:</span> {storyParameters.timeframe}</p>
            )}
            
            {storyParameters.protagonist && (
              <p className="text-white"><span className="font-medium">Protagonist:</span> {storyParameters.protagonist}
                {storyParameters.protagonistDetails && ` (${storyParameters.protagonistDetails})`}
              </p>
            )}
            
            {storyParameters.antagonist && (
              <p className="text-white"><span className="font-medium">Antagonist:</span> {storyParameters.antagonist}
                {storyParameters.antagonistDetails && ` (${storyParameters.antagonistDetails})`}
              </p>
            )}
            
            {storyParameters.conflict && (
              <p className="text-white"><span className="font-medium">Conflict:</span> {storyParameters.conflict}</p>
            )}
            
            {storyParameters.tone && (
              <p className="text-white"><span className="font-medium">Tone:</span> {storyParameters.tone}</p>
            )}
            
            {storyParameters.theme && (
              <p className="text-white"><span className="font-medium">Theme:</span> {storyParameters.theme}</p>
            )}
            
            {storyParameters.visualStyle && (
              <p className="text-white"><span className="font-medium">Visual Style:</span> {storyParameters.visualStyle}
                {storyParameters.visualStyleDetails && ` (${storyParameters.visualStyleDetails})`}
              </p>
            )}
            
            {storyParameters.colorPalette && (
              <p className="text-white"><span className="font-medium">Color Palette:</span> {storyParameters.colorPalette}</p>
            )}
          </div>
        </EnhancedGlassMorphicContainerV2>
        
        <EnhancedGlassMorphicContainerV2 className="p-4 mb-4" padding="small">
          <h3 className="font-semibold text-md mb-3 text-white">Story Structure</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="chapters" className="block text-sm font-medium mb-1 text-white">
                Number of Chapters
              </label>
              <input
                id="chapters"
                type="number"
                min="3"
                max="5"
                value={chapterCount}
                onChange={handleChapterCountChange}
                className="w-full p-2 bg-custom-gray-30 border border-white/30 rounded-md text-sm text-white"
              />
            </div>
            
            <div>
              <label htmlFor="scenes" className="block text-sm font-medium mb-1 text-white">
                Scenes per Chapter
              </label>
              <input
                id="scenes"
                type="number"
                min="2"
                max="4"
                value={scenesPerChapter}
                onChange={handleScenesPerChapterChange}
                className="w-full p-2 bg-custom-gray-30 border border-white/30 rounded-md text-sm text-white"
              />
            </div>
          </div>
        </EnhancedGlassMorphicContainerV2>
        
        <EnhancedGlassMorphicContainerV2 className="p-4 mb-4" padding="small">
          <h3 className="font-semibold text-md mb-2 text-white">Final Prompt</h3>
          <p className="text-sm text-white/90 whitespace-pre-wrap">{finalPrompt}</p>
        </EnhancedGlassMorphicContainerV2>
      </div>
      
      {/* The Next/Back buttons are handled by the StepContainer */}
      {isGenerating && (
        <div className="my-4 text-center">
          <div className="w-full h-2 bg-white/10 rounded-full mb-2">
            <div 
              className="h-2 bg-blue-600 rounded-full animate-pulse" 
              style={{ width: '60%' }}
            ></div>
          </div>
          <p className="text-white/80 text-sm">Generating your movie plan...</p>
        </div>
      )}
    </StepContainer>
  );
};

export default CrossBrowserReviewGenerate;