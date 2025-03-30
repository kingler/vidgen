# AI MovieMaker Implementation Plan

## 1. Project Overview

The AI MovieMaker is a sophisticated application that enables users to create cinematic scenes and full-length narratives through an intuitive infinite canvas editor, advanced image generation capabilities, and 3D scene reconstruction. This implementation plan outlines the approach to build a complete solution using Next.js, Shadcn UI, Tailwind CSS, Supabase, and OpenAI integration, focusing on creating a modern, sleek UX with progressive disclosure principles.

## 2. Technology Stack

- **Frontend**: 
  - Next.js (App Router)
  - Shadcn UI (latest version)
  - Tailwind CSS v4
  - React Canvas for infinite canvas
  - Framer Motion for animations
  - Fabric.js for advanced selection and in-painting tools

- **Backend**:
  - Next.js API Routes
  - Supabase PostgreSQL
  - OpenAI GPT-4o for LLM capabilities
  - OpenAI image_gen tool for image generation

- **Replicate AI Models**:
  - WavespeedAI WAN-2.1-i2v-720p/480p for image-to-video generation
  - Black Forest Labs Flux-Schnell for fast, high-quality image generation
  - Ideogram v2 Turbo for image generation with style controls
  
- **Advanced Image Editing Models**:
  - Stability AI SDXL Inpainting for precise region replacement
  - RunwayML Gen-2 Inpainting for context-aware fills
  - Instruct-Pix2Pix for text-guided image editing
  - MaskDino for automatic object segmentation
  - Kandinsky 2.2 Inpainting for creative region replacement
  - SDXL Outpainting for extending image boundaries

- **3D Reconstruction**:
  - Three.js for 3D visualization
  - CUDA/WebGL-based 3D Gaussian Splatting implementation
  - Nerfstudio for alternative 3D reconstruction techniques
  - Structure from Motion (SfM) libraries (COLMAP or OpenSfM)

- **Deployment**:
  - Digital Ocean Droplet
  - Docker containers
  - GitHub Actions for CI/CD

## 3. System Architecture

```mermaid
flowchart TD
    subgraph Frontend["Frontend (Next.js App Router)"]
        UI[Shadcn UI Components]
        Canvas[Infinite Canvas Editor]
        Timeline[Frame Timeline]
        PromptEditor[Prompt Editor]
        OnboardingFlow[Onboarding Flow]
        InPainting[Advanced Editing Tools]
        SelectionTools[Precision Selection Tools]
        ModelControls[AI Model Parameter Controls]
    end

    subgraph Backend["Backend (Next.js API Routes)"]
        APIRoutes[API Routes]
        PromptProcessor[Prompt Processor]
        SceneOrchestrator[Scene Orchestrator]
        ImageGenerator[Image Generation Service]
        VideoGenerator[Video Generation Service]
        ControlNetModule[ControlNet Integration]
        GaussianSplatting[3D Gaussian Splatting]
        RealTimeFeeback[Real-Time Feedback System]
        ImageEditingService[Image Editing Service]
    end

    subgraph ReplicateModels["Replicate AI Models"]
        subgraph GenerationModels["Generation Models"]
            WavespeedAI[WAN-2.1-i2v Models]
            FluxSchnell[Flux-Schnell]
            IdeogramTurbo[Ideogram v2 Turbo]
        end
        
        subgraph EditingModels["Editing Models"]
            SDXLInpainting[SDXL Inpainting]
            RunwayInpainting[RunwayML Inpainting]
            InstructPix2Pix[Instruct-Pix2Pix]
            MaskDino[MaskDino Segmentation]
            Kandinsky[Kandinsky 2.2 Inpainting]
            SDXLOutpainting[SDXL Outpainting]
        end
    end

    subgraph OtherExternalServices["Other External Services"]
        OpenAIAPI[OpenAI API]
        StabilityAPI[Stability AI API]
    end

    subgraph Database["Supabase (PostgreSQL)"]
        Auth[Auth]
        Projects[Projects]
        Stories[Stories]
        Scenes[Scenes]
        Frames[Frames]
        GaussianData[Gaussian Data]
        EditHistory[Edit History]
    end

    Frontend <--> Backend
    Backend <--> ReplicateModels
    Backend <--> OtherExternalServices
    Backend <--> Database
    ModelControls --> GenerationModels
    ModelControls --> EditingModels
    InPainting --> ImageEditingService
    ImageEditingService --> EditingModels
    SelectionTools --> MaskDino
```

## 4. Database Schema

