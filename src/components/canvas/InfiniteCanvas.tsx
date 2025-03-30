import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface InfiniteCanvasProps {
  children?: React.ReactNode;
}

/**
 * InfiniteCanvas - The main component for the movie editor's canvas
 * Provides zooming, panning, and scene management functionality
 */
export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({ children }) => {
  // State for canvas transformations
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Handle zooming
  const handleZoom = (zoomIn: boolean) => {
    setScale(prevScale => {
      const newScale = zoomIn 
        ? Math.min(prevScale * 1.2, 5) // Zoom in (max 5x)
        : Math.max(prevScale / 1.2, 0.2); // Zoom out (min 0.2x)
      return newScale;
    });
  };
  
  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle mouse move for panning
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setPosition(prevPos => ({
      x: prevPos.x + dx,
      y: prevPos.y + dy
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // Handle mouse up to stop panning
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listener to handle mouse up outside the canvas
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);
  
  // Reset canvas view
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Canvas Controls */}
      <div className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-800">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleZoom(true)}>
            Zoom In
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleZoom(false)}>
            Zoom Out
          </Button>
          <Button variant="outline" size="sm" onClick={resetView}>
            Reset View
          </Button>
        </div>
        <div>
          <span className="text-sm text-slate-500">Zoom: {Math.round(scale * 100)}%</span>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div 
        className="relative flex-grow overflow-hidden bg-slate-200 dark:bg-slate-900"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={canvasRef}
      >
        {/* Transformable Canvas Content */}
        <div 
          className="absolute origin-center transition-transform duration-100 ease-linear"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfiniteCanvas;