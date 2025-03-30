import React, { useState, useCallback } from 'react';
import InfiniteCanvas from '@/components/canvas/InfiniteCanvas';
import Scene from '@/components/canvas/Scene';
import Timeline, { TimelineItem } from '@/components/canvas/Timeline';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';

// Mock data interfaces
interface SceneData {
  id: string;
  imageUrl?: string;
  prompt?: string;
  referenceImages?: string[];
  position: { x: number; y: number };
}

/**
 * MovieEditor - The main container for the movie editor application
 * Integrates InfiniteCanvas, Scene components, Timeline, and VideoPlayer
 */
export default function MovieEditor() {
  // State for scenes
  const [scenes, setScenes] = useState<SceneData[]>([
    {
      id: '1',
      prompt: 'A futuristic city skyline at sunset with flying cars',
      position: { x: 100, y: 100 }
    },
    {
      id: '2',
      prompt: 'A character looking at the city from a rooftop',
      position: { x: 600, y: 100 }
    },
    {
      id: '3',
      prompt: 'A close-up of the character\'s face showing determination',
      position: { x: 350, y: 400 }
    }
  ]);
  
  // State for selected scene
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id || '');
  
  // State for video preview
  const [previewUrl] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  // Handler for scene editing
  const handleEditScene = useCallback((id: string, prompt: string) => {
    setScenes(prev => 
      prev.map(scene => 
        scene.id === id ? { ...scene, prompt } : scene
      )
    );
  }, []);
  
  // Handler for scene regeneration
  const handleRegenerateScene = useCallback((id: string) => {
    console.log(`Regenerating scene ${id}`);
    // In a real app, this would trigger the AI generation process
  }, []);
  
  // Handler for adding a new scene
  const handleAddScene = useCallback(() => {
    const newId = String(scenes.length + 1);
    const newScene: SceneData = {
      id: newId,
      prompt: `New scene ${newId}`,
      position: { x: 350, y: 250 }
    };
    
    setScenes(prev => [...prev, newScene]);
    setSelectedSceneId(newId);
  }, [scenes]);
  
  // Handler for timeline item click
  const handleTimelineItemClick = useCallback((id: string) => {
    setSelectedSceneId(id);
  }, []);
  
  // Convert scenes to timeline items
  const timelineItems: TimelineItem[] = scenes.map(scene => ({
    id: scene.id,
    imageUrl: scene.imageUrl,
    isSelected: scene.id === selectedSceneId
  }));
  
  // Video.js options for preview
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: previewUrl || 'https://vjs.zencdn.net/v/oceans.mp4', // Default video if none provided
      type: 'video/mp4'
    }]
  };
  
  // Handler for video preview
  const handlePreviewVideo = () => {
    // In a real app, this would generate a video from the scenes
    // For now, we're using a default video
    setShowPreview(true);
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold">AI MovieMaker</h1>
        <div className="flex gap-2">
          <Button onClick={handlePreviewVideo}>Preview Video</Button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <InfiniteCanvas>
          {scenes.map((scene) => (
            <Scene
              key={scene.id}
              id={scene.id}
              imageUrl={scene.imageUrl}
              prompt={scene.prompt}
              referenceImages={scene.referenceImages}
              position={scene.position}
              onEdit={handleEditScene}
              onRegenerate={handleRegenerateScene}
            />
          ))}
        </InfiniteCanvas>
        
        {/* Timeline */}
        <Timeline
          items={timelineItems}
          onItemClick={handleTimelineItemClick}
          onAddScene={handleAddScene}
        />
      </div>
      
      {/* Video Preview Dialog */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg w-4/5 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Video Preview</h2>
              <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
            </div>
            <div className="w-full aspect-video">
              <VideoPlayer options={videoJsOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}