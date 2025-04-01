'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getReplicateService } from '@/services/ReplicateService';
import ErrorMessage from './ui/ErrorMessage';

/**
 * Scene Component
 *
 * Represents a single scene in the infinite canvas.
 */
interface SceneProps {
  scene: {
    id: string;
    prompt: string;
    chapter: number;
    sceneNumber: number;
    title: string;
    imageUrl?: string;  // URL of the generated image
  };
  isCurrentScene: boolean;
  isGenerating?: boolean;
  onClick: () => void;
}

// Add a current scene interface
interface CurrentScene {
  id: string;
  prompt: string;
  chapter: number;
  sceneNumber: number;
  isGenerating: boolean;
  imageUrl?: string;
  videoUrl?: string;
}

const Scene: React.FC<SceneProps> = ({ scene, isCurrentScene, isGenerating = false, onClick }) => {
  return (
    <div
      id={scene.id}
      key={scene.id}
      className={`scene-container rounded-lg transition-all ${
        isCurrentScene
          ? 'ring-2 ring-yellow-400 z-10 transform active'
          : 'ring-1 ring-yellow-400/20 hover:ring-yellow-400/40 hover:scale-102'
      }`}
      style={{
        gridColumn: `${scene.chapter}`,
        gridRow: `${scene.sceneNumber}`
      }}
      onClick={onClick}
    >
      <div className="w-full h-full flex items-center justify-center text-white relative">
        <div className="absolute top-0 left-0 w-full bg-black/50 text-xs text-center py-1">
          {scene.id}
        </div>
        
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
              <span>Generating image...</span>
            </div>
          </div>
        )}
        
        {scene.imageUrl ? (
          <div className="w-full h-full overflow-hidden scene-image-container">
            <img
              src={scene.imageUrl}
              alt={scene.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <span className="p-4 text-center scene-image-container">
            {scene.prompt.substring(0, 50)}...
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * MovieEditorV4 
 * A comprehensive editor for video production
 */
interface MovieEditorV4Props {
  enhanced?: boolean;
}

/**
 * MovieEditorV4 - Infinite Canvas Implementation
 * 
 * Features:
 * - True infinite canvas that extends beyond the viewport
 * - Scenes organized in a grid (chapters horizontally, scenes vertically)
 * - Zoom in/out functionality with mouse wheel support
 * - Drag to pan with right-click or in overview mode
 * - Fixed elements: sidebar navigation, timeline, and contextual prompt area
 * - 50px spacing between scenes for clear visual separation
 * - Smooth transitions between views
 */
export default function MovieEditorV4({ enhanced = false }: MovieEditorV4Props) {
  // State for the current scene
  const [currentScene, setCurrentScene] = useState<CurrentScene>({
    id: 'scene-1-1',
    prompt: 'A dimly lit room with a single figure standing by a window, rain pouring outside.',
    chapter: 1,
    sceneNumber: 1,
    isGenerating: false,
    imageUrl: '',
    videoUrl: ''
  });

  // Add a type for the edit mode
  type EditingMode = 
    | 'InPainting' 
    | 'OutPainting' 
    | 'Enhancement'
    | 'Camera'
    | 'Lighting';
    
  // State for the editing mode
  const [editingMode, setEditingMode] = useState<EditingMode>('InPainting');
  
  // Add state for API status
  const [apiStatus, setApiStatus] = useState<{
    checked: boolean;
    connected: boolean;
    message?: string;
  }>({
    checked: false,
    connected: false
  });

  // Refs for canvas and interactions
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });
  
  // State for canvas view with animation properties
  const [canvasView, setCanvasView] = useState({
    scale: 1.0,
    translateX: 0,
    translateY: 0,
    zoomMode: 'focused', // 'focused' or 'overview'
    transition: 'transform 500ms ease-in-out', // Animation for smooth transitions
  });
  
  // State for UI animations
  const [uiAnimation, setUiAnimation] = useState({
    promptVisible: true,
    timelineVisible: true,
  });

  // Add state for the error
  const [error, setError] = useState<string | null>(null);

  // Enhanced mode features
  const [showEnhancedControls] = useState(enhanced);

  // Check API connectivity on component mount
  useEffect(() => {
    const checkApiConnectivity = async () => {
      try {
        // Check API connectivity using our debug endpoint
        const response = await fetch('/api/debug');
        const data = await response.json();
        
        console.log('🔌 API connectivity check:', data);
        
        if (data.replicate.status === 'Connected successfully') {
          setApiStatus({
            checked: true,
            connected: true
          });
        } else {
          setApiStatus({
            checked: true,
            connected: false,
            message: `API connection issue: ${data.replicate.status}`
          });
          
          // Set error if not connected
          setError(`API connection error: ${data.replicate.status}. Please check your API key.`);
        }
      } catch (error) {
        console.error('Error checking API connectivity:', error);
        setApiStatus({
          checked: true,
          connected: false,
          message: error instanceof Error ? error.message : String(error)
        });
        
        // Set error if connection check fails
        setError('Failed to check API connectivity. Please ensure your server is running.');
      }
    };
    
    checkApiConnectivity();
  }, []);

  // Mock data for chapters and scenes - more comprehensive for infinite canvas
  const chapters = [
    {
      id: 'chapter-1',
      title: 'Chapter 1',
      scenes: [
        {
          id: 'scene-1-1',
          title: 'Scene 1',
          chapter: 1,
          sceneNumber: 1,
          prompt: 'A dimly lit room filled with shadows, where a lone figure stands by a cracked window, rain pouring down outside. The atmosphere is thick with tension as the character clutches a worn photograph, their face a mixture of sorrow and determination.',
          imageUrl: '' // Empty string instead of undefined for Generated image URL
        },
        {
          id: 'scene-1-2',
          title: 'Scene 2',
          chapter: 1,
          sceneNumber: 2,
          prompt: 'Close-up of the worn photograph revealing a smiling family, now faded with age and marked by a single teardrop stain.',
          imageUrl: '' // Empty string instead of undefined
        },
        {
          id: 'scene-1-3',
          title: 'Scene 3',
          chapter: 1,
          sceneNumber: 3,
          prompt: 'The figure turns as a door creaks open, sending a shaft of light across the room that illuminates their determined expression.',
          imageUrl: '' // Empty string instead of undefined
        }
      ]
    },
    {
      id: 'chapter-2',
      title: 'Chapter 2',
      scenes: [
        {
          id: 'scene-2-1',
          title: 'Scene 1',
          chapter: 2,
          sceneNumber: 1,
          prompt: 'A bustling street market under the golden hues of sunset, with vendors calling out and colorful fabrics fluttering in the breeze.',
          imageUrl: '' // Empty string instead of undefined
        },
        {
          id: 'scene-2-2',
          title: 'Scene 2',
          chapter: 2,
          sceneNumber: 2,
          prompt: 'Our protagonist weaves through the crowd, eyes scanning faces, hand clutching the photograph from earlier.',
          imageUrl: '' // Empty string instead of undefined
        },
        {
          id: 'scene-2-3',
          title: 'Scene 3',
          chapter: 2,
          sceneNumber: 3,
          prompt: 'A sudden recognition flashes across their face as they spot someone familiar disappearing around a corner.',
          imageUrl: '' // Empty string instead of undefined
        }
      ]
    },
    {
      id: 'chapter-3',
      title: 'Chapter 3',
      scenes: [
        {
          id: 'scene-3-1',
          title: 'Scene 1',
          chapter: 3,
          sceneNumber: 1,
          prompt: 'A narrow alleyway stretching into darkness, with only a single lantern illuminating a doorway halfway down.',
          imageUrl: '' // Empty string instead of undefined
        },
        {
          id: 'scene-3-2',
          title: 'Scene 2',
          chapter: 3,
          sceneNumber: 2,
          prompt: 'The protagonist approaches cautiously, hand reaching inside their jacket for what might be a weapon.',
          imageUrl: '' // Empty string instead of undefined
        }
      ]
    }
  ];

  // Navigation icons for slim sidebar
  const navIcons = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      tooltip: 'Start Over',
      action: () => window.location.href = '/',
      isActive: false
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <circle cx="10" cy="13" r="2"></circle>
          <path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22"></path>
        </svg>
      ),
      tooltip: 'Story Definition',
      action: () => window.location.href = '/story-definition',
      isActive: false
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <path d="M13 8H7"></path>
          <path d="M13 12H7"></path>
        </svg>
      ),
      tooltip: 'Character Development',
      action: () => window.location.href = '/character-development',
      isActive: false
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1"></rect>
          <rect width="7" height="7" x="14" y="3" rx="1"></rect>
          <rect width="7" height="7" x="14" y="14" rx="1"></rect>
          <rect width="7" height="7" x="3" y="14" rx="1"></rect>
        </svg>
      ),
      tooltip: 'Scene Planning',
      action: () => window.location.href = '/scene-planning',
      isActive: false
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
          <path d="M12 11v6"></path>
          <path d="M8 11v6"></path>
          <path d="M16 11v6"></path>
        </svg>
      ),
      tooltip: 'Movie Editor',
      action: () => window.location.href = '/movie-editor',
      isActive: true
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      tooltip: 'Settings',
      action: () => console.log('Settings'),
      isActive: false
    }
  ];

  // Handle regenerate action
  const handleRegenerate = async () => {
    try {
      // Check API connectivity first
      if (!apiStatus.connected) {
        setError('API is not connected. Please check your API key and try again.');
        return;
      }
      
      console.log('🚀 Starting image generation...');
      
      // Clear any previous errors
      setError(null);
      
      // When debugging, uncomment this to bypass actual API calls
      // Just for testing interface - REMOVE FOR PRODUCTION
      if (process.env.NODE_ENV === 'development' && false) {
        // Debug mock response
        setTimeout(() => {
          console.log('✅ MOCK: Generated image URL (fake for testing)');
          setCurrentScene(prev => {
            console.log('🖼️ Setting MOCK imageUrl in state', prev);
            return {
              ...prev,
              isGenerating: false,
              imageUrl: 'https://replicate.delivery/pbxt/8hW87KZyujxHG7TwcHQpY0q1QE01azLAT6EShGKTadgJqSRQA/out-0.png'
            };
          });
        }, 2000);
        
        // Set the current scene to generating state
        setCurrentScene(prev => {
          console.log('🔄 Setting isGenerating to true', prev);
          return { ...prev, isGenerating: true };
        });
        
        return;
      }
      
      // Force reset any previous image - this fixes a state issue
      if (currentScene.imageUrl) {
        setCurrentScene(prev => ({
          ...prev,
          imageUrl: '',
          isGenerating: true
        }));
        
        // Give time for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        // Set the current scene to generating state
        setCurrentScene(prev => {
          console.log('🔄 Setting isGenerating to true', prev);
          return { ...prev, isGenerating: true };
        });
      }
      
      // Find the scene object in the chapters
      const sceneId = `scene-${currentScene.chapter}-${currentScene.sceneNumber}`;
      console.log('🔍 Generating image for scene:', sceneId);
      console.log('📝 Using prompt:', currentScene.prompt);
      
      // Get the ReplicateService instance
      const replicateService = getReplicateService();
      console.log('🔌 ReplicateService instance created');
      
      // Generate image using Flux model
      console.log('🎨 Calling generateFluxImage...');
      const imageUrl = await replicateService.generateFluxImage(
        currentScene.prompt,
        {
          aspectRatio: "16:9",
          quality: 90,
          steps: 4  // Must be <= 4 for Flux model compatibility
        }
      );
      
      console.log('✅ Generated image URL:', imageUrl);
      
      // Update the current scene state with the image URL
      setCurrentScene(prev => {
        console.log('🖼️ Setting imageUrl in state', prev);
        return {
          ...prev,
          isGenerating: false,
          imageUrl: imageUrl
        };
      });
      
      // Update the scene in the chapters array
      console.log('Updating scene in canvas:', sceneId);
      
      // Find the scene
      const foundScene = document.getElementById(sceneId);
      if (foundScene) {
        // Update the scene's image
        const imgContainer = foundScene.querySelector('.scene-image-container');
        if (imgContainer) {
          // Clear existing content
          imgContainer.innerHTML = '';
          
          // Create new image
          const img = document.createElement('img');
          img.src = imageUrl;
          img.alt = 'Generated image';
          img.className = 'w-full h-full object-cover';
          imgContainer.appendChild(img);
          
          // Also update the scene in the chapters array for persistence
          const updatedChapters = [...chapters];
          for (const chapter of updatedChapters) {
            for (const scene of chapter.scenes) {
              if (scene.id === sceneId) {
                scene.imageUrl = imageUrl;
                break;
              }
            }
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Error generating image:', error);
      setCurrentScene(prev => ({ ...prev, isGenerating: false }));
      
      // Set user-friendly error message
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to generate image. Please try again.';
      
      setError(errorMessage);
    }
  };

  // Handle video generation
  const handleGenerateVideo = async () => {
    try {
      // Validate we have an image
      if (!currentScene.imageUrl) {
        setError('Please generate an image first before creating a video');
        return;
      }
      
      // Clear any previous errors
      setError(null);
      
      // Force any previous value to be cleared
      if (currentScene.videoUrl) {
        setCurrentScene(prev => ({
          ...prev,
          videoUrl: '',
          isGenerating: true
        }));
        
        // Give time for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        // Set the current scene to generating state
        setCurrentScene(prev => ({ ...prev, isGenerating: true }));
      }
      
      // Get the ReplicateService instance
      const replicateService = getReplicateService();
      console.log('🔌 Video generation: ReplicateService instance created');
      
      // Generate video from the image
      console.log('🎬 Starting video generation from image:', currentScene.imageUrl);
      const videoUrl = await replicateService.convertImageToVideo(
        currentScene.imageUrl,
        currentScene.prompt,
        {
          fps: 16,
          numFrames: 81
        }
      );
      
      console.log('✅ Generated video URL:', videoUrl);
      
      // Update the current scene state with the video URL
      setCurrentScene(prev => {
        console.log('🎥 Setting videoUrl in state', prev);
        return {
          ...prev,
          isGenerating: false,
          videoUrl: videoUrl
        };
      });
      
    } catch (error) {
      console.error('❌ Error generating video:', error);
      setCurrentScene(prev => ({ ...prev, isGenerating: false }));
      
      // Set user-friendly error message
      const errorMessage = error instanceof Error 
        ? error.message
        : 'Failed to generate video. Please try again.';
      
      setError(errorMessage);
    }
  };

  // Get the focused scene's coordinates and prompt
  const getFocusedSceneData = () => {
    // Calculate position based on chapter and scene numbers
    const x = (currentScene.chapter - 1) * 1300 + 600; // 1300px per chapter (1200px width + 100px gap)
    
    // Get the vertical offset from CSS variables
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const verticalOffset = parseInt(computedStyle.getPropertyValue('--scene-vertical-offset') || '350');
    
    const y = (currentScene.sceneNumber - 1) * 800 + verticalOffset; // Using the vertical offset from CSS
    
    // Find the scene object to get its prompt
    let prompt = currentScene.prompt;
    for (const chapter of chapters) {
      const scene = chapter.scenes.find(s => s.id === `scene-${currentScene.chapter}-${currentScene.sceneNumber}`);
      if (scene) {
        prompt = scene.prompt;
        break;
      }
    }
    
    return { x, y, prompt };
  };

  // Center the canvas on the current scene with animation
  const centerOnCurrentScene = (withAnimation = true) => {
    const { x, y } = getFocusedSceneData();
    
    console.log('🎯 Centering on scene:', currentScene.id);
    console.log('🔢 Position calculated:', { x, y });
    
    // Calculate the scale to ensure the scene fits properly in the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - 260; // Account for UI elements
    
    // Get scene dimensions from CSS variables
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const sceneWidth = parseInt(computedStyle.getPropertyValue('--editor-scene-width') || '1200');
    const sceneHeight = parseInt(computedStyle.getPropertyValue('--editor-scene-height') || '700');
    
    // Calculate scale to fit scene in viewport while maintaining aspect ratio
    const horizontalScale = viewportWidth / (sceneWidth + 100); // Scene width + some margin
    const verticalScale = viewportHeight / (sceneHeight + 100); // Scene height + some margin
    const fitScale = Math.min(horizontalScale, verticalScale, 1.0); // Don't exceed 1.0 scale
    
    console.log('📏 Fit calculations:', { 
      viewportWidth, 
      viewportHeight, 
      sceneWidth, 
      sceneHeight, 
      horizontalScale, 
      verticalScale, 
      fitScale 
    });
    
    // If we want animation, use the transition property
    if (!withAnimation) {
      setCanvasView(prev => ({
        ...prev,
        scale: fitScale,
        translateX: -x + window.innerWidth / 2,
        translateY: -y + window.innerHeight / 2,
        zoomMode: 'focused',
        transition: 'none'
      }));
    } else {
      // Animate to the new position
      setCanvasView(prev => ({
        ...prev,
        scale: fitScale,
        translateX: -x + window.innerWidth / 2,
        translateY: -y + window.innerHeight / 2,
        zoomMode: 'focused',
        transition: 'transform 500ms ease-in-out'
      }));
      
      // Animate the UI elements
      setUiAnimation({
        promptVisible: false,
        timelineVisible: false,
      });
      
      // After a short delay, show the UI elements with animation
      setTimeout(() => {
        setUiAnimation({
          promptVisible: true,
          timelineVisible: true,
        });
      }, 300);
    }
  };

  // Toggle zoom level with animation
  const toggleZoom = () => {
    if (canvasView.zoomMode === 'focused') {
      // Zoom out to overview
      setCanvasView(prev => ({
        ...prev,
        scale: 0.3,
        zoomMode: 'overview',
        transition: 'transform 500ms ease-in-out, scale 500ms ease-in-out'
      }));
      
      // Hide UI elements during transition
      setUiAnimation({
        promptVisible: false,
        timelineVisible: true,
      });
    } else {
      // Zoom in on current scene
      const { x, y } = getFocusedSceneData();
      
      // Calculate the scale to ensure the scene fits properly in the viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 260; // Account for UI elements
      
      // Calculate scale to fit scene in viewport while maintaining aspect ratio
      const horizontalScale = viewportWidth / 1300; // Scene width + some margin
      const verticalScale = viewportHeight / 800; // Scene height + some margin
      const fitScale = Math.min(horizontalScale, verticalScale, 1.0); // Don't exceed 1.0 scale
      
      setCanvasView({
        scale: fitScale,
        translateX: -x + window.innerWidth / 2,
        translateY: -y + window.innerHeight / 2,
        zoomMode: 'focused',
        transition: 'transform 500ms ease-in-out, scale 500ms ease-in-out'
      });
      
      // Show UI elements with animation
      setTimeout(() => {
        setUiAnimation({
          promptVisible: true,
          timelineVisible: true,
        });
      }, 300);
    }
  };
  
  // Handle mouse wheel for zooming - with smooth zoom and cursor-based zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Get cursor position relative to canvas
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;
    
    // Determine zoom direction and factor - smoother delta for trackpads
    const zoomFactor = Math.min(Math.abs(e.deltaY) / 200, 0.2);
    const zoomIn = e.deltaY < 0;
    
    // Current scale and positions
    const oldScale = canvasView.scale;
    let newScale = oldScale;
    
    if (zoomIn && oldScale < 2.0) {
      // Zoom in (max zoom 2.0x)
      newScale = Math.min(oldScale + zoomFactor, 2.0);
    } else if (!zoomIn && oldScale > 0.2) {
      // Zoom out (min zoom 0.2x)
      newScale = Math.max(oldScale - zoomFactor, 0.2);
    } else {
      return; // No change needed
    }
    
    // Determine new mode based on scale threshold
    const newMode = newScale >= 0.7 ? 'focused' : 'overview';
    
    // Calculate new translate values to zoom toward cursor position
    // This makes the zoom happen centered on the cursor position
    const scaleChange = newScale / oldScale;
    const newTranslateX = canvasView.translateX - ((cursorX - canvasView.translateX) * (scaleChange - 1));
    const newTranslateY = canvasView.translateY - ((cursorY - canvasView.translateY) * (scaleChange - 1));
    
    // Update canvas view with new values
    setCanvasView(prev => ({
      ...prev,
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY,
      zoomMode: newMode,
      transition: 'transform 100ms ease-out, scale 100ms ease-out'
    }));
    
    // Show/hide prompt based on zoom level
    if (newMode === 'overview') {
      setUiAnimation(prev => ({
        ...prev,
        promptVisible: false
      }));
    } else {
      setUiAnimation(prev => ({
        ...prev,
        promptVisible: true
      }));
    }
  };
  
  // Handle mouse drag for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only right mouse button (or any button in overview mode)
    if (e.button === 2 || canvasView.zoomMode === 'overview') {
      dragRef.current.isDragging = true;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      
      // Disable transition during drag
      setCanvasView(prev => ({
        ...prev,
        transition: 'none'
      }));
      
      // Prevent default behavior
      e.preventDefault();
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragRef.current.isDragging) {
      const deltaX = e.clientX - dragRef.current.lastX;
      const deltaY = e.clientY - dragRef.current.lastY;
      
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
      
      setCanvasView(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY,
      }));
      
      e.preventDefault();
    }
  };
  
  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
    
    // Re-enable transition
    setCanvasView(prev => ({
      ...prev,
      transition: 'transform 300ms ease-out'
    }));
  };
  
  // Focus on a specific scene with improved center calculation
  const focusOnScene = (sceneId: string, scenePrompt: string, chapterNum: number, sceneNum: number) => {
    // Update current scene
    setCurrentScene({
      id: sceneId,
      prompt: scenePrompt,
      chapter: chapterNum,
      sceneNumber: sceneNum,
      isGenerating: false
    });
    
    // If in overview mode, switch to focused mode
    if (canvasView.zoomMode === 'overview') {
      // Calculate scene position based on chapter and scene numbers
      const sceneX = (chapterNum - 1) * 1300 + 600; // 1300px per chapter (1200px width + 100px gap)
      
      // Get the vertical offset from CSS variables using getComputedStyle
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const verticalOffset = parseInt(computedStyle.getPropertyValue('--scene-vertical-offset') || '350');
      
      const sceneY = (sceneNum - 1) * 800 + verticalOffset; // Using the vertical offset from CSS
      
      // More precise calculation considering the viewport center
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Factor in any header space
      const headerOffset = 40;
      const controlsOffset = 200; // Large offset to move scene higher
      
      // Calculate scale to fit scene in viewport while maintaining aspect ratio
      const horizontalScale = viewportWidth / 1300; // Scene width + some margin
      const verticalScale = (viewportHeight - headerOffset - 260) / 800; // Scene height + margin + UI elements
      const fitScale = Math.min(horizontalScale, verticalScale, 1.0); // Don't exceed 1.0 scale
      
      // Animate to focused view centered on the clicked scene
      setCanvasView({
        scale: fitScale,
        translateX: -sceneX + viewportWidth / 2,
        translateY: -sceneY + (viewportHeight / 2) - headerOffset - controlsOffset,
        zoomMode: 'focused',
        transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1), scale 500ms cubic-bezier(0.22, 1, 0.36, 1)'
      });
      
      // Show UI elements with animation after transition
      setTimeout(() => {
        setUiAnimation({
          promptVisible: true,
          timelineVisible: true,
        });
      }, 300);
      
      // Update the prompt immediately for smoother experience
      setCurrentScene(prev => ({
        ...prev,
        prompt: scenePrompt 
      }));
    } else {
      // Just recenter on the new scene
      centerOnCurrentScene(true);
    }
  };
  
  // Get current chapter based on current scene id
  const getCurrentChapter = () => {
    return chapters.find(c => c.id === `chapter-${currentScene.chapter}`) || chapters[0];
  };

  const currentChapter = getCurrentChapter();
  
  // Initialize canvas position and event listeners
  useEffect(() => {
    centerOnCurrentScene(false);
    
    // Prevent context menu on right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    // Set up keyboard shortcuts for navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && canvasView.zoomMode === 'focused') {
        // Escape key toggles to overview mode
        toggleZoom();
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    // Update scene prompt on initial load
    const sceneData = getFocusedSceneData();
    if (sceneData.prompt && sceneData.prompt !== currentScene.prompt) {
      setCurrentScene(prev => ({
        ...prev,
        prompt: sceneData.prompt
      }));
    }
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Recenter when current scene changes
  useEffect(() => {
    centerOnCurrentScene(true);
  }, [currentScene.id]);

  return (
    <div className="fixed inset-0 flex bg-white" style={{ zIndex: 100 }}>
      {/* Fixed Left Sidebar */}
      <nav className="w-12 flex flex-col items-center py-4 space-y-6 z-10"
        style={{
          background: 'white',
          borderRight: '1px solid rgba(0, 0, 0, 0.1)',
        }}>
        {navIcons.map((item, index) => (
          <div key={index} className="relative group">
            <button
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-200 ${
                item.isActive 
                  ? 'bg-black text-white' 
                  : 'text-black hover:bg-black hover:text-white'
              }`}
              onClick={item.action}
            >
              {item.icon}
            </button>
            <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {item.tooltip}
            </div>
          </div>
        ))}
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col" style={{ overflow: 'visible' }}>
        {/* Infinite Canvas Container */}
        <div className="flex-1" style={{ background: 'transparent', overflow: 'visible' }}>
          <div className="inset-0" style={{ position: 'absolute', overflow: 'visible' }}>
            {/* Scene Header - Only visible in focused mode - Changed to be less prominent */}
            {canvasView.zoomMode === 'focused' && (
              <div className="absolute top-0 left-0 w-full z-10 text-white text-center py-3 font-medium"
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                This Section Should Be Generated Scene In the Chapter. The Viewport Is Zoomed in on the Scene for the Chapter In focus
              </div>
            )}
            
            {/* Infinite Canvas - All scenes laid out in a grid */}
            <div
              className="absolute inset-0 cursor-grab canvas-grid"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              ref={canvasRef}
              style={{
                cursor: dragRef.current.isDragging ? 'grabbing' : 'grab',
                overflow: 'visible',
              }}
            >
              <div
                className="scene-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap: 'var(--scene-gap)',
                  transform: `scale(${canvasView.scale}) translate(${canvasView.translateX}px, ${canvasView.translateY}px)`,
                  transformOrigin: 'center center',
                  transition: canvasView.transition,
                  willChange: 'transform',
                }}
              >
                {/* Grid overlay for zoomed-out view */}
                {canvasView.zoomMode === 'overview' && (
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-10 opacity-20 pointer-events-none">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="border border-white/30" />
                    ))}
                  </div>
                )}
              
                {/* Render all chapters and scenes in their grid positions */}
                {chapters.map(chapter => (
                  chapter.scenes.map(scene => (
                    <Scene
                      key={scene.id}
                      scene={scene}
                      isCurrentScene={currentScene.id === scene.id}
                      onClick={() => {
                        // Extract chapter and scene numbers from the id
                        const [, chapterStr, sceneStr] = scene.id.split('-');
                        
                        // Use focusOnScene function to handle centering and animations
                        focusOnScene(
                          scene.id,
                          scene.prompt,
                          parseInt(chapterStr),
                          parseInt(sceneStr)
                        );
                      }}
                    />
                  ))
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Editing Controls & Prompt - animate in/out based on state */}
        <div
          className={`p-6 mx-auto transition-all duration-300 ease-in-out controls-panel ${
            uiAnimation.promptVisible ? 'opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Edit Controls */}
          <div className="mb-6 flex flex-col space-y-3">
            {/* Action Controls */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  className={`btn-mode ${editingMode === 'InPainting' ? 'active' : ''}`}
                  onClick={() => setEditingMode('InPainting')}
                >
                  InPainting
                </button>
                <button
                  className={`btn-mode ${editingMode === 'OutPainting' ? 'active' : ''}`}
                  onClick={() => setEditingMode('OutPainting')}
                >
                  OutPainting
                </button>
                <button
                  className={`btn-mode ${editingMode === 'Enhancement' ? 'active' : ''}`}
                  onClick={() => setEditingMode('Enhancement')}
                >
                  Enhancement
                </button>
                
                {/* Enhanced Mode Controls */}
                {showEnhancedControls && (
                  <>
                    <button
                      className={`btn-mode ${editingMode === 'Camera' ? 'active' : ''}`}
                      onClick={() => setEditingMode('Camera')}
                    >
                      Camera Angle
                    </button>
                    <button
                      className={`btn-mode ${editingMode === 'Lighting' ? 'active' : ''}`}
                      onClick={() => setEditingMode('Lighting')}
                    >
                      Lighting
                    </button>
                  </>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  className="btn-primary disabled:opacity-50"
                  onClick={handleRegenerate}
                  disabled={currentScene.isGenerating}
                >
                  {currentScene.isGenerating ? 'Generating...' : 'Regenerate'}
                </button>
                <button
                  className="btn-secondary disabled:opacity-50"
                  onClick={handleGenerateVideo}
                  disabled={currentScene.isGenerating || !currentScene.imageUrl}
                >
                  {currentScene.isGenerating ? 'Generating...' : 'Generate Video'}
                </button>
                
                {/* Enhanced Mode - Generate Transition */}
                {showEnhancedControls && currentScene.imageUrl && (
                  <button
                    className="btn-primary disabled:opacity-50"
                    onClick={() => console.log('Generate Transition (not implemented yet)')}
                    disabled={currentScene.isGenerating}
                  >
                    Transition
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Error message if generation fails */}
          {error && (
            <div className="mb-4">
              <ErrorMessage 
                message={error} 
                onRetry={handleRegenerate} 
              />
            </div>
          )}
          
          {/* Prompt Area & Reference Images - with slide-up animation */}
          <div
            className="flex space-x-6 mx-auto transition-all duration-500 ease-in-out"
            style={{
              maxWidth: '900px',
              transform: uiAnimation.promptVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: uiAnimation.promptVisible ? 1 : 0,
              transitionDelay: '250ms'
            }}
          >
            {/* Prompt Text Area - 50% with proper font size */}
            <div className="w-1/2">
              <div className="bg-black text-white p-5 h-[180px] shadow-inner"
                style={{
                  borderRadius: '10px',
                  boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                <textarea
                  className="w-full h-full bg-transparent resize-none focus:outline-none scrollbar-hide"
                  style={{
                    fontSize: '15px',
                    lineHeight: '25px',
                    overflow: 'auto',
                    textOverflow: 'ellipsis',
                    color: 'white',
                    caretColor: 'white'
                  }}
                  value={currentScene.prompt}
                  onChange={(e) => setCurrentScene({...currentScene, prompt: e.target.value})}
                />
              </div>
            </div>
            
            {/* Reference Images Area - 50% with fixed thumbnail size - transparent background */}
            <div className="w-1/2">
              <div className="grid grid-cols-2 gap-5 pl-5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center hover:shadow-md transition-shadow"
                    style={{
                      width: '130px',
                      height: '85px',
                      background: 'white',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '10px',
                      boxShadow: '0 3px 8px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    <span className="text-gray-400 text-sm">+ Reference</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Timeline - Only shows current chapter - with slide-up animation */}
        <div
          className={`h-24 overflow-x-auto z-10 transition-all duration-500 ease-in-out timeline ${
            uiAnimation.timelineVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex h-full items-center px-4 space-x-4">
            {/* Current Chapter Timeline */}
            <div key={currentChapter.id} className="h-full flex flex-col">
              {/* Chapter Label */}
              <div className="text-xs text-gray-600 mb-1 font-medium">{currentChapter.title}</div>
              
              {/* Scene Thumbnails - with staggered animations */}
              <div className="flex space-x-2">
                {currentChapter.scenes.map((scene, index) => {
                  // Extract scene number for comparison
                  const sceneNum = parseInt(scene.id.split('-')[2]);
                  
                  return (
                    <div
                      key={scene.id}
                      style={{
                        background: 'black',
                        borderRadius: '0.375rem',
                        border: currentScene.sceneNumber === sceneNum ? '2px solid #FFCC00' : '1px solid rgba(0, 0, 0, 0.2)',
                        transform: uiAnimation.timelineVisible ? 'translateY(0)' : 'translateY(20px)',
                        opacity: uiAnimation.timelineVisible ? 1 : 0,
                        transition: 'all 300ms ease-in-out',
                        transitionDelay: `${100 + index * 50}ms`,
                        boxShadow: currentScene.sceneNumber === sceneNum ? '0 0 10px rgba(255, 204, 0, 0.3)' : 'none'
                      }}
                      className={`h-16 w-24 flex-shrink-0 cursor-pointer flex items-center justify-center hover:border-yellow-400 hover:shadow-md`}
                      onClick={() => {
                        const [, chapterStr, sceneStr] = scene.id.split('-');
                        
                        // Use the focusOnScene function
                        focusOnScene(
                          scene.id,
                          scene.prompt,
                          parseInt(chapterStr),
                          parseInt(sceneStr)
                        );
                      }}
                    >
                      <span className="text-xs text-white">{scene.title}</span>
                    </div>
                  );
                })}
                
                {/* Add Scene Button - with animation */}
                <div
                  className="h-16 w-10 flex-shrink-0 flex items-center justify-center cursor-pointer"
                  style={{
                    transform: uiAnimation.timelineVisible ? 'translateY(0)' : 'translateY(20px)',
                    opacity: uiAnimation.timelineVisible ? 1 : 0,
                    transition: 'all 300ms ease-in-out',
                    transitionDelay: `${100 + currentChapter.scenes.length * 50}ms`,
                    background: 'white',
                    borderRadius: '0.375rem',
                    border: '1px dashed rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <span className="text-gray-400">+</span>
                </div>
              </div>
              {/* Add navigation controls to the left of the timeline with tooltips */}
              <div className="absolute left-[-100px] top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <div className="relative group">
                  <Button
                    className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      // Find prev chapter
                      const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
                      if (currentIndex > 0) {
                        const prevChapter = chapters[currentIndex - 1];
                        const firstScene = prevChapter.scenes[0];
                        const [, chapterStr, sceneStr] = firstScene.id.split('-');
                        
                        // Use the focusOnScene function
                        focusOnScene(
                          firstScene.id,
                          firstScene.prompt,
                          parseInt(chapterStr),
                          parseInt(sceneStr)
                        );
                      }
                    }}
                  >
                    &larr;
                  </Button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Previous Chapter
                  </div>
                </div>
                <div className="relative group">
                  <Button
                    className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      // Find next chapter
                      const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
                      if (currentIndex < chapters.length - 1) {
                        const nextChapter = chapters[currentIndex + 1];
                        const firstScene = nextChapter.scenes[0];
                        const [, chapterStr, sceneStr] = firstScene.id.split('-');
                        
                        // Use the focusOnScene function
                        focusOnScene(
                          firstScene.id,
                          firstScene.prompt,
                          parseInt(chapterStr),
                          parseInt(sceneStr)
                        );
                      }
                    }}
                  >
                    &rarr;
                  </Button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Next Chapter
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Zoom Controls */}
      <div className="fixed bottom-8 right-8 flex flex-col space-y-3 z-50">
        <Button
          onClick={toggleZoom}
          className="w-12 h-12 rounded-full bg-white border border-gray-300 shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-100"
          title={canvasView.zoomMode === 'focused' ? 'Zoom out to see all scenes' : 'Zoom in on selected scene'}
        >
          <span className="text-black font-bold text-xl">
            {canvasView.zoomMode === 'focused' ? '-' : '+'}
          </span>
        </Button>
      </div>
      
      {/* Viewport Instructions - Only shown in overview mode */}
      {canvasView.zoomMode === 'overview' && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-5 py-2 rounded-full z-50 backdrop-blur-sm shadow-lg">
          <span>Scroll to zoom • Right-click + drag to pan • Click a scene to focus</span>
        </div>
      )}
    </div>
  );
}