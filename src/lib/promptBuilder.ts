import { StoryParameters } from './types';

/**
 * Builds a comprehensive prompt string from story parameters
 */
export function buildPromptFromParameters(params: StoryParameters): string {
  let prompt = `Create a ${params.tone || 'compelling'} ${params.genre || 'story'}`;
  
  if (params.genreDetails) {
    prompt += ` with ${params.genreDetails}`;
  }
  
  if (params.setting) {
    prompt += ` set in ${params.setting}`;
    
    if (params.settingDetails) {
      prompt += ` characterized by ${params.settingDetails}`;
    }
  }
  
  if (params.timeframe) {
    prompt += ` during ${params.timeframe}`;
  }
  
  if (params.protagonist) {
    prompt += `. The protagonist is ${params.protagonist}`;
    
    if (params.protagonistDetails) {
      prompt += ` who ${params.protagonistDetails}`;
    }
  }
  
  if (params.antagonist) {
    prompt += `. The antagonist is ${params.antagonist}`;
    
    if (params.antagonistDetails) {
      prompt += ` who ${params.antagonistDetails}`;
    }
  }
  
  if (params.conflict) {
    prompt += `. The central conflict involves ${params.conflict}`;
  }
  
  if (params.theme) {
    prompt += `. The theme explores ${params.theme}`;
  }
  
  if (params.visualStyle) {
    prompt += `. Visualize this in a ${params.visualStyle} style`;
    
    if (params.visualStyleDetails) {
      prompt += ` with ${params.visualStyleDetails}`;
    }
  }
  
  if (params.colorPalette) {
    prompt += `. Use a color palette that is ${params.colorPalette}`;
  }
  
  // Ensure the prompt ends with a period
  if (!prompt.endsWith('.')) {
    prompt += '.';
  }
  
  return prompt;
}

/**
 * Generates chapter-specific prompts based on story parameters
 */
export function generateChapterPrompts(basePrompt: string, params: StoryParameters): string[] {
  const chapterCount = params.storyStructure.chapterCount;
  const chapters: string[] = [];
  
  // Generate chapter-specific prompts
  for (let i = 0; i < chapterCount; i++) {
    let chapterPrompt = basePrompt;
    
    if (i === 0) {
      chapterPrompt += ` This is the beginning of the story, establishing the setting and introducing the protagonist.`;
    } else if (i === chapterCount - 1) {
      chapterPrompt += ` This is the conclusion of the story, resolving the central conflict.`;
    } else {
      chapterPrompt += ` This is chapter ${i + 1} where the conflict develops and escalates.`;
    }
    
    chapters.push(chapterPrompt);
  }
  
  return chapters;
}

/**
 * Generates scene-specific prompts for a given chapter
 */
export function generateScenePrompts(
  chapterPrompt: string, 
  scenesPerChapter: number, 
  chapterIndex: number
): string[] {
  const scenes: string[] = [];
  
  for (let i = 0; i < scenesPerChapter; i++) {
    let scenePrompt = chapterPrompt;
    
    if (chapterIndex === 0) {
      // First chapter scenes
      if (i === 0) {
        scenePrompt += ` This is the opening scene that establishes the world and introduces the protagonist.`;
      } else if (i === scenesPerChapter - 1) {
        scenePrompt += ` This scene ends the first chapter with the protagonist encountering the first challenge.`;
      } else {
        scenePrompt += ` This scene develops the protagonist's character and hints at the coming conflict.`;
      }
    } else if (chapterIndex === 2) { // Assuming 3 chapters for now, would be more dynamic in a real implementation
      // Final chapter scenes
      if (i === 0) {
        scenePrompt += ` This scene shows the protagonist preparing for the final confrontation.`;
      } else if (i === scenesPerChapter - 1) {
        scenePrompt += ` This is the final scene that resolves the story and shows the aftermath.`;
      } else {
        scenePrompt += ` This scene contains the climactic confrontation between protagonist and antagonist.`;
      }
    } else {
      // Middle chapter scenes
      if (i === 0) {
        scenePrompt += ` This scene shows the protagonist dealing with growing challenges.`;
      } else if (i === scenesPerChapter - 1) {
        scenePrompt += ` This scene escalates the conflict significantly.`;
      } else {
        scenePrompt += ` This scene reveals more about the antagonist and raises the stakes.`;
      }
    }
    
    scenes.push(scenePrompt);
  }
  
  return scenes;
}