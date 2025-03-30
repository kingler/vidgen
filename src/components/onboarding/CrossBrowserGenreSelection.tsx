'use client';

import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import CrossBrowserOptionPill from '@/components/ui/CrossBrowserOptionPill';
import EnhancedDetailInput from '@/components/ui/EnhancedDetailInput';
import CrossBrowserTablePromptPreview from '@/components/ui/CrossBrowserTablePromptPreview';
import StepContainer from '@/components/ui/StepContainer';

const genreOptions = [
  'Sci-Fi', 'Fantasy', 'Drama', 'Horror', 'Rom-Com', 
  'Superhero', 'Mystery', 'Noir', 'Western', 'Anime'
];

// Sample hints for the genre details
const genreHints = {
  'Sci-Fi': 'distant future with advanced AI and space colonization',
  'Fantasy': 'medieval realm with dragons and ancient magic',
  'Drama': 'intimate character study in a small coastal town',
  'Horror': 'isolated cabin with supernatural phenomena',
  'Rom-Com': 'chance meeting in a charming European city',
  'Superhero': 'ordinary person discovers extraordinary abilities',
  'Mystery': 'unsolved disappearance in a foggy small town',
  'Noir': 'rain-soaked city streets with hidden corruption',
  'Western': 'dusty frontier town with lawless territories beyond',
  'Anime': 'vibrant world with fantastical creatures and powerful abilities'
};

/**
 * Cross-browser compatible genre selection component
 * Ensures consistent styling and usability across all browsers
 */
export const CrossBrowserGenreSelection: React.FC = () => {
  const { storyParameters, updateParameter } = useOnboarding();
  const [selectedGenre, setSelectedGenre] = useState(storyParameters.genre || '');
  const [genreDetails, setGenreDetails] = useState(storyParameters.genreDetails || '');
  
  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    updateParameter('genre', genre);
  };
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGenreDetails(e.target.value);
    updateParameter('genreDetails', e.target.value);
  };
  
  // Get the current hint based on selected genre
  const getCurrentHint = () => {
    if (selectedGenre && genreHints[selectedGenre as keyof typeof genreHints]) {
      return genreHints[selectedGenre as keyof typeof genreHints];
    }
    return '';
  };
  
  return (
    <StepContainer
      title="Let's start with a genre."
      currentStep={1}
      totalSteps={7}
      nextDisabled={!selectedGenre}
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {genreOptions.map(genre => (
          <CrossBrowserOptionPill
            key={genre}
            label={genre}
            selected={selectedGenre === genre}
            onClick={() => handleGenreSelect(genre)}
          />
        ))}
      </div>
      
      <EnhancedDetailInput
        label="Add your own twist"
        placeholder="e.g., 1960s retro-futuristic sci-fi noir"
        value={genreDetails}
        onChange={handleDetailsChange}
        hint={getCurrentHint()}
      />
      
      <CrossBrowserTablePromptPreview />
    </StepContainer>
  );
};

export default CrossBrowserGenreSelection;