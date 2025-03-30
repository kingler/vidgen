'use client';

import React, { useState, useEffect } from 'react';
import EnhancedGlassMorphicContainerV2 from '@/components/ui/EnhancedGlassMorphicContainerV2';
import { componentStyles } from '@/lib/designSystem';

interface PromptEnhancementScreenProps {
  initialPrompt: string;
  onEnhancementComplete: (enhancedPrompt: string, moviePlan: MoviePlan) => void;
}

// Types for the movie planning structure
interface Scene {
  id: string;
  title: string;
  description: string;
  visualStyle: string;
  characters: string[];
  setting: string;
  cameraAngles: string[];
  lighting: string;
  specialEffects: string[];
  generatedPrompt: string;
}

interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
  appearance: string;
  development: string[];
}

interface MoviePlan {
  title: string;
  synopsis: string;
  theme: string;
  visualStyle: string;
  characters: Character[];
  scenes: Scene[];
}

/**
 * Prompt Enhancement Screen
 * 
 * This component takes the user's initial prompt from the onboarding process
 * and enhances it using AI to create a detailed movie plan with scenes,
 * characters, and visual style specifications.
 */
export const PromptEnhancementScreen: React.FC<PromptEnhancementScreenProps> = ({
  initialPrompt,
  onEnhancementComplete
}) => {
  const [currentStep, setCurrentStep] = useState<'enhancing' | 'planning' | 'detailing' | 'complete'>('enhancing');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [moviePlan, setMoviePlan] = useState<MoviePlan | null>(null);
  const [progress, setProgress] = useState(0);

  // Simulate the AI enhancement process
  useEffect(() => {
    const enhancePrompt = async () => {
      
      // Step 1: Enhance the prompt
      await simulateAIProcessing(2000);
      setEnhancedPrompt(`An expanded version of "${initialPrompt}" with detailed narrative elements and visual descriptions.`);
      setProgress(25);
      setCurrentStep('planning');
      
      // Step 2: Create the movie plan outline
      await simulateAIProcessing(3000);
      setProgress(50);
      setCurrentStep('detailing');
      
      // Step 3: Develop detailed scene descriptions and character profiles
      await simulateAIProcessing(4000);
      
      // Create a sample movie plan (in a real implementation, this would come from the AI)
      const plan: MoviePlan = {
        title: "The Generated Title",
        synopsis: "A compelling story based on the user's prompt...",
        theme: "Exploration of identity and belonging",
        visualStyle: "High contrast cinematography with vibrant color palette",
        characters: [
          {
            id: "char1",
            name: "Protagonist",
            description: "A complex character with a mysterious past",
            role: "Main character",
            appearance: "Distinctive clothing style with signature accessories",
            development: ["Introduction", "Challenge", "Growth", "Resolution"]
          },
          {
            id: "char2",
            name: "Antagonist",
            description: "Formidable opponent with justified motivations",
            role: "Main villain",
            appearance: "Dark, imposing presence with subtle visual cues",
            development: ["Reveal", "Conflict", "Climax"]
          }
        ],
        scenes: [
          {
            id: "scene1",
            title: "Opening Scene",
            description: "An atmospheric introduction to the world and protagonist",
            visualStyle: "Muted colors transitioning to vibrant palette",
            characters: ["char1"],
            setting: "Establishing location with significant visual metaphors",
            cameraAngles: ["Wide establishing shot", "Character close-up"],
            lighting: "Natural light with dramatic shadows",
            specialEffects: ["Subtle environment animation"],
            generatedPrompt: "Atmospheric opening scene featuring the protagonist in a significant location with muted colors, natural lighting, and dramatic shadows."
          },
          {
            id: "scene2",
            title: "Confrontation",
            description: "First major conflict between protagonist and antagonist",
            visualStyle: "High contrast with dramatic lighting",
            characters: ["char1", "char2"],
            setting: "Visually striking location that enhances the conflict's themes",
            cameraAngles: ["Over-the-shoulder shots", "Low angle for antagonist"],
            lighting: "Dramatic side-lighting with colored accents",
            specialEffects: ["Tension-building visual elements"],
            generatedPrompt: "Dramatic confrontation scene with the protagonist and antagonist in a striking location, featuring high contrast lighting, dramatic shadows, and tension-building visual elements."
          }
        ]
      };
      
      setMoviePlan(plan);
      setProgress(100);
      setCurrentStep('complete');
    };
    
    enhancePrompt();
  }, [initialPrompt]);
  
  // Helper function to simulate AI processing time
  const simulateAIProcessing = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  // Render different content based on current step
  const renderContent = () => {
    switch (currentStep) {
      case 'enhancing':
        return (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Enhancing Your Prompt</h3>
            <p className="text-white/80 mb-6">Our AI is analyzing your story elements and creating a detailed narrative framework...</p>
            <div className="w-full h-2 bg-white/10 rounded-full mb-2">
              <div 
                className="h-2 bg-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        );
        
      case 'planning':
        return (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Developing Movie Structure</h3>
            <p className="text-white/80 mb-6">Creating scene outlines, character arcs, and visual style guidelines...</p>
            <div className="w-full h-2 bg-white/10 rounded-full mb-2">
              <div 
                className="h-2 bg-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <EnhancedGlassMorphicContainerV2 className="mt-4 text-left" padding="small">
              <h4 className="text-md font-medium text-white mb-2">Enhanced Prompt:</h4>
              <p className="text-white/90">{enhancedPrompt}</p>
            </EnhancedGlassMorphicContainerV2>
          </div>
        );
        
      case 'detailing':
        return (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Detailing Scenes & Characters</h3>
            <p className="text-white/80 mb-6">Generating specific visual descriptions, character details, and scene prompts...</p>
            <div className="w-full h-2 bg-white/10 rounded-full mb-2">
              <div 
                className="h-2 bg-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <EnhancedGlassMorphicContainerV2 className="mt-4 text-left" padding="small">
              <h4 className="text-md font-medium text-white mb-2">Enhanced Prompt:</h4>
              <p className="text-white/90">{enhancedPrompt}</p>
            </EnhancedGlassMorphicContainerV2>
          </div>
        );
        
      case 'complete':
        return moviePlan ? (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Your Movie Plan is Ready</h3>
            
            {/* Movie Overview */}
            <EnhancedGlassMorphicContainerV2 className="mb-4" padding="small">
              <h4 className="text-md font-medium text-white mb-2">&ldquo;{moviePlan.title}&rdquo;</h4>
              <p className="text-white/90 mb-2">{moviePlan.synopsis}</p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div>
                  <p className="text-white/70 text-sm">Theme</p>
                  <p className="text-white">{moviePlan.theme}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Visual Style</p>
                  <p className="text-white">{moviePlan.visualStyle}</p>
                </div>
              </div>
            </EnhancedGlassMorphicContainerV2>
            
            {/* Characters */}
            <h4 className="text-md font-medium text-white mb-2">Characters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {moviePlan.characters.map(character => (
                <EnhancedGlassMorphicContainerV2 key={character.id} padding="small">
                  <h5 className="text-white font-medium">{character.name}</h5>
                  <p className="text-white/90 text-sm">{character.description}</p>
                  <p className="text-white/70 text-xs mt-2">{character.appearance}</p>
                </EnhancedGlassMorphicContainerV2>
              ))}
            </div>
            
            {/* Scenes */}
            <h4 className="text-md font-medium text-white mb-2">Key Scenes</h4>
            <div className="space-y-3">
              {moviePlan.scenes.map(scene => (
                <EnhancedGlassMorphicContainerV2 key={scene.id} padding="small">
                  <h5 className="text-white font-medium">{scene.title}</h5>
                  <p className="text-white/90 text-sm mb-2">{scene.description}</p>
                  <div className="text-white/70 text-xs space-y-1">
                    <p><span className="font-medium">Visual Style:</span> {scene.visualStyle}</p>
                    <p><span className="font-medium">Setting:</span> {scene.setting}</p>
                    <p><span className="font-medium">Lighting:</span> {scene.lighting}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-white/90 text-sm font-medium">Generation Prompt:</p>
                    <p className="text-white/80 text-sm italic">{scene.generatedPrompt}</p>
                  </div>
                </EnhancedGlassMorphicContainerV2>
              ))}
            </div>
            
            {/* Continue to Editor Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => onEnhancementComplete(enhancedPrompt, moviePlan)}
                className={`${componentStyles.button.base} ${componentStyles.button.primary} px-8 py-3`}
              >
                Continue to Movie Editor
              </button>
              <p className="text-white/60 text-sm mt-2">You&apos;ll be able to generate images for each scene in the editor</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-white">Loading your movie plan...</div>
        );
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <EnhancedGlassMorphicContainerV2 className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">AI Movie Planning</h2>
        {renderContent()}
      </EnhancedGlassMorphicContainerV2>
    </div>
  );
};

export default PromptEnhancementScreen;