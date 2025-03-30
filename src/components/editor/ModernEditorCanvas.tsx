'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SceneData } from '@/types/planning';
import GridBackgroundCanvas from './GridBackgroundCanvas';
import ImageVideoContainer from './ImageVideoContainer';

interface ModernEditorCanvasProps {
  scenes: SceneData[];
  defaultSceneIndex?: number;
}

/**
 * Modern editor canvas with a horizontal timeline and focused scene view
 */
export const ModernEditorCanvas: React.FC<ModernEditorCanvasProps> = ({
  scenes,
  defaultSceneIndex = 0
}) => {
  // State
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(defaultSceneIndex);
  const [isZoomedOut, setIsZoomedOut] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  
  // Scene state
  const [sceneState, setSceneState] = useState<Record<string, {
    imageUrl?: string;
    videoUrl?: string;
    isGenerating: boolean;
    prompt: string;
  }>>({});
  
  // Initialize scene state
  useEffect(() => {
    const initialState: Record<string, {
      imageUrl?: string;
      videoUrl?: string;
      isGenerating: boolean;
      prompt: string;
    }> = {};
    
    scenes.forEach(scene => {
      initialState[scene.id] = {
        imageUrl: scene.imageUrl || undefined,
        videoUrl: undefined,
        isGenerating: false,
        prompt: scene.visualPrompt || ''
      };
    });
    
    setSceneState(initialState);
  }, [scenes]);
  
  // Refs
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Handle zoom toggle
  const handleToggleZoom = () => {
    if (isZoomedOut) {
      // Zoom in on selected scene
      setIsZoomedOut(false);
      handleCenterScene(selectedSceneIndex);
    } else {
      // Zoom out to see all scenes
      setIsZoomedOut(true);
      setScale(0.6);
      setPosition({ x: 0, y: 0 });
    }
  };
  
  // Center view on a specific scene
  const handleCenterScene = (index: number) => {
    setSelectedSceneIndex(index);
    
    // Calculate center position
    if (timelineRef.current) {
      const sceneElement = timelineRef.current.children[index] as HTMLElement;
      if (sceneElement) {
        const sceneRect = sceneElement.getBoundingClientRect();
        const timelineRect = timelineRef.current.getBoundingClientRect();
        
        // Center the scene
        const centerX = (timelineRect.width / 2) - (sceneRect.width / 2) - sceneRect.left + timelineRect.left;
        setPosition({ x: centerX, y: 0 });
        setScale(1);
      }
    }
  };
  
  // Start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomedOut) return; // Only allow dragging in zoomed out mode
    
    e.preventDefault();
    setIsDragging(true);
    setStartDragPosition({ x: e.clientX, y: e.clientY });
  };
  
  // End dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle drag motion
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startDragPosition.x;
    const dy = e.clientY - startDragPosition.y;
    
    setPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setStartDragPosition({ x: e.clientX, y: e.clientY });
  };
  
  // Regenerate image
  const handleRegenerateImage = (sceneId: string) => {
    setSceneState(prev => ({
      ...prev,
      [sceneId]: {
        ...prev[sceneId],
        isGenerating: true
      }
    }));
    
    // Simulate image generation (in real app, call an API)
    setTimeout(() => {
      setSceneState(prev => ({
        ...prev,
        [sceneId]: {
          ...prev[sceneId],
          isGenerating: false,
          imageUrl: `https://source.unsplash.com/random/800x600?sig=${Math.random()}`
        }
      }));
    }, 2000);
  };
  
  // Generate video
  const handleGenerateVideo = (sceneId: string) => {
    setSceneState(prev => ({
      ...prev,
      [sceneId]: {
        ...prev[sceneId],
        isGenerating: true
      }
    }));
    
    // Simulate video generation (in real app, call an API)
    setTimeout(() => {
      setSceneState(prev => ({
        ...prev,
        [sceneId]: {
          ...prev[sceneId],
          isGenerating: false,
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        }
      }));
    }, 3000);
  };
  
  // Update scene prompt
  const handleUpdatePrompt = (sceneId: string, newPrompt: string) => {
    setSceneState(prev => ({
      ...prev,
      [sceneId]: {
        ...prev[sceneId],
        prompt: newPrompt
      }
    }));
  };
  
  // Currently selected scene
  const selectedScene = scenes[selectedSceneIndex];
  const selectedSceneState = sceneState[selectedScene?.id];
  
  return (
    <GridBackgroundCanvas>
      <div 
        className="relative w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* Main editor area */}
        <div 
          className="absolute top-12 left-1/2 transform -translate-x-1/2"
          style={{ 
            width: '70%', 
            height: isZoomedOut ? '60%' : '80%' 
          }}
        >
          {!isZoomedOut && selectedSceneState && (
            <div className="w-full h-full flex items-center justify-center">
              <ImageVideoContainer
                imageUrl={selectedSceneState.imageUrl}
                videoUrl={selectedSceneState.videoUrl}
                isGenerating={selectedSceneState.isGenerating}
                prompt={selectedSceneState.prompt}
                onRegenerateImage={() => handleRegenerateImage(selectedScene.id)}
                onGenerateVideo={() => handleGenerateVideo(selectedScene.id)}
                onPromptChange={(newPrompt) => handleUpdatePrompt(selectedScene.id, newPrompt)}
              />
            </div>
          )}
        </div>
        
        {/* Bottom timeline */}
        <div 
          className="absolute bottom-6 left-0 w-full overflow-hidden"
          style={{ height: isZoomedOut ? 'auto' : '100px' }}
        >
          <div 
            ref={timelineRef}
            className="flex space-x-4 px-6 py-3 transition-transform"
            style={{
              transform: isZoomedOut ? 
                `scale(${scale}) translate(${position.x}px, ${position.y}px)` : 
                'none',
              transformOrigin: 'center bottom'
            }}
          >
            {scenes.map((scene, index) => {
              const isSelected = selectedSceneIndex === index;
              const state = sceneState[scene.id];
              
              return (
                <div 
                  key={scene.id}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                  style={{ 
                    width: '180px', 
                    height: '100px',
                    transform: isSelected && !isZoomedOut ? 'scale(1.05)' : 'scale(1)',
                    borderRadius: '5px',
                    overflow: 'hidden'
                  }}
                  onClick={() => {
                    if (isZoomedOut) {
                      setIsZoomedOut(false);
                    }
                    handleCenterScene(index);
                  }}
                >
                  {/* Thumbnail */}
                  <div className="w-full h-full bg-black flex items-center justify-center text-xs">
                    {state?.imageUrl ? (
                      <img 
                        src={state.imageUrl} 
                        alt={scene.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">
                        {state?.isGenerating ? 'Generating...' : 'No image'}
                      </div>
                    )}
                    
                    {/* Small label for chapter/scene */}
                    <div className="absolute top-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded">
                      Ch {Math.floor(index / 3) + 1}.{(index % 3) + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Zoom control */}
        <button
          className="absolute top-4 right-4 bg-white/90 p-2 rounded shadow-md text-gray-700 text-sm"
          onClick={handleToggleZoom}
        >
          {isZoomedOut ? 'Zoom In' : 'Zoom Out'}
        </button>
        
        {/* Small title banner */}
        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded shadow-md text-gray-700 text-xs flex items-center">
          {!isZoomedOut && (
            <>
              <div className="font-medium">
                Chapter {Math.floor(selectedSceneIndex / 3) + 1}, Scene {(selectedSceneIndex % 3) + 1}
              </div>
              <div className="mx-2 text-gray-300">|</div>
            </>
          )}
          <div className="text-gray-500">{scenes.length} scenes</div>
        </div>
      </div>
    </GridBackgroundCanvas>
  );
};

export default ModernEditorCanvas;