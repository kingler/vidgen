'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import OptionPill from '@/components/ui/OptionPill';
import DetailInput from '@/components/ui/DetailInput';
import PromptPreview from '@/components/ui/PromptPreview';
import ProgressSteps from '@/components/ui/ProgressSteps';

const genreOptions = [
  'Sci-Fi', 'Fantasy', 'Drama', 'Horror', 'Rom-Com', 
  'Superhero', 'Mystery', 'Noir', 'Western', 'Anime'
];

export const GenreSelection: React.FC = () => {
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
  
  const handleNext = () => {
    if (selectedGenre) {
      router.push('/onboarding/step/2');
    }
  };
  
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md p-8">
      <ProgressSteps currentStep={1} totalSteps={7} />
      
      <h2 className="text-xl font-bold mb-6">Let&apos;s start with a genre.</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {genreOptions.map(genre => (
          <OptionPill
            key={genre}
            label={genre}
            selected={selectedGenre === genre}
            onClick={() => handleGenreSelect(genre)}
          />
        ))}
      </div>
      
      <DetailInput
        label="Add your own twist"
        placeholder="e.g., 1960s retro-futuristic sci-fi noir"
        value={genreDetails}
        onChange={handleDetailsChange}
        hint="Give us more flavor—optional but fun."
      />
      
      <PromptPreview />
      
      <div className="flex justify-between mt-8">
        <button 
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          onClick={() => router.push('/')}
        >
          Back
        </button>
        
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={!selectedGenre}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GenreSelection;