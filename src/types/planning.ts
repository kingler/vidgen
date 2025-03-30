// Types for movie planning and generation

export interface OutlineItem {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
}

export interface SceneData {
  id: string;
  outlineItemId: string;
  title: string;
  description: string;
  visualPrompt: string;
  characters: string[];
  settings: string;
  visualStyle: string;
  cameraAngles: string[];
  lighting: string;
  imageUrl?: string; // Will be populated later when image is generated
}