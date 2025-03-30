'use client';

import React, { useState, useEffect } from 'react';
import ModernEditorCanvas from '@/components/editor/ModernEditorCanvas';
import type { SceneData } from '@/types/planning';
import { useRouter } from 'next/navigation';

/**
 * Editor page with modern interface
 * 
 * Features:
 * - Grid-based canvas background
 * - Horizontally scrollable timeline
 * - Zoomed-in scene editing
 * - Image to video generation
 */
export default function EditorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [scenes, setScenes] = useState<SceneData[]>([]);
  
  // In a real implementation, we would fetch scene data from context or API
  useEffect(() => {
    // Simulate loading from API or context
    setTimeout(() => {
      // Generate 9 sample scenes (3 chapters with 3 scenes each)
      const sampleScenes: SceneData[] = Array.from({ length: 9 }, (_, i) => {
        const chapter = Math.floor(i / 3) + 1;
        const sceneInChapter = (i % 3) + 1;
        
        return {
          id: `scene_${i + 1}`,
          outlineItemId: `outline_${i + 1}`,
          title: `Chapter ${chapter}, Scene ${sceneInChapter}`,
          description: `This is a sample scene description for Chapter ${chapter}, Scene ${sceneInChapter}.`,
          visualPrompt: `A cinematic scene showing ${
            chapter === 1 
              ? "the protagonist's introduction in a dystopian future cityscape with neon lights and rain" 
              : chapter === 2 
              ? "a tense confrontation with advanced technology in the background" 
              : "the climactic resolution with dramatic lighting and emotional expressions"
          }. Scene ${sceneInChapter} of Chapter ${chapter}.`,
          characters: ['char1', 'char2'],
          settings: `Dystopian cityscape, ${
            chapter === 1 
              ? "crowded streets with neon advertisements" 
              : chapter === 2 
              ? "abandoned laboratory with advanced technology" 
              : "rooftop overlooking the transformed city"
          }`,
          visualStyle: "Cinematic, high contrast with blue and orange color scheme",
          cameraAngles: ["Wide establishing shot", "Close-up"],
          lighting: "Dramatic side lighting with atmospheric haze"
        };
      });
      
      setScenes(sampleScenes);
      setLoading(false);
    }, 1500);
  }, []);
  
  // Loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="bg-white p-8 rounded-md shadow-lg">
          <div className="text-gray-800 text-xl font-medium mb-4">Loading Editor...</div>
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse rounded-full" style={{ width: '60%' }}></div>
          </div>
          <div className="mt-2 text-gray-500 text-sm">Preparing your scenes...</div>
        </div>
      </div>
    );
  }
  
  // Main editor with modern canvas
  return (
    <div className="min-h-screen">
      {/* Modern editor header - slim and out of the way */}
      <div className="fixed top-0 left-0 right-0 z-50 h-12 bg-white shadow-sm flex items-center justify-between px-4">
        <div className="flex items-center">
          <h1 className="text-gray-800 font-medium text-lg">AI MovieMaker</h1>
          <div className="text-gray-400 text-sm ml-2">|</div>
          <div className="text-gray-500 text-sm ml-2">Editor</div>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => router.push('/planning')}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded"
          >
            Back to Planning
          </button>
          <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded">
            Export Movie
          </button>
        </div>
      </div>
      
      {/* Main canvas with proper spacing for header */}
      <div className="pt-12 h-screen">
        <ModernEditorCanvas scenes={scenes} />
      </div>
    </div>
  );
}