import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface TimelineItem {
  id: string;
  imageUrl?: string;
  isSelected?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  onItemClick?: (id: string) => void;
  onAddScene?: () => void;
}

/**
 * Timeline - Displays a horizontal scrollable timeline of scene thumbnails
 * Provides navigation between scenes and ability to add new scenes
 */
export const Timeline: React.FC<TimelineProps> = ({
  items = [],
  onItemClick,
  onAddScene
}) => {
  const handleItemClick = (id: string) => {
    if (onItemClick) {
      onItemClick(id);
    }
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {items.map((item) => (
          <Card 
            key={item.id}
            className={`flex-shrink-0 w-24 h-16 cursor-pointer transition-all overflow-hidden
                       ${item.isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
            onClick={() => handleItemClick(item.id)}
          >
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={`Scene ${item.id}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-xs text-slate-500 dark:text-slate-400">{item.id}</span>
              </div>
            )}
          </Card>
        ))}
        
        {/* Add Scene Button */}
        <Button 
          variant="outline" 
          className="flex-shrink-0 w-24 h-16 flex flex-col items-center justify-center"
          onClick={onAddScene}
        >
          <span className="text-2xl">+</span>
          <span className="text-xs">Add Scene</span>
        </Button>
      </div>
    </div>
  );
};

export default Timeline;