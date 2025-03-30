'use client';

import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import GlassMorphicContainer from './GlassMorphicContainer';

export const TablePromptPreview: React.FC = () => {
  const { storyParameters } = useOnboarding();

  // Build table rows for the preview
  const buildPreviewRows = () => {
    const rows = [];
    
    if (storyParameters.genre) {
      let genreValue = storyParameters.genre;
      if (storyParameters.genreDetails) {
        genreValue += ` (${storyParameters.genreDetails})`;
      }
      rows.push({ label: 'Genre', value: genreValue });
    }
    
    if (storyParameters.setting) {
      let settingValue = storyParameters.setting;
      if (storyParameters.settingDetails) {
        settingValue += ` (${storyParameters.settingDetails})`;
      }
      rows.push({ label: 'Setting', value: settingValue });
    }
    
    if (storyParameters.timeframe) {
      rows.push({ label: 'Time Period', value: storyParameters.timeframe });
    }
    
    if (storyParameters.protagonist) {
      let protagonistValue = storyParameters.protagonist;
      if (storyParameters.protagonistDetails) {
        protagonistValue += ` (${storyParameters.protagonistDetails})`;
      }
      rows.push({ label: 'Protagonist', value: protagonistValue });
    }
    
    if (storyParameters.antagonist) {
      let antagonistValue = storyParameters.antagonist;
      if (storyParameters.antagonistDetails) {
        antagonistValue += ` (${storyParameters.antagonistDetails})`;
      }
      rows.push({ label: 'Antagonist', value: antagonistValue });
    }
    
    if (storyParameters.conflict) {
      rows.push({ label: 'Conflict', value: storyParameters.conflict });
    }
    
    if (storyParameters.tone) {
      rows.push({ label: 'Tone', value: storyParameters.tone });
    }
    
    if (storyParameters.theme) {
      rows.push({ label: 'Theme', value: storyParameters.theme });
    }
    
    if (storyParameters.visualStyle) {
      let styleValue = storyParameters.visualStyle;
      if (storyParameters.visualStyleDetails) {
        styleValue += ` (${storyParameters.visualStyleDetails})`;
      }
      rows.push({ label: 'Visual Style', value: styleValue });
    }
    
    if (storyParameters.colorPalette) {
      rows.push({ label: 'Color Palette', value: storyParameters.colorPalette });
    }
    
    return rows.length > 0 ? rows : [{ label: 'Start', value: 'Build your story by selecting options above!' }];
  };

  const previewRows = buildPreviewRows();

  return (
    <GlassMorphicContainer className="p-4 mb-6">
      <h3 className="text-sm font-semibold text-white mb-3">Prompt Preview:</h3>
      
      <div className="overflow-hidden">
        <table className="w-full text-sm border-spacing-0">
          <tbody>
            {previewRows.map((row, index) => (
              <tr 
                key={index} 
                className={`${index < previewRows.length - 1 ? 'border-b border-white/10' : ''}`}
              >
                <td className="py-2 pr-4 text-white/80 font-medium w-1/3">{row.label}:</td>
                <td className="py-2 text-white">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassMorphicContainer>
  );
};

export default TablePromptPreview;