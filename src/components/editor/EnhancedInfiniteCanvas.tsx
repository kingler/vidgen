'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SceneData } from '@/types/planning';
import EnhancedGlassMorphicContainerV2 from '@/components/ui/EnhancedGlassMorphicContainerV2';

interface EnhancedInfiniteCanvasProps {
  scenes: SceneData[];
}

/**
 * Enhanced Infinite Canvas for movie editing
 * 
 * Features:
 * - Horizontal scene navigation
 * - Vertical alternatives for each scene
 * - Zooming and panning controls
 * - Scene selection and focusing
 */
export const EnhancedInfiniteCanvas: React.FC<EnhancedInfiniteCanvasProps> = ({
  scenes
}) => {
  // Canvas state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  
  // Scene alternatives (generated images for each scene)
  const [sceneAlternatives, setSceneAlternatives] = useState<Record<string, SceneData[]>>({});
  
  // Track which alternative is selected for each scene
  const [selectedAlternatives, setSelectedAlternatives] = useState<Record<string, number>>({});
  
  // References
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize scene alternatives
  useEffect(() => {
    const initialAlternatives: Record<string, SceneData[]> = {};
    const initialSelected: Record<string, number> = {};
    
    scenes.forEach(scene => {
      initialAlternatives[scene.id] = [scene];
      initialSelected[scene.id] = 0;
    });
    
    setSceneAlternatives(initialAlternatives);
    setSelectedAlternatives(initialSelected);
  }, [scenes]);
  
  // Handle zoom in/out
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      setScale(Math.min(scale + 0.1, 3));
    } else {
      setScale(Math.max(scale - 0.1, 0.5));
    }
  };
  
  // Reset zoom and position
  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Start drag operation
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setStartDragPosition({ x: e.clientX, y: e.clientY });
  };
  
  // Handle drag operation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startDragPosition.x;
    const dy = e.clientY - startDragPosition.y;
    
    setPosition({
      x: position.x + dx,
      y: position.y + dy
    });
    
    setStartDragPosition({ x: e.clientX, y: e.clientY });
  };
  
  // End drag operation
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle scene selection
  const handleSelectScene = (index: number) => {
    if (isZoomedIn && index === selectedSceneIndex) {
      // If already zoomed in on this scene, zoom out
      setIsZoomedIn(false);
      handleResetView();
    } else if (isZoomedIn) {
      // If zoomed in on a different scene, switch to this one
      setSelectedSceneIndex(index);
    } else {
      // If zoomed out, zoom in on this scene
      setSelectedSceneIndex(index);
      setIsZoomedIn(true);
      
      // Center the selected scene
      if (canvasRef.current) {
        const sceneWidth = 400; // Approximate width of a scene card
        const sceneSpacing = 100; // Spacing between scenes
        const centerX = -(index * (sceneWidth + sceneSpacing)) + (window.innerWidth / 2) - (sceneWidth / 2);
        
        setPosition({ x: centerX, y: 0 });
        setScale(1.5);
      }
    }
  };
  
  // Generate a new alternative for a scene
  const handleRegenerateScene = (sceneId: string) => {
    // In a real implementation, this would call an API to generate a new image
    // For now, we'll simulate a new image by creating a clone with a slightly modified prompt
    
    const currentScene = sceneAlternatives[sceneId][0]; // Get original scene
    const newAlternative: SceneData = {
      ...currentScene,
      id: `${currentScene.id}_alt_${sceneAlternatives[sceneId].length}`,
      visualPrompt: `${currentScene.visualPrompt} (alternative version ${sceneAlternatives[sceneId].length + 1})`
    };
    
    // Add the new alternative to the beginning of the array (top of the stack)
    setSceneAlternatives({
      ...sceneAlternatives,
      [sceneId]: [newAlternative, ...sceneAlternatives[sceneId]]
    });
    
    // Select the new alternative
    setSelectedAlternatives({
      ...selectedAlternatives,
      [sceneId]: 0
    });
  };
  
  // Select a different alternative for a scene
  const handleSelectAlternative = (sceneId: string, alternativeIndex: number) => {
    setSelectedAlternatives({
      ...selectedAlternatives,
      [sceneId]: alternativeIndex
    });
  };
  
  // Edit the prompt for a scene
  const [editingPrompt, setEditingPrompt] = useState<{sceneId: string, prompt: string} | null>(null);
  
  const handleStartEditPrompt = (sceneId: string) => {
    const scene = sceneAlternatives[sceneId][selectedAlternatives[sceneId]];
    setEditingPrompt({
      sceneId,
      prompt: scene.visualPrompt
    });
  };
  
  const handleSavePrompt = () => {
    if (!editingPrompt) return;
    
    const { sceneId, prompt } = editingPrompt;
    const currentScene = sceneAlternatives[sceneId][selectedAlternatives[sceneId]];
    
    // Create a new scene with the updated prompt
    const updatedScene: SceneData = {
      ...currentScene,
      visualPrompt: prompt
    };
    
    // Update the scene in the alternatives
    const updatedAlternatives = [...sceneAlternatives[sceneId]];
    updatedAlternatives[selectedAlternatives[sceneId]] = updatedScene;
    
    setSceneAlternatives({
      ...sceneAlternatives,
      [sceneId]: updatedAlternatives
    });
    
    setEditingPrompt(null);
  };
  
  // Navigate to the next/previous scene
  const handleNavigateScene = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setSelectedSceneIndex(Math.min(selectedSceneIndex + 1, scenes.length - 1));
    } else {
      setSelectedSceneIndex(Math.max(selectedSceneIndex - 1, 0));
    }
    
    // Center the selected scene
    const sceneWidth = 400;
    const sceneSpacing = 100;
    const newIndex = direction === 'next' ? selectedSceneIndex + 1 : selectedSceneIndex - 1;
    const centerX = -(newIndex * (sceneWidth + sceneSpacing)) + (window.innerWidth / 2) - (sceneWidth / 2);
    
    setPosition({ x: centerX, y: 0 });
  };
  
  // Render the canvas
  return (
    <div 
      className="relative h-screen w-full overflow-hidden bg-custom-gray-30"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Main canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          transformOrigin: '0 0'
        }}
      >
        {/* Scenes row (horizontal layout) */}
        <div className="flex space-x-24 p-8">
          {scenes.map((scene, index) => {
            const alternativesForThisScene = sceneAlternatives[scene.id] || [scene];
            const selectedAltIndex = selectedAlternatives[scene.id] || 0;
            const selectedScene = alternativesForThisScene[selectedAltIndex];
            
            return (
              <div key={scene.id} className="relative">
                {/* Main scene card */}
                <div 
                  className={`w-96 h-64 flex flex-col relative cursor-pointer transition-all duration-300 ${
                    selectedSceneIndex === index && isZoomedIn 
                      ? 'ring-4 ring-blue-500 scale-105' 
                      : 'hover:scale-105'
                  }`}
                  onClick={() => handleSelectScene(index)}
                >
                  <EnhancedGlassMorphicContainerV2 
                    className="w-full h-full"
                    intense={selectedSceneIndex === index}
                  >
                    <div className="p-4">
                      <div className="text-white font-semibold mb-1">
                        Scene {index + 1}: {selectedScene.title}
                      </div>
                      <div className="text-white/70 text-sm mb-2 line-clamp-1">
                        {selectedScene.description}
                      </div>
                      {/* Placeholder for the actual image */}
                      <div 
                        className="w-full h-32 bg-custom-gray-50 rounded-md mb-2 flex items-center justify-center"
                        style={{
                          backgroundImage: selectedScene.imageUrl 
                            ? `url(${selectedScene.imageUrl})` 
                            : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {!selectedScene.imageUrl && (
                          <div className="text-white/50">
                            Image will be generated here
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <div className="text-white/70 text-xs">
                          {alternativesForThisScene.length} version{alternativesForThisScene.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-white/70 text-xs">
                          Chapter {Math.floor(index / 3) + 1}, Scene {(index % 3) + 1}
                        </div>
                      </div>
                    </div>
                  </EnhancedGlassMorphicContainerV2>
                </div>
                
                {/* Alternatives stack (only visible when focused) */}
                {selectedSceneIndex === index && isZoomedIn && (
                  <div className="absolute top-full left-0 w-full space-y-4 mt-4">
                    {alternativesForThisScene.map((alt, altIndex) => (
                      altIndex !== selectedAltIndex && (
                        <div 
                          key={alt.id}
                          className="w-80 h-32 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => handleSelectAlternative(scene.id, altIndex)}
                        >
                          <EnhancedGlassMorphicContainerV2 className="w-full h-full">
                            <div className="p-3">
                              <div className="text-white text-sm font-medium mb-1">Alternative {altIndex + 1}</div>
                              {/* Placeholder for the alternative image */}
                              <div 
                                className="w-full h-16 bg-custom-gray-50 rounded-md flex items-center justify-center"
                                style={{
                                  backgroundImage: alt.imageUrl 
                                    ? `url(${alt.imageUrl})` 
                                    : 'none',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              >
                                {!alt.imageUrl && (
                                  <div className="text-white/50 text-xs">
                                    Alt. version {altIndex + 1}
                                  </div>
                                )}
                              </div>
                            </div>
                          </EnhancedGlassMorphicContainerV2>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Controls overlay */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <EnhancedGlassMorphicContainerV2 className="p-2">
          <div className="flex space-x-3">
            <button
              onClick={() => handleZoom('out')}
              className="w-10 h-10 flex items-center justify-center text-white bg-custom-gray-40 rounded-full hover:bg-custom-gray-50"
            >
              -
            </button>
            <button
              onClick={handleResetView}
              className="h-10 px-4 flex items-center justify-center text-white bg-custom-gray-40 rounded-full hover:bg-custom-gray-50"
            >
              Reset View
            </button>
            <button
              onClick={() => handleZoom('in')}
              className="w-10 h-10 flex items-center justify-center text-white bg-custom-gray-40 rounded-full hover:bg-custom-gray-50"
            >
              +
            </button>
          </div>
        </EnhancedGlassMorphicContainerV2>
        
        {isZoomedIn && (
          <EnhancedGlassMorphicContainerV2 className="p-2">
            <div className="flex space-x-3">
              <button
                onClick={() => handleNavigateScene('prev')}
                disabled={selectedSceneIndex === 0}
                className={`h-10 px-4 flex items-center justify-center text-white rounded-full ${
                  selectedSceneIndex === 0 
                    ? 'bg-custom-gray-30 cursor-not-allowed' 
                    : 'bg-custom-gray-40 hover:bg-custom-gray-50'
                }`}
              >
                Previous
              </button>
              <div className="h-10 px-4 flex items-center justify-center text-white">
                Scene {selectedSceneIndex + 1} of {scenes.length}
              </div>
              <button
                onClick={() => handleNavigateScene('next')}
                disabled={selectedSceneIndex === scenes.length - 1}
                className={`h-10 px-4 flex items-center justify-center text-white rounded-full ${
                  selectedSceneIndex === scenes.length - 1 
                    ? 'bg-custom-gray-30 cursor-not-allowed' 
                    : 'bg-custom-gray-40 hover:bg-custom-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </EnhancedGlassMorphicContainerV2>
        )}
      </div>
      
      {/* Scene editing controls */}
      {isZoomedIn && (
        <div className="absolute top-6 right-6">
          <EnhancedGlassMorphicContainerV2 className="p-4 w-80">
            <h3 className="text-white font-medium mb-3">
              Scene {selectedSceneIndex + 1}: {scenes[selectedSceneIndex].title}
            </h3>
            
            <div className="space-y-4">
              {/* Prompt display/editor */}
              <div>
                <div className="text-white/80 text-sm mb-1">Visual Prompt:</div>
                {editingPrompt?.sceneId === scenes[selectedSceneIndex].id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingPrompt.prompt}
                      onChange={(e) => setEditingPrompt({
                        ...editingPrompt,
                        prompt: e.target.value
                      })}
                      className="w-full h-20 p-2 bg-custom-gray-30 border border-white/30 rounded-md text-sm text-white"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingPrompt(null)}
                        className="px-3 py-1 bg-custom-gray-40 text-white rounded-md text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePrompt}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="p-2 bg-custom-gray-30 border border-white/10 rounded-md text-white/90 text-sm max-h-20 overflow-y-auto"
                    onClick={() => handleStartEditPrompt(scenes[selectedSceneIndex].id)}
                  >
                    {sceneAlternatives[scenes[selectedSceneIndex].id]?.[selectedAlternatives[scenes[selectedSceneIndex].id]]?.visualPrompt || 'No prompt'}
                  </div>
                )}
              </div>
              
              {/* Regenerate button */}
              <button
                onClick={() => handleRegenerateScene(scenes[selectedSceneIndex].id)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Regenerate Image
              </button>
              
              {/* Generate video button (future functionality) */}
              <button
                className="w-full py-2 bg-custom-gray-40 hover:bg-custom-gray-50 text-white rounded-md transition-colors"
              >
                Generate Video
              </button>
            </div>
          </EnhancedGlassMorphicContainerV2>
        </div>
      )}
    </div>
  );
};

export default EnhancedInfiniteCanvas;