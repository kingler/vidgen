'use client';

import React from 'react';

interface GridBackgroundCanvasProps {
  children: React.ReactNode;
}

/**
 * Renders an infinite canvas with grid dots pattern
 * For use in the editor to provide visual cues for placement
 */
export const GridBackgroundCanvas: React.FC<GridBackgroundCanvasProps> = ({ children }) => {
  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      style={{
        background: '#f8f8f8', // Very light gray, almost white
        backgroundImage: `
          radial-gradient(circle, #cccccc 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0',
      }}
    >
      {children}
    </div>
  );
};

export default GridBackgroundCanvas;