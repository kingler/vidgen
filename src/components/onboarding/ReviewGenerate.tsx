'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import ProgressSteps from '@/components/ui/ProgressSteps';
import { buildPromptFromParameters } from '@/lib/promptBuilder';

export const ReviewGenerate: React.FC = () => {
  const router = useRouter();
  const { storyParameters, updateNestedParameter } = useOnboarding();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [chapterCount, setChapterCount] = useState(storyParameters.storyStructure.chapterCount);
  const [scenesPerChapter, setScenesPerChapter] = useState(storyParameters.storyStructure.scenesPerChapter);
  
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
  
  const handleBack = () => {
    router.push('/onboarding/step/6');
  };
  
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // In a real implementation, this would call an API to generate the story
    // For now, simulate a generation process with a timeout
    setTimeout(() => {
      // Navigate to the editor after "generation" is complete
      router.push('/editor');
    }, 2000);
  };
  
  const finalPrompt = buildPromptFromParameters(storyParameters);
  
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md p-8">
      <ProgressSteps currentStep={7} totalSteps={7} />
      
      <h2 className="text-xl font-bold mb-6">Review your story parameters</h2>
      
      <div className="mb-6 space-y-4">
        <div className="bg-slate-50 p-4 rounded-md">
          <h3 className="font-semibold text-md mb-2">Story Details</h3>
          <div className="space-y-1 text-sm">
            {storyParameters.genre && (
              <p><span className="font-medium">Genre:</span> {storyParameters.genre} 
                {storyParameters.genreDetails && ` (${storyParameters.genreDetails})`}
              </p>
            )}
            
            {storyParameters.setting && (
              <p><span className="font-medium">Setting:</span> {storyParameters.setting}
                {storyParameters.settingDetails && ` (${storyParameters.settingDetails})`}
              </p>
            )}
            
            {storyParameters.timeframe && (
              <p><span className="font-medium">Time Period:</span> {storyParameters.timeframe}</p>
            )}
            
            {storyParameters.protagonist && (
              <p><span className="font-medium">Protagonist:</span> {storyParameters.protagonist}
                {storyParameters.protagonistDetails && ` (${storyParameters.protagonistDetails})`}
              </p>
            )}
            
            {storyParameters.antagonist && (
              <p><span className="font-medium">Antagonist:</span> {storyParameters.antagonist}
                {storyParameters.antagonistDetails && ` (${storyParameters.antagonistDetails})`}
              </p>
            )}
            
            {storyParameters.conflict && (
              <p><span className="font-medium">Conflict:</span> {storyParameters.conflict}</p>
            )}
            
            {storyParameters.tone && (
              <p><span className="font-medium">Tone:</span> {storyParameters.tone}</p>
            )}
            
            {storyParameters.theme && (
              <p><span className="font-medium">Theme:</span> {storyParameters.theme}</p>
            )}
            
            {storyParameters.visualStyle && (
              <p><span className="font-medium">Visual Style:</span> {storyParameters.visualStyle}
                {storyParameters.visualStyleDetails && ` (${storyParameters.visualStyleDetails})`}
              </p>
            )}
            
            {storyParameters.colorPalette && (
              <p><span className="font-medium">Color Palette:</span> {storyParameters.colorPalette}</p>
            )}
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-md">
          <h3 className="font-semibold text-md mb-3">Story Structure</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="chapters" className="block text-sm font-medium mb-1">
                Number of Chapters
              </label>
              <input
                id="chapters"
                type="number"
                min="3"
                max="5"
                value={chapterCount}
                onChange={handleChapterCountChange}
                className="w-full p-2 border border-slate-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="scenes" className="block text-sm font-medium mb-1">
                Scenes per Chapter
              </label>
              <input
                id="scenes"
                type="number"
                min="2"
                max="4"
                value={scenesPerChapter}
                onChange={handleScenesPerChapterChange}
                className="w-full p-2 border border-slate-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-md">
          <h3 className="font-semibold text-md mb-2">Final Prompt</h3>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{finalPrompt}</p>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button 
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          onClick={handleBack}
          disabled={isGenerating}
        >
          Back
        </button>
        
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate My Story'}
        </button>
      </div>
    </div>
  );
};

export default ReviewGenerate;