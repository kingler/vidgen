import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

export interface SceneProps {
  id: string;
  imageUrl?: string;
  prompt?: string;
  referenceImages?: string[];
  position?: { x: number; y: number };
  onEdit?: (id: string, prompt: string) => void;
  onRegenerate?: (id: string) => void;
  onDelete?: (id: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
}

/**
 * Scene - Represents a single scene in the movie editor
 * Provides functionality for displaying, editing, regenerating, and deleting scenes
 */
export const Scene: React.FC<SceneProps> = ({
  id,
  imageUrl = '',
  prompt = '',
  referenceImages = [],
  position = { x: 0, y: 0 },
  onEdit,
  onRegenerate,
  onDelete,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const [editedPrompt, setEditedPrompt] = useState(prompt);
  const [open, setOpen] = useState(false);

  // Handle prompt edit submission
  const handleSubmitEdit = () => {
    if (onEdit) {
      onEdit(id, editedPrompt);
    }
    setOpen(false);
  };

  // Handle scene regeneration
  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(id);
    }
  };

  // Handle scene deletion
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  // Handle drag events
  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart && draggable) {
      onDragStart(e, id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (onDragOver) {
      onDragOver(e);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (onDrop) {
      onDrop(e, id);
    }
  };

  return (
    <Card 
      className="w-[400px] h-[300px] absolute shadow-lg overflow-hidden group"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Delete Button - Visible on hover */}
      {onDelete && (
        <button 
          className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDelete}
          title="Delete scene"
        >
          <X size={16} />
        </button>
      )}

      {/* Scene Image */}
      <div className="relative w-full h-[200px] bg-slate-300 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={`Scene ${id}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-slate-300 text-slate-600">
            Scene will appear here
          </div>
        )}
        
        {/* Scene Actions Overlay */}
        <div className="absolute bottom-0 right-0 p-2 flex gap-1">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">Edit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Scene</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="prompt" className="text-sm font-medium">
                    Prompt
                  </label>
                  <textarea
                    id="prompt"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={editedPrompt}
                    onChange={(e) => setEditedPrompt(e.target.value)}
                    placeholder="Describe your scene..."
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Reference Images
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {referenceImages.map((img, idx) => (
                      <div key={idx} className="h-[60px] bg-slate-200 rounded overflow-hidden">
                        <img src={img} alt={`Reference ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {Array.from({ length: 4 - referenceImages.length }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="h-[60px] bg-slate-200 rounded flex items-center justify-center">
                        <span className="text-xs text-slate-500">+ Add Image</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitEdit}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="secondary" size="sm" onClick={handleRegenerate}>
            Regenerate
          </Button>
        </div>
      </div>
      
      {/* Scene Info */}
      <div className="p-3">
        <div className="text-sm font-medium mb-1">Scene {id}</div>
        <p className="text-xs text-slate-500 line-clamp-2">{prompt}</p>
      </div>
    </Card>
  );
};

export default Scene;