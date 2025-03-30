'use client';

import React, { useState } from 'react';

interface ImageVideoContainerProps {
  imageUrl?: string;
  videoUrl?: string;
  isGenerating: boolean; 
  prompt: string;
  onRegenerateImage: () => void;
  onGenerateVideo: () => void;
  onPromptChange: (newPrompt: string) => void;
}

/**
 * Container that handles both image and video states
 * Provides smooth transition between states and UI for prompt editing
 */
export const ImageVideoContainer: React.FC<ImageVideoContainerProps> = ({
  imageUrl,
  videoUrl,
  isGenerating,
  prompt,
  onRegenerateImage,
  onGenerateVideo,
  onPromptChange
}) => {
  const [isVideoMode, setIsVideoMode] = useState(!!videoUrl);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [temporaryPrompt, setTemporaryPrompt] = useState(prompt);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [editMode, setEditMode] = useState<'none' | 'inpainting' | 'outpainting' | 'enhancement'>('none');
  
  // Switch to video mode when videoUrl becomes available
  React.useEffect(() => {
    if (videoUrl) {
      setIsVideoMode(true);
    }
  }, [videoUrl]);
  
  // Handle prompt editing
  const handleSavePrompt = () => {
    onPromptChange(temporaryPrompt);
    setIsEditingPrompt(false);
  };
  
  // Handle drag and drop of reference images
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).slice(0, 4); // Max 4 images
      
      // Process each file
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setReferenceImages(prev => [...prev.slice(0, 3), e.target?.result as string]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };
  
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      {/* Main image/video container */}
      <div 
        className="relative w-full" 
        style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
      >
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black rounded-md overflow-hidden"
          style={{ borderRadius: '5px' }}
        >
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center text-white">
              <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-sm">
                {isVideoMode ? 'Generating video...' : 'Generating image...'}
              </div>
            </div>
          ) : (
            <>
              {/* Show video if in video mode and videoUrl exists */}
              {isVideoMode && videoUrl ? (
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full h-full object-contain"
                />
              ) : (
                /* Show image if imageUrl exists, otherwise show placeholder */
                imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="Generated scene" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-white/50 text-sm">
                    Scene will be generated here
                  </div>
                )
              )}
              
              {/* Edit mode overlay if an edit mode is active */}
              {editMode !== 'none' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-lg font-medium">
                    {editMode === 'inpainting' ? 'InPainting Mode' : 
                     editMode === 'outpainting' ? 'OutPainting Mode' : 'Enhancement Mode'}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Editing toolbar */}
      <div className="flex justify-between items-center mt-3 text-sm">
        <div className="text-gray-500">Editing:</div>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded ${editMode === 'inpainting' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setEditMode(editMode === 'inpainting' ? 'none' : 'inpainting')}
          >
            InPainting
          </button>
          <button 
            className={`px-3 py-1 rounded ${editMode === 'outpainting' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setEditMode(editMode === 'outpainting' ? 'none' : 'outpainting')}
          >
            OutPainting
          </button>
          <button 
            className={`px-3 py-1 rounded ${editMode === 'enhancement' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setEditMode(editMode === 'enhancement' ? 'none' : 'enhancement')}
          >
            Enhancement
          </button>
        </div>
      </div>
      
      {/* Prompt and reference images section */}
      <div 
        className="mt-4 grid grid-cols-4 gap-3 border border-gray-200 p-4 rounded"
        style={{ borderRadius: '5px' }}
      >
        {/* Prompt editor - takes 3 columns or full width if no reference images */}
        <div className={`${referenceImages.length > 0 ? 'col-span-3' : 'col-span-4'}`}>
          {isEditingPrompt ? (
            <div className="space-y-2">
              <textarea
                value={temporaryPrompt}
                onChange={(e) => setTemporaryPrompt(e.target.value)}
                className="w-full h-20 p-2 border border-gray-300 rounded text-sm"
                placeholder="Describe or modify your scene prompt..."
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setTemporaryPrompt(prompt);
                    setIsEditingPrompt(false);
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePrompt}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="p-2 border border-gray-100 rounded bg-gray-50 text-gray-800 text-sm min-h-[5rem] cursor-text"
              onClick={() => setIsEditingPrompt(true)}
            >
              {prompt || 'Click to add a prompt...'}
            </div>
          )}
        </div>
        
        {/* Reference images section - takes 1 column */}
        {referenceImages.length > 0 ? (
          <div className="col-span-1">
            <div className="grid grid-cols-2 gap-2">
              {referenceImages.map((img, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square bg-gray-100 rounded overflow-hidden"
                >
                  <img src={img} alt={`Reference ${index + 1}`} className="w-full h-full object-cover" />
                  <button 
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    onClick={() => setReferenceImages(prev => prev.filter((_, i) => i !== index))}
                  >
                    ×
                  </button>
                </div>
              ))}
              {Array.from({ length: 4 - referenceImages.length }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square bg-gray-100 rounded-sm opacity-50 flex items-center justify-center text-xs text-gray-400">
                  Ref {referenceImages.length + index + 1}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div 
            className="col-span-1 hidden md:flex items-center justify-center border border-dashed border-gray-300 rounded p-2 text-gray-400 text-xs"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            Drag & Drop Images Here (up to 4)
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={onRegenerateImage}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Regenerate
        </button>
        
        <button
          onClick={onGenerateVideo}
          disabled={isGenerating || !imageUrl}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          Generate Video
        </button>
      </div>
    </div>
  );
};

export default ImageVideoContainer;