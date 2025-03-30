'use client';

import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

export const PromptPreview: React.FC = () => {
  const { storyParameters } = useOnboarding();

  // Build a readable version of the prompt for preview
  const buildPreviewText = () => {
    const lines: string[] = [];
    
    if (storyParameters.genre) {
      let genreLine = `Genre: ${storyParameters.genre}`;
      if (storyParameters.genreDetails) {
        genreLine += ` (${storyParameters.genreDetails})`;
      }
      lines.push(genreLine);
    }
    
    if (storyParameters.setting) {
      let settingLine = `Setting: ${storyParameters.setting}`;
      if (storyParameters.settingDetails) {
        settingLine += ` (${storyParameters.settingDetails})`;
      }
      lines.push(settingLine);
    }
    
    if (storyParameters.protagonist) {
      let protagonistLine = `Protagonist: ${storyParameters.protagonist}`;
      if (storyParameters.protagonistDetails) {
        protagonistLine += ` (${storyParameters.protagonistDetails})`;
      }
      lines.push(protagonistLine);
    }
    
    if (storyParameters.antagonist) {
      let antagonistLine = `Antagonist: ${storyParameters.antagonist}`;
      if (storyParameters.antagonistDetails) {
        antagonistLine += ` (${storyParameters.antagonistDetails})`;
      }
      lines.push(antagonistLine);
    }
    
    if (storyParameters.tone) {
      lines.push(`Tone: ${storyParameters.tone}`);
    }
    
    if (storyParameters.theme) {
      lines.push(`Theme: ${storyParameters.theme}`);
    }
    
    if (storyParameters.visualStyle) {
      let styleLine = `Visual Style: ${storyParameters.visualStyle}`;
      if (storyParameters.visualStyleDetails) {
        styleLine += ` (${storyParameters.visualStyleDetails})`;
      }
      lines.push(styleLine);
    }
    
    return lines.length > 0 ? lines : ['Start building your story by selecting options above!'];
  };

  const previewLines = buildPreviewText();

  return (
    <div className="bg-slate-100 border border-slate-300 rounded-md p-4 mb-6">
      <h3 className="text-sm font-semibold mb-2">Prompt Preview:</h3>
      <div className="text-sm text-slate-700 space-y-1">
        {previewLines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
};

export default PromptPreview;