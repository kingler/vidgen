export interface StoryParameters {
  // Basic story elements
  genre: string;
  genreDetails?: string;
  setting: string;
  settingDetails?: string;
  timeframe?: string;
  protagonist: string;
  protagonistDetails?: string;
  antagonist: string;
  antagonistDetails?: string;
  conflict?: string;
  
  // Stylistic elements
  tone: string; // e.g., "dark", "upbeat", "whimsical"
  theme?: string;
  visualStyle: string; // e.g., "realistic", "animated", "noir"
  visualStyleDetails?: string;
  colorPalette?: string;
  
  // Structure configuration
  storyStructure: {
    chapterCount: number; // 3-5
    scenesPerChapter: number; // 2-4
    pacing?: string; // e.g., "fast", "medium", "slow"
  };
  
  // Model preference
  preferredModel?: 'openai' | 'flux' | 'both';
}

export interface SceneData {
  id: string;
  prompt: string;
  imageUrl?: string;
  position: {
    x: number;
    y: number;
  };
  chapter: number;
  scene: number;
  referenceImages?: string[];
}