The database will be implemented in Supabase PostgreSQL with the following schema:

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : owns
    PROJECTS ||--o{ STORIES : contains
    STORIES ||--o{ SCENES : consists_of
    SCENES ||--o{ FRAMES : contains
    FRAMES ||--o{ GAUSSIAN_DATA : contains
    FRAMES ||--o{ INPAINTING_DATA : contains
    FRAMES ||--o{ VIDEO_GENERATION_DATA : contains
    FRAMES ||--o{ GENERATION_PARAMS : contains
    FRAMES ||--o{ EDIT_HISTORY : tracks
    EDIT_HISTORY ||--o{ EDIT_MASK : contains

    USERS {
        uuid id PK
        string email
        string full_name
        timestamp created_at
        timestamp last_login
    }

    PROJECTS {
        uuid id PK
        uuid user_id FK
        string title
        string description
        timestamp created_at
        timestamp updated_at
    }

    STORIES {
        uuid id PK
        uuid project_id FK
        string title
        string description
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    SCENES {
        uuid id PK
        uuid story_id FK
        string prompt_seed
        int start_time
        int duration_sec
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    FRAMES {
        uuid id PK
        uuid scene_id FK
        int frame_index
        string image_url
        jsonb metadata
        jsonb reference_images
        string original_image_url
        timestamp created_at
        timestamp updated_at
    }

    GAUSSIAN_DATA {
        uuid id PK
        uuid frame_id FK
        jsonb position
        jsonb scale
        jsonb rotation
        float opacity
        jsonb sh_coefficients
        timestamp created_at
    }

    INPAINTING_DATA {
        uuid id PK
        uuid frame_id FK
        jsonb mask_data
        string original_image_url
        string edited_image_url
        jsonb edit_history
        timestamp created_at
    }

    VIDEO_GENERATION_DATA {
        uuid id PK
        uuid frame_id FK
        string source_model
        string video_url
        jsonb generation_params
        int duration_ms
        timestamp created_at
    }

    GENERATION_PARAMS {
        uuid id PK
        uuid frame_id FK
        string model_name
        jsonb params
        timestamp created_at
    }
    
    EDIT_HISTORY {
        uuid id PK
        uuid frame_id FK
        string edit_type
        string model_used
        jsonb edit_params
        string before_url
        string after_url
        timestamp created_at
    }
    
    EDIT_MASK {
        uuid id PK
        uuid edit_history_id FK
        string mask_url
        string mask_type
        jsonb mask_metadata
        timestamp created_at
    }
```

## 5. Advanced Image Editing Capabilities

### 5.1 Overview of Image Editing Features

Our application will provide a comprehensive suite of image editing capabilities through specialized AI models on Replicate:

1. **Region-Based Inpainting**
   - Replace specific regions of an image while maintaining context
   - Multiple inpainting models for different styles/needs
   - Both manual and automatic mask generation

2. **Content-Aware Outpainting**
   - Extend image boundaries seamlessly
   - Generate surrounding context for existing images
   - Control style and content of extensions

3. **Text-Guided Image Editing**
   - Modify images based on text instructions
   - Change specific attributes of objects without full regeneration
   - Preserve image structure while altering details

4. **Automatic Object Segmentation**
   - AI-powered selection tools for objects
   - Single-click object isolation
   - Automatic mask generation for editing

### 5.2 Key Image Editing Models

#### 5.2.1 Stability AI SDXL Inpainting

```typescript
// services/image-editing/sdxl-inpainting.ts
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface SDXLInpaintingParams {
  image: string; // URL or base64
  mask: string; // URL or base64
  prompt: string;
  negative_prompt?: string;
  num_inference_steps?: number; // default: 50
  guidance_scale?: number; // default: 7.5
  seed?: number;
}

export async function inpaintWithSDXL(params: SDXLInpaintingParams): Promise<string> {
  const output = await replicate.run(
    "stability-ai/sdxl-inpainting:fa9ac5b4e5e30c92d6a49a6576e1c90c115bcdce82bd86aea322e4684a7d0793",
    {
      input: {
        image: params.image,
        mask: params.mask,
        prompt: params.prompt,
        negative_prompt: params.negative_prompt || "ugly, deformed, noisily, blur, low res, low quality, text, watermark",
        num_inference_steps: params.num_inference_steps || 50,
        guidance_scale: params.guidance_scale || 7.5,
        seed: params.seed
      }
    }
  );
  
  return output as string; // Returns image URL
}
```

#### 5.2.2 Instruct-Pix2Pix for Text-Based Image Editing

```typescript
// services/image-editing/instruct-pix2pix.ts
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface InstructPix2PixParams {
  image: string; // URL or base64
  instruction: string;
  image_guidance_scale?: number; // default: 1.5
  guidance_scale?: number; // default: 7.0
  num_inference_steps?: number; // default: 100
  seed?: number;
}

export async function editImageWithInstructions(params: InstructPix2PixParams): Promise<string> {
  const output = await replicate.run(
    "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
    {
      input: {
        image: params.image,
        instruction: params.instruction,
        image_guidance_scale: params.image_guidance_scale || 1.5,
        guidance_scale: params.guidance_scale || 7.0,
        num_inference_steps: params.num_inference_steps || 100,
        seed: params.seed
      }
    }
  );
  
  return output as string; // Returns edited image URL
}
```

#### 5.2.3 MaskDino for Automatic Object Segmentation

```typescript
// services/image-editing/mask-dino.ts
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface MaskDinoParams {
  image: string; // URL or base64
  text_prompt: string;
  box_threshold?: number; // default: 0.3
  mask_threshold?: number; // default: 0.5
  return_segmented_image?: boolean; // default: true
}

export async function generateMaskWithDino(params: MaskDinoParams): Promise<{
  masks: string[];
  segmented_image?: string;
}> {
  const output = await replicate.run(
    "nielsr/mask-dino:8a40afa5daccb437e0aaf81ad85867eef30a0ddd26f2a7de0876d0f6df72be5d",
    {
      input: {
        image: params.image,
        text_prompt: params.text_prompt,
        box_threshold: params.box_threshold || 0.3,
        mask_threshold: params.mask_threshold || 0.5,
        return_segmented_image: params.return_segmented_image !== undefined ? params.return_segmented_image : true
      }
    }
  );
  
  return output as {
    masks: string[];
    segmented_image?: string;
  };
}
```

#### 5.2.4 SDXL Outpainting for Extending Images

```typescript
// services/image-editing/sdxl-outpainting.ts
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface SDXLOutpaintingParams {
  image: string; // URL or base64
  prompt: string;
  negative_prompt?: string;
  padding_size?: number; // default: 256
  padding_direction?: "left" | "right" | "up" | "down" | "all"; // default: "all"
  num_inference_steps?: number; // default: 50
  guidance_scale?: number; // default: 7.5
  seed?: number;
}

export async function outpaintWithSDXL(params: SDXLOutpaintingParams): Promise<string> {
  const output = await replicate.run(
    "hazalmohammadikusky/sdxl-outpainting:4e29552a972a610d1afece680a4df13b3c01d5dc097e10fe46877c6930c5cf17",
    {
      input: {
        image: params.image,
        prompt: params.prompt,
        negative_prompt: params.negative_prompt || "ugly, deformed, noisily, blur, low res, low quality, text, watermark",
        padding_size: params.padding_size || 256,
        padding_direction: params.padding_direction || "all",
        num_inference_steps: params.num_inference_steps || 50,
        guidance_scale: params.guidance_scale || 7.5,
        seed: params.seed
      }
    }
  );
  
  return output as string; // Returns outpainted image URL
}
```

#### 5.2.5 Kandinsky 2.2 Inpainting

```typescript
// services/image-editing/kandinsky-inpainting.ts
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface KandinskyInpaintingParams {
  image: string; // URL or base64
  mask: string; // URL or base64
  prompt: string;
  negative_prompt?: string;
  num_inference_steps?: number; // default: 50
  guidance_scale?: number; // default: 4
  seed?: number;
}

export async function inpaintWithKandinsky(params: KandinskyInpaintingParams): Promise<string> {
  const output = await replicate.run(
    "ai-forever/kandinsky-2.2-inpainting:ea1addaaf51ac67c8512e6841d9548cf3dafaf49b0d50fea3df27da4a55d3d73",
    {
      input: {
        image: params.image,
        mask: params.mask,
        prompt: params.prompt,
        negative_prompt: params.negative_prompt || "ugly, noisily, blur, low res, low quality",
        num_inference_steps: params.num_inference_steps || 50,
        guidance_scale: params.guidance_scale || 4,
        seed: params.seed
      }
    }
  );
  
  return output as string; // Returns inpainted image URL
}
```

### 5.3 Advanced Image Editing UI Components

#### 5.3.1 Smart Object Selection Tool

```tsx
// components/image-editing/smart-selection-tool.tsx
import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { generateMaskWithDino } from '../../services/image-editing/mask-dino';

interface SmartSelectionToolProps {
  imageUrl: string;
  onMaskGenerated: (maskUrl: string) => void;
}

export function SmartSelectionTool({ imageUrl, onMaskGenerated }: SmartSelectionToolProps) {
  const [objectPrompt, setObjectPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedMask, setSelectedMask] = useState<string | null>(null);
  const [availableMasks, setAvailableMasks] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const handleGenerateMask = async () => {
    setIsGenerating(true);
    
    try {
      const result = await generateMaskWithDino({
        image: imageUrl,
        text_prompt: objectPrompt,
        return_segmented_image: true
      });
      
      setAvailableMasks(result.masks);
      
      // If we got a mask, select the first one by default
      if (result.masks.length > 0) {
        setSelectedMask(result.masks[0]);
        onMaskGenerated(result.masks[0]);
      }
      
      // Display the segmented image if available
      if (result.segmented_image && canvasRef.current) {
        const img = new Image();
        img.src = result.segmented_image;
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
          }
        };
      }
    } catch (error) {
      console.error('Error generating mask:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Describe what to select:</label>
        <div className="flex gap-2">
          <Input 
            value={objectPrompt} 
            onChange={(e) => setObjectPrompt(e.target.value)} 
            placeholder="e.g., 'person', 'car', 'the red chair'"
          />
          <Button 
            onClick={handleGenerateMask} 
            disabled={!objectPrompt || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Select Object'}
          </Button>
        </div>
      </div>
      
      {isGenerating && (
        <div className="h-12 flex items-center justify-center">
          <p className="text-sm">Analyzing image and finding objects...</p>
        </div>
      )}
      
      {(availableMasks.length > 0 || selectedMask) && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Selection Preview:</label>
          <div className="relative border rounded-lg overflow-hidden" style={{ height: '300px' }}>
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>
          
          {availableMasks.length > 1 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Alternative Selections:</label>
              <div className="flex gap-2 overflow-x-auto p-2">
                {availableMasks.map((mask, index) => (
                  <div 
                    key={index}
                    className={`w-20 h-20 border rounded cursor-pointer ${selectedMask === mask ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => {
                      setSelectedMask(mask);
                      onMaskGenerated(mask);
                    }}
                  >
                    <img src={mask} className="w-full h-full object-cover" alt={`Mask ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

#### 5.3.2 Unified Image Editing Interface

```tsx
// components/image-editing/image-editor.tsx
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { SmartSelectionTool } from './smart-selection-tool';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { inpaintWithSDXL } from '../../services/image-editing/sdxl-inpainting';
import { editImageWithInstructions } from '../../services/image-editing/instruct-pix2pix';
import { outpaintWithSDXL } from '../../services/image-editing/sdxl-outpainting';
import { inpaintWithKandinsky } from '../../services/image-editing/kandinsky-inpainting';

interface ImageEditorProps {
  imageUrl: string;
  onEditComplete: (editedImageUrl: string) => void;
}

type EditingMode = 'replace' | 'extend' | 'modify';

export function ImageEditor({ imageUrl, onEditComplete }: ImageEditorProps) {
  const [editingMode, setEditingMode] = useState<EditingMode>('replace');
  const [selectedMask, setSelectedMask] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  
  // Edit settings
  const [paddingSize, setPaddingSize] = useState<number>(256);
  const [paddingDirection, setPaddingDirection] = useState<'all' | 'left' | 'right' | 'up' | 'down'>('all');
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [steps, setSteps] = useState<number>(50);
  
  const handleProcessEdit = async () => {
    setIsProcessing(true);
    
    try {
      let result = '';
      
      switch (editingMode) {
        case 'replace':
          if (!selectedMask) {
            throw new Error('Please select an area to replace first');
          }
          
          // Choose between SDXL and Kandinsky based on content
          const useSDXL = true; // This could be a user choice or automatic based on content type
          
          if (useSDXL) {
            result = await inpaintWithSDXL({
              image: imageUrl,
              mask: selectedMask,
              prompt,
              negative_prompt: negativePrompt,
              guidance_scale: guidanceScale,
              num_inference_steps: steps
            });
          } else {
            result = await inpaintWithKandinsky({
              image: imageUrl,
              mask: selectedMask,
              prompt,
              negative_prompt: negativePrompt,
              guidance_scale: guidanceScale,
              num_inference_steps: steps
            });
          }
          break;
          
        case 'extend':
          result = await outpaintWithSDXL({
            image: imageUrl,
            prompt,
            negative_prompt: negativePrompt,
            padding_size: paddingSize,
            padding_direction: paddingDirection,
            guidance_scale: guidanceScale,
            num_inference_steps: steps
          });
          break;
          
        case 'modify':
          result = await editImageWithInstructions({
            image: imageUrl,
            instruction: prompt,
            guidance_scale: guidanceScale,
            num_inference_steps: steps
          });
          break;
      }
      
      setEditedImageUrl(result);
      onEditComplete(result);
    } catch (error) {
      console.error('Error processing edit:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="replace" 
        onValueChange={(value) => setEditingMode(value as EditingMode)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="replace">Replace Region</TabsTrigger>
          <TabsTrigger value="extend">Extend Image</TabsTrigger>
          <TabsTrigger value="modify">Text-Based Edit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="replace" className="space-y-4 pt-4">
          <SmartSelectionTool 
            imageUrl={imageUrl} 
            onMaskGenerated={setSelectedMask}
          />
          
          {selectedMask && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe what to generate in the selected area:</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'a beautiful sunset over mountains'"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Negative Prompt (optional):</label>
                <Input
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="e.g., 'blurry, distorted, low quality'"
                />
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="extend" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe the extended area:</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'continue the beach scene with palm trees and ocean waves'"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Padding Size:</label>
            <Slider
              min={64}
              max={512}
              step={64}
              value={[paddingSize]}
              onValueChange={([value]) => setPaddingSize(value)}
            />
            <div className="text-xs text-right">{paddingSize}px</div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Padding Direction:</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={paddingDirection === 'left' ? 'default' : 'outline'}
                onClick={() => setPaddingDirection('left')}
              >
                Left
              </Button>
              <Button
                variant={paddingDirection === 'right' ? 'default' : 'outline'}
                onClick={() => setPaddingDirection('right')}
              >
                Right
              </Button>
              <Button
                variant={paddingDirection === 'up' ? 'default' : 'outline'}
                onClick={() => setPaddingDirection('up')}
              >
                Up
              </Button>
              <Button
                variant={paddingDirection === 'down' ? 'default' : 'outline'}
                onClick={() => setPaddingDirection('down')}
              >
                Down
              </Button>
              <Button
                variant={paddingDirection === 'all' ? 'default' : 'outline'}
                onClick={() => setPaddingDirection('all')}
                className="col-span-3"
              >
                All Directions
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="modify" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe the changes to make:</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'make it night time', 'change the red car to blue', 'add snow'"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Image Preservation Strength:</label>
            <Slider
              min={0}
              max={2}
              step={0.1}
              value={[1.5]} // Default for InstructPix2Pix
              onValueChange={([value]) => setGuidanceScale(value)}
            />
            <div className="text-xs text-right">
              {guidanceScale < 1 ? 'Low (more changes)' : guidanceScale > 1.8 ? 'High (subtle changes)' : 'Balanced'}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4 border-t pt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Quality Settings:</label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs">Generation Steps:</label>
              <Slider
                min={20}
                max={100}
                step={5}
                value={[steps]}
                onValueChange={([value]) => setSteps(value)}
              />
              <div className="text-xs text-right">{steps} steps</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs">Guidance Scale:</label>
              <Slider
                min={1}
                max={15}
                step={0.5}
                value={[guidanceScale]}
                onValueChange={([value]) => setGuidanceScale(value)}
              />
              <div className="text-xs text-right">{guidanceScale}</div>
            </div>
          </div>
        </div>
        
        <Button
          className="w-full"
          onClick={handleProcessEdit}
          disabled={isProcessing || !prompt || (editingMode === 'replace' && !selectedMask)}
        >
          {isProcessing ? 'Processing...' : 'Apply Edit'}
        </Button>
      </div>
      
      {editedImageUrl && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Result:</label>
          <div className="border rounded-lg overflow-hidden">
            <img src={editedImageUrl} alt="Edited Image" className="w-full h-auto" />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditedImageUrl(null)}>Discard</Button>
            <Button onClick={() => onEditComplete(editedImageUrl)}>Accept Edit</Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### 5.3.3 Manual Masking Tools (Paintbrush and Eraser)

```tsx
// components/image-editing/manual-mask-tool.tsx
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

interface ManualMaskToolProps {
  imageUrl: string;
  onMaskGenerated: (maskUrl: string) => void;
}

type Tool = 'brush' | 'eraser';

export function ManualMaskTool({ imageUrl, onMaskGenerated }: ManualMaskToolProps) {
  const [activeTool, setActiveTool] = useState<Tool>('brush');
  const [brushSize, setBrushSize] = useState<number>(20);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize canvases
  useEffect(() => {
    if (!imageCanvasRef.current || !maskCanvasRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const imageCanvas = imageCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      // Set canvas dimensions to match image
      const containerWidth = container.clientWidth;
      const scale = containerWidth / img.width;
      const height = img.height * scale;
      
      imageCanvas.width = containerWidth;
      imageCanvas.height = height;
      maskCanvas.width = containerWidth;
      maskCanvas.height = height;
      
      // Draw image on image canvas
      const imageCtx = imageCanvas.getContext('2d');
      imageCtx?.drawImage(img, 0, 0, containerWidth, height);
      
      // Initialize mask canvas with transparent black
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.fillStyle = 'rgba(0, 0, 0, 0)';
        maskCtx.fillRect(0, 0, containerWidth, height);
      }
    };
  }, [imageUrl]);
  
  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!maskCanvasRef.current) return;
    
    const maskCtx = maskCanvasRef.current.getContext('2d');
    if (maskCtx) {
      setIsDrawing(true);
      const rect = maskCanvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      maskCtx.beginPath();
      maskCtx.moveTo(x, y);
      
      draw(e);
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !maskCanvasRef.current) return;
    
    const maskCtx = maskCanvasRef.current.getContext('2d');
    if (maskCtx) {
      const rect = maskCanvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      maskCtx.lineWidth = brushSize;
      maskCtx.lineCap = 'round';
      
      if (activeTool === 'brush') {
        maskCtx.strokeStyle = 'rgba(255, 255, 255, 1)'; // White for mask
      } else {
        maskCtx.strokeStyle = 'rgba(0, 0, 0, 0)'; // Transparent for eraser
        maskCtx.globalCompositeOperation = 'destination-out';
      }
      
      maskCtx.lineTo(x, y);
      maskCtx.stroke();
      
      if (activeTool === 'eraser') {
        maskCtx.globalCompositeOperation = 'source-over';
      }
    }
  };
  
  const endDrawing = () => {
    if (!isDrawing || !maskCanvasRef.current) return;
    
    setIsDrawing(false);
    const maskCtx = maskCanvasRef.current.getContext('2d');
    if (maskCtx) {
      maskCtx.closePath();
      
      // Generate mask URL and send it to parent
      const maskUrl = maskCanvasRef.current.toDataURL('image/png');
      onMaskGenerated(maskUrl);
    }
  };
  
  const clearMask = () => {
    if (!maskCanvasRef.current) return;
    
    const maskCtx = maskCanvasRef.current.getContext('2d');
    if (maskCtx) {
      maskCtx.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
      
      // Generate empty mask URL and send it to parent
      const maskUrl = maskCanvasRef.current.toDataURL('image/png');
      onMaskGenerated(maskUrl);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={activeTool === 'brush' ? 'default' : 'outline'}
          onClick={() => setActiveTool('brush')}
        >
          Brush
        </Button>
        <Button
          variant={activeTool === 'eraser' ? 'default' : 'outline'}
          onClick={() => setActiveTool('eraser')}
        >
          Eraser
        </Button>
        <Button
          variant="outline"
          onClick={clearMask}
        >
          Clear Mask
        </Button>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Brush Size:</label>
        <Slider
          min={5}
          max={50}
          step={1}
          value={[brushSize]}
          onValueChange={([value]) => setBrushSize(value)}
        />
        <div className="text-xs text-right">{brushSize}px</div>
      </div>
      
      <div className="relative border rounded-lg overflow-hidden" ref={containerRef}>
        <canvas
          ref={imageCanvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
        <canvas
          ref={maskCanvasRef}
          className="absolute top-0 left-0 w-full h-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          style={{ opacity: 0.5 }}
        />
      </div>
      
      <p className="text-sm text-center">
        Paint over the areas you want to modify.
      </p>
    </div>
  );
}
```

## 6. Unified Image Editing Service

To simplify the integration of these various image editing capabilities, we'll create a unified service that automatically selects the appropriate model based on the editing task:

```typescript
// services/image-editing/index.ts
import { inpaintWithSDXL, SDXLInpaintingParams } from './sdxl-inpainting';
import { editImageWithInstructions, InstructPix2PixParams } from './instruct-pix2pix';
import { outpaintWithSDXL, SDXLOutpaintingParams } from './sdxl-outpainting';
import { inpaintWithKandinsky, KandinskyInpaintingParams } from './kandinsky-inpainting';
import { generateMaskWithDino, MaskDinoParams } from './mask-dino';

export type EditOperationType = 'inpaint' | 'outpaint' | 'text-edit' | 'auto-mask';

export interface EditRequest {
  type: EditOperationType;
  imageUrl: string;
  prompt: string;
  mask?: string; // for inpainting
  instructionText?: string; // for text-edit
  paddingDirection?: 'all' | 'left' | 'right' | 'up' | 'down'; // for outpainting
  style?: 'realistic' | 'artistic' | 'creative'; // Influences model selection
  quality?: 'draft' | 'standard' | 'high'; // Influences steps and scale
  additionalParams?: Record<string, any>; // For model-specific parameters
}

export async function editImage(request: EditRequest): Promise<string> {
  // Determine quality parameters
  let steps = 30;
  let guidanceScale = 7.5;
  
  switch (request.quality) {
    case 'draft':
      steps = 20;
      guidanceScale = 6;
      break;
    case 'high':
      steps = 50;
      guidanceScale = 8.5;
      break;
    default: // standard
      steps = 30;
      guidanceScale = 7.5;
  }
  
  // Process based on edit type
  switch (request.type) {
    case 'inpaint':
      if (!request.mask) throw new Error('Mask is required for inpainting');
      
      // Select appropriate inpainting model based on style
      if (request.style === 'artistic' || request.style === 'creative') {
        return inpaintWithKandinsky({
          image: request.imageUrl,
          mask: request.mask,
          prompt: request.prompt,
          num_inference_steps: steps,
          guidance_scale: guidanceScale,
          ...request.additionalParams
        });
      } else {
        return inpaintWithSDXL({
          image: request.imageUrl,
          mask: request.mask,
          prompt: request.prompt,
          num_inference_steps: steps,
          guidance_scale: guidanceScale,
          ...request.additionalParams
        });
      }
      
    case 'outpaint':
      return outpaintWithSDXL({
        image: request.imageUrl,
        prompt: request.prompt,
        padding_direction: request.paddingDirection || 'all',
        padding_size: request.additionalParams?.padding_size || 256,
        num_inference_steps: steps,
        guidance_scale: guidanceScale
      });
      
    case 'text-edit':
      if (!request.instructionText) throw new Error('Instruction text is required for text-based editing');
      
      return editImageWithInstructions({
        image: request.imageUrl,
        instruction: request.instructionText,
        image_guidance_scale: request.additionalParams?.image_guidance_scale || 1.5,
        num_inference_steps: steps,
        guidance_scale: guidanceScale
      });
      
    case 'auto-mask':
      if (!request.prompt) throw new Error('Text prompt is required for auto-masking');
      
      const result = await generateMaskWithDino({
        image: request.imageUrl,
        text_prompt: request.prompt
      });
      
      if (result.masks.length === 0) {
        throw new Error('No masks were generated for the given prompt');
      }
      
      return result.masks[0];
      
    default:
      throw new Error(`Unsupported edit operation: ${request.type}`);
  }
}
```

## 7. Implementation Strategy

We'll implement the AI MovieMaker application in 6 sprints, following an iterative approach:

### Sprint 1: Project Setup and Onboarding Flow (2 weeks)

**Tasks:**
- Set up Next.js project with App Router
- Configure Shadcn UI and Tailwind CSS v4
- Set up Supabase project and create database schema
- Implement authentication flow
- Create the onboarding UI workflow
- Develop initial prompt processing logic
- Implement basic OpenAI integration for text processing

**Key Deliverables:**
- Working project structure with configured technologies
- Database schema initialized in Supabase
- Authentication system
- Onboarding flow with genre, setting, character, and conflict selection

### Sprint 2: Infinite Canvas Editor - Basics (2 weeks)

**Tasks:**
- Implement infinite canvas with zooming and panning capabilities
- Create basic scene editor with preview area
- Build prompt editing component
- Develop reference image upload component
- Create timeline component for frame sequences
- Implement project and story management services
- Set up scene and frame storage in Supabase

**Key Deliverables:**
- Functional infinite canvas with navigation
- Basic scene editor interface
- Project and story management functionality
- Timeline component for managing frames

### Sprint 3: Image Generation & Advanced Editing (3 weeks)

**Tasks:**
- Integrate Replicate API for various AI models
- Implement Flux-Schnell for fast image generation
- Implement SDXL Inpainting and Kandinsky for region editing
- Build MaskDino integration for smart object selection
- Create manual painting tools for mask creation
- Implement text-based editing with InstructPix2Pix
- Set up image outpainting for boundary extension

**Key Deliverables:**
- Basic image generation capabilities
- Advanced image editing tools
- Smart object selection
- Manual mask painting tools
- Unified image editing service

### Sprint 4: Video Generation & Scene Refinement (3 weeks)

**Tasks:**
- Implement WavespeedAI WAN-2.1 for video generation
- Build video playback and editing interface
- Create scene regeneration and versioning
- Develop frame diff visualization
- Implement key frame linkage viewer
- Create branching functionality for alternate narratives
- Build real-time feedback system for generation processes

**Key Deliverables:**
- Video generation capabilities
- Scene regeneration system
- Frame difference visualization
- Real-time generation feedback
- Branching and versioning tools

### Sprint 5: 3D Reconstruction & Final Features (3 weeks)

**Tasks:**
- Implement 3D Gaussian Splatting module 
- Integrate ControlNet for image decomposition
- Develop camera and pose adjustment tools
- Create per-frame scripting interface
- Build 3D scene visualization tools
- Implement frame interpolation functionality
- Create advanced video export options
- Implement edit history and state management

**Key Deliverables:**
- 3D reconstruction capabilities
- Advanced camera and pose controls
- Frame interpolation for smoother videos
- Video export system with multiple options
- Edit history and state management

### Sprint 6: Final Integration & Deployment (2 weeks)

**Tasks:**
- Optimize performance for all components
- Conduct thorough testing of all features
- Fix bugs and address UX issues
- Implement final polish for all UI components
- Set up deployment pipeline to Digital Ocean
- Configure production environment
- Deploy the application and conduct final testing

**Key Deliverables:**
- Fully functional application with all features
- Optimized performance
- Production deployment on Digital Ocean
- Comprehensive documentation

## 8. API Structure

```
/api/
  /auth/
    /login
    /register
    /logout
    /user
  /projects/
    /[id]
    /create
    /list
  /stories/
    /[id]
    /create
    /list
  /scenes/
    /[id]
    /create
    /regenerate
    /branch
  /frames/
    /[id]
    /create
    /update
    /interpolate
  /generate/
    /image
      /flux-schnell
      /ideogram
    /video
      /wavespeed
    /prompt
  /edit/
    /inpaint
    /outpaint
    /text-edit
    /auto-mask
    /mask-generate
  /controlnet/
    /decompose
    /apply
  /gaussian-splatting/
    /initialize
    /optimize
    /render
  /real-time/
    /status
    /insights
```

## 9. Testing Strategy

1. **Unit Testing**:
   - Jest for component testing
   - Testing React hooks and utilities
   - API route testing
   - Model parameter validation

2. **Integration Testing**:
   - Testing component interactions
   - API integration testing
   - Database interaction testing
   - Replicate API integration testing

3. **End-to-End Testing**:
   - Cypress for automated UI testing
   - User flow testing
   - Cross-browser compatibility

4. **Performance Testing**:
   - Lighthouse for performance metrics
   - API response time testing
   - Image and video generation performance testing
   - 3D rendering performance testing

## 10. Deployment Plan

1. **Development Environment**:
   - Local development with Next.js dev server
   - Local Supabase instance
   - Environment variables for API keys

2. **Staging Environment**:
   - Digital Ocean Droplet
   - Docker container deployment
   - Staging Supabase project
   - CI/CD with GitHub Actions

3. **Production Environment**:
   - Digital Ocean Droplet (production)
   - Docker container with production optimizations
   - Production Supabase instance
   - Automated deployments from main branch

4. **Environment Variables**:
   ```
   # .env.example
   
   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Database
   DATABASE_URL=postgresql://postgres:your-super-secret-supabase-db-password@localhost:54322/vidgen
   
   # Authentication
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   
   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
   
   # Replicate
   REPLICATE_API_TOKEN=your-replicate-api-token
   ```

## 11. Conclusion

This comprehensive implementation plan provides a detailed roadmap for developing the AI MovieMaker application with cutting-edge AI models from Replicate. The application includes advanced image editing capabilities through models like SDXL Inpainting, Kandinsky, InstructPix2Pix, and MaskDino, allowing users to perform sophisticated edits such as region replacement, image extension, and text-guided modifications. 

The plan also includes detailed implementations for high-quality image generation with Flux-Schnell and Ideogram, and video generation with WavespeedAI. With a modern UI built on Next.js, Shadcn UI, and Tailwind CSS, the application will provide an intuitive and powerful tool for creative professionals to bring their visions to life.