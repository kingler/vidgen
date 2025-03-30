'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import EnhancedOptionPill from '@/components/ui/EnhancedOptionPill';
import EnhancedDetailInput from '@/components/ui/EnhancedDetailInput';
import TablePromptPreview from '@/components/ui/TablePromptPreview';
import EnhancedProgressSteps from '@/components/ui/EnhancedProgressSteps';
import GlassMorphicContainer from '@/components/ui/GlassMorphicContainer';

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

export const EnhancedGenreSelection: React.FC = () => {
  const router = useRouter();
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
  
  
  const handleNext = () => {
    if (selectedGenre) {
      router.push('/onboarding/step/2');
    }
  };
  
  return (
    <GlassMorphicContainer className="max-w-md w-full mx-auto p-8">
      <EnhancedProgressSteps currentStep={1} totalSteps={7} />
      
      <h2 className="text-xl font-bold text-white mb-6">Let&apos;s start with a genre.</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {genreOptions.map(genre => (
          <EnhancedOptionPill
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
      
      <TablePromptPreview />
      
      <div className="flex justify-between mt-8">
        <button 
          className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/30"
          onClick={() => router.push('/')}
        >
          Back
        </button>
        
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={!selectedGenre}
        >
          Next
        </button>
      </div>
    </GlassMorphicContainer>
  );
};

export default EnhancedGenreSelection;