import React from 'react';
import { Plus } from 'lucide-react';

interface SceneAddButtonsProps {
  // Add scene between existing scenes
  onAddBetweenScenes?: (sceneBeforeId: string, sceneAfterId: string) => void;
  // Add scene to the end of a chapter
  onAddToChapter?: (chapterId: string) => void;
  // Add a new chapter between existing chapters
  onAddBetweenChapters?: (chapterBeforeId: string, chapterAfterId: string) => void;
  
  sceneBeforeId?: string;
  sceneAfterId?: string;
  chapterId?: string;
  chapterBeforeId?: string;
  chapterAfterId?: string;
  
  type: 'between-scenes' | 'end-of-chapter' | 'between-chapters';
}

/**
 * SceneAddButtons - Buttons for adding new scenes or chapters
 * Appears on hover in between scenes, at the end of chapters, or between chapters
 */
export const SceneAddButtons: React.FC<SceneAddButtonsProps> = ({
  onAddBetweenScenes,
  onAddToChapter,
  onAddBetweenChapters,
  sceneBeforeId,
  sceneAfterId,
  chapterId,
  chapterBeforeId,
  chapterAfterId,
  type
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling
    
    switch (type) {
      case 'between-scenes':
        if (onAddBetweenScenes && sceneBeforeId && sceneAfterId) {
          onAddBetweenScenes(sceneBeforeId, sceneAfterId);
        }
        break;
      case 'end-of-chapter':
        if (onAddToChapter && chapterId) {
          onAddToChapter(chapterId);
        }
        break;
      case 'between-chapters':
        if (onAddBetweenChapters && chapterBeforeId && chapterAfterId) {
          onAddBetweenChapters(chapterBeforeId, chapterAfterId);
        }
        break;
    }
  };

  const buttonClass = "opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:scale-110 transform";
  let containerClass = "";
  let title = "";
  
  switch (type) {
    case 'between-scenes':
      containerClass = "absolute top-[-12px] left-1/2 transform -translate-x-1/2 flex items-center justify-center z-30 w-8 h-8";
      title = "Add scene between";
      break;
    case 'end-of-chapter':
      containerClass = "absolute bottom-0 left-1/2 transform -translate-x-1/2 h-12 flex items-center justify-center w-full z-30";
      title = "Add scene to chapter";
      break;
    case 'between-chapters':
      containerClass = "absolute top-1/2 transform -translate-y-1/2 w-16 flex items-center justify-center h-full z-30";
      title = "Add new chapter";
      break;
  }

  return (
    <div className={containerClass}>
      <button
        className={`${buttonClass} bg-black/80 hover:bg-black text-white rounded-full p-2 shadow-md hover:shadow-lg`}
        onClick={handleClick}
        title={title}
      >
        <Plus size={type === 'between-chapters' ? 20 : 16} />
      </button>
    </div>
  );
};

export default SceneAddButtons; 