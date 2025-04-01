import React from 'react';
import { X } from 'lucide-react';

interface TimelineSceneProps {
  id: string;
  title: string;
  isActive: boolean;
  imageUrl?: string;
  onClick: () => void;
  onDelete?: () => void;
  // Drag and drop props
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

/**
 * TimelineScene - A scene thumbnail in the timeline
 * Includes drag and drop functionality for reordering scenes
 */
export const TimelineScene: React.FC<TimelineSceneProps> = ({
  id,
  title,
  isActive,
  imageUrl,
  onClick,
  onDelete,
  draggable = true,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (onDelete) {
      onDelete();
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      e.dataTransfer.setData('scene-id', id);
      onDragStart(e);
    }
  };

  return (
    <div
      className="relative h-16 w-24 flex-shrink-0 cursor-pointer flex items-center justify-center group rounded-md overflow-hidden"
      style={{
        background: 'black',
        borderRadius: '0.375rem',
        border: isActive ? '2px solid #FFCC00' : '1px solid rgba(0, 0, 0, 0.2)',
        boxShadow: isActive ? '0 0 10px rgba(255, 204, 0, 0.3)' : 'none'
      }}
      onClick={onClick}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Scene thumbnail or placeholder */}
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover opacity-70" 
        />
      ) : null}
      
      {/* Scene title */}
      <span className="text-xs text-white z-10 px-1 text-center">{title}</span>
      
      {/* Delete button - improved visibility */}
      {onDelete && (
        <button
          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 transform hover:scale-110"
          onClick={handleDelete}
          title="Delete scene"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

export default TimelineScene; 