'use client';

import React, { createContext, useState, useContext } from 'react';
import { StoryParameters } from '@/lib/types';

interface OnboardingContextType {
  storyParameters: StoryParameters;
  updateParameter: <T extends keyof StoryParameters>(key: T, value: StoryParameters[T]) => void;
  updateNestedParameter: (
    parent: keyof StoryParameters,
    key: string,
    value: unknown
  ) => void;
  resetParameters: () => void;
  getCurrentStep: () => number;
}

const defaultStoryParameters: StoryParameters = {
  genre: '',
  setting: '',
  protagonist: '',
  antagonist: '',
  tone: '',
  visualStyle: '',
  storyStructure: {
    chapterCount: 3,
    scenesPerChapter: 3,
    pacing: 'medium'
  },
  preferredModel: 'both'
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storyParameters, setStoryParameters] = useState<StoryParameters>(defaultStoryParameters);

  const updateParameter = <T extends keyof StoryParameters>(key: T, value: StoryParameters[T]) => {
    setStoryParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNestedParameter = (
    parent: keyof StoryParameters,
    key: string,
    value: unknown
  ) => {
    setStoryParameters(prev => {
      // Handle nested objects safely with type checking
      const parentValue = prev[parent];
      
      // Only proceed if the parent value is an object
      if (parentValue && typeof parentValue === 'object' && !Array.isArray(parentValue)) {
        return {
          ...prev,
          [parent]: {
            ...parentValue,
            [key]: value
          }
        };
      }
      
      // If parent is not an object, return unchanged state
      return prev;
    });
  };

  const resetParameters = () => {
    setStoryParameters(defaultStoryParameters);
  };

  const getCurrentStep = () => {
    // Determine current step based on filled parameters
    if (!storyParameters.genre) return 1;
    if (!storyParameters.setting) return 2;
    if (!storyParameters.protagonist) return 3;
    if (!storyParameters.antagonist) return 4;
    if (!storyParameters.tone || !storyParameters.theme) return 5;
    if (!storyParameters.visualStyle) return 6;
    return 7;
  };

  return (
    <OnboardingContext.Provider
      value={{
        storyParameters,
        updateParameter,
        updateNestedParameter,
        resetParameters,
        getCurrentStep
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};