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
  - **Realistic Vision v3 Inpainting** (mixinmax1990/realisitic-vision-v3-inpainting) for high-quality region replacement
  - **Instruct-Pix2Pix** (arielreplicate/instruct-pix2pix) for text-guided image editing
  - **Flux Depth Pro** (black-forest-labs/flux-depth-pro) for depth-aware image editing
  - Stability AI SDXL Inpainting for precise region replacement
  - Kandinsky 2.2 Inpainting for creative region replacement
  - MaskDino for automatic object segmentation
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
        DepthAwareEditing[Depth-Aware Editing Interface]
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
            RealisticVisionInpainting[Realistic Vision v3]
            InstructPixToPixEdit[Instruct-Pix2Pix]
            FluxDepthPro[Flux Depth Pro]
            SDXLInpainting[SDXL Inpainting]
            Kandinsky[Kandinsky 2.2 Inpainting]
            MaskDino[MaskDino Segmentation]
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
    DepthAwareEditing --> FluxDepthPro
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
    FRAMES ||--o{ DEPTH_MAPS : contains

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
    
    DEPTH_MAPS {
        uuid id PK
        uuid frame_id FK
        string depth_map_url
        string generation_model
        jsonb depth_metadata
        timestamp created_at
    }
```

## 5. Enhanced Image Editing Capabilities

### 5.1 Overview of Image Editing Features

Our application will provide a comprehensive suite of image editing capabilities through specialized AI models on Replicate:

1. **Region-Based Inpainting**
   - High-quality region replacement with Realistic Vision v3
   - Precise regional edits with SDXL Inpainting
   - Creative region replacements with Kandinsky 2.2

2. **Text-Guided Image Editing**
   - Natural language instructions to edit images with Instruct-Pix2Pix
   - Change specific attributes or elements based on text prompts
   - Preserve image structure while altering details

3. **Depth-Aware Image Editing**
   - Professional depth-aware editing with Flux Depth Pro
   - Preserve spatial relationships during edits
   - Understand and manipulate 3D space within 2D images

4. **Content-Aware Outpainting**
   - Extend image boundaries seamlessly
   - Generate surrounding context for existing images
   - Control style and content of extensions

5. **Automatic Object Segmentation**
   - AI-powered selection tools for objects with MaskDino
   - Single-click object isolation
   - Automatic mask generation for editing

### 5.2 Key Image Editing Models

#### 5.2.1 Realistic Vision v3 Inpainting

Realistic Vision v3 is specialized for photorealistic inpainting, making it ideal for seamless object removal and replacement with highly realistic results.

```typescript
// services/image-editing/realistic-vision-inpainting.ts
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface RealisticVisionInpaintingParams {
  image: string; // URL or base64
  mask: string; // URL or base64
  prompt: string;
  negative_prompt?: string;
  num_inference_steps?: number; // default: 30
  guidance_scale?: number; // default: 7.5
  strength?: number; // default: 1.0
  seed?: number;
}

export async function inpaintWithRealisticVision(params: RealisticVisionInpaintingParams): Promise<string> {
  const output = await replicate.run(
    "mixinmax1990/realisitic-vision-v3-inpainting",
    {
      input: {
        image: params.image,
        mask: params.mask,
        prompt: params.prompt,
        negative_prompt: params.negative_prompt || "ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, blurry, bad anatomy, blurred, watermark, grainy, signature, cut off, draft",
        num_inference_steps: params.num_inference_steps || 30,
        guidance_scale: params.guidance_scale || 7.5,
        strength: params.strength || 1.0,
        seed: params.seed
      }
    }
  );
  
  return output as string; // Returns image URL
}
```

#### 5.2.2 Instruct-Pix2Pix for Text-Based Image Editing

Instruct-Pix2Pix allows editing images based on natural language instructions, providing an intuitive way to make targeted changes.

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
  num_inference_steps?: number; // default: 50
  seed?: number;
}

export async function editImageWithInstructions(params: InstructPix2PixParams): Promise<string> {
  const output = await replicate.run(
    "arielreplicate/instruct-pix2pix",
    {
      input: {
        image: params.image,
        prompt: params.instruction,
        image_guidance_scale: params.image_guidance_scale || 1.5,
        guidance_scale: params.guidance_scale || 7.0,
        steps: params.num_inference_steps || 50,
        seed: params.seed
      }
    }
  );
  
  return output as string; // Returns edited image URL
}
```

#### 5.2.3 Flux Depth Pro for Depth-Aware Editing

Flux Depth Pro enables sophisticated depth-aware image editing, preserving spatial relationships for more natural-looking modifications.

```typescript
// services/image-editing/flux-depth-pro.ts
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface FluxDepthProParams {
  image: string; // URL or base64
  prompt: string;
  negative_prompt?: string;
  num_inference_steps?: number; // default: 30
  guidance_scale?: number; // default: 7.5
  strength?: number; // default: 0.8
  seed?: number;
  use_depth_control?: boolean; // default: true
  depth_strength?: number; // default: 0.5
}

export async function editWithDepthAwareness(params: FluxDepthProParams): Promise<{
  image: string;
  depth_map?: string;
}> {
  const output = await replicate.run(
    "black-forest-labs/flux-depth-pro",
    {
      input: {
        image: params.image,
        prompt: params.prompt,
        negative_prompt: params.negative_prompt || "ugly, blurry, low quality, distorted",
        num_inference_steps: params.num_inference_steps || 30,
        guidance_scale: params.guidance_scale || 7.5,
        strength: params.strength || 0.8,
        seed: params.seed,
        use_depth_control: params.use_depth_control !== undefined ? params.use_depth_control : true,
        depth_strength: params.depth_strength || 0.5,
        return_depth_map: true
      }
    }
  );
  
  return output as {
    image: string;
    depth_map?: string;
  };
}
```

### 5.3 Advanced Image Editing UI Components

#### 5.3.1 Depth-Aware Editing Interface

```tsx
// components/image-editing/depth-aware-editor.tsx
import { useState, useEffect, useRef } from 'react';
import { Slider } from '../ui/slider';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { editWithDepthAwareness } from '../../services/image-editing/flux-depth-pro';

interface DepthAwareEditorProps {
  imageUrl: string;
  onEditComplete: (editedImageUrl: string, depthMapUrl?: string) => void;
}

export function DepthAwareEditor({ imageUrl, onEditComplete }: DepthAwareEditorProps) {
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [useDepthControl, setUseDepthControl] = useState<boolean>(true);
  const [depthStrength, setDepthStrength] = useState<number>(0.5);
  const [strength, setStrength] = useState<number>(0.8);
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [depthMapUrl, setDepthMapUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Process depth-aware edit
  const handleProcessEdit = async () => {
    if (!prompt) return;
    
    setIsProcessing(true);
    
    try {
      const result = await editWithDepthAwareness({
        image: imageUrl,
        prompt,
        negative_prompt: negativePrompt,
        guidance_scale: guidanceScale,
        strength,
        use_depth_control: useDepthControl,
        depth_strength: depthStrength
      });
      
      setEditedImageUrl(result.image);
      
      if (result.depth_map) {
        setDepthMapUrl(result.depth_map);
        
        // Display depth map on canvas
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          const img = new Image();
          img.src = result.depth_map;
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
          };
        }
      }
      
      onEditComplete(result.image, result.depth_map);
    } catch (error) {
      console.error('Error processing depth-aware edit:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Original Image:</label>
            <div className="border rounded-lg overflow-hidden">
              <img src={imageUrl} alt="Original" className="w-full h-auto" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Depth Map Preview:</label>
            <div className="border rounded-lg overflow-hidden bg-gray-100">
              {depthMapUrl ? (
                <canvas ref={canvasRef} className="w-full h-auto" />
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-500">
                  <p>Depth map will appear here after processing</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Edit Instructions:</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to change, e.g., 'Change the background to a mountain landscape'"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Negative Prompt (optional):</label>
            <Input
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="E.g., 'blurry, distorted, ugly, low quality'"
            />
          </div>
          
          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="depth-control"
              checked={useDepthControl}
              onCheckedChange={setUseDepthControl}
            />
            <Label htmlFor="depth-control">Use Depth Awareness</Label>
          </div>
          
          {useDepthControl && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Depth Strength: {depthStrength}</label>
              <Slider
                min={0}
                max={1}
                step={0.05}
                value={[depthStrength]}
                onValueChange={([value]) => setDepthStrength(value)}
              />
              <div className="grid grid-cols-3 text-xs justify-between">
                <span>Low</span>
                <span className="text-center">Balanced</span>
                <span className="text-right">High</span>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Edit Strength: {strength}</label>
            <Slider
              min={0.1}
              max={1}
              step={0.05}
              value={[strength]}
              onValueChange={([value]) => setStrength(value)}
            />
            <div className="grid grid-cols-3 text-xs justify-between">
              <span>Subtle</span>
              <span className="text-center">Balanced</span>
              <span className="text-right">Major</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Guidance Scale: {guidanceScale}</label>
            <Slider
              min={1}
              max={15}
              step={0.5}
              value={[guidanceScale]}
              onValueChange={([value]) => setGuidanceScale(value)}
            />
          </div>
          
          <Button
            className="w-full mt-4"
            onClick={handleProcessEdit}
            disabled={isProcessing || !prompt}
          >
            {isProcessing ? 'Processing...' : 'Apply Depth-Aware Edit'}
          </Button>
        </div>
      </div>
      
      {editedImageUrl && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Result:</label>
          <div className="border rounded-lg overflow-hidden">
            <img src={editedImageUrl} alt="Edited Image" className="w-full h-auto" />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditedImageUrl(null)}>Try Again</Button>
            <Button onClick={() => onEditComplete(editedImageUrl, depthMapUrl || undefined)}>Accept Edit</Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### 5.3.2 Text-Guided Editing Interface

```tsx
// components/image-editing/text-guided-editor.tsx
import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { editImageWithInstructions } from '../../services/image-editing/instruct-pix2pix';

interface TextGuidedEditorProps {
  imageUrl: string;
  onEditComplete: (editedImageUrl: string) => void;
}

export function TextGuidedEditor({ imageUrl, onEditComplete }: TextGuidedEditorProps) {
  const [instruction, setInstruction] = useState<string>('');
  const [imageGuidance, setImageGuidance] = useState<number>(1.5);
  const [textGuidance, setTextGuidance] = useState<number>(7.0);
  const [steps, setSteps] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  
  const handleProcessEdit = async () => {
    if (!instruction) return;
    
    setIsProcessing(true);
    
    try {
      const result = await editImageWithInstructions({
        image: imageUrl,
        instruction,
        image_guidance_scale: imageGuidance,
        guidance_scale: textGuidance,
        num_inference_steps: steps
      });
      
      setEditedImageUrl(result);
      onEditComplete(result);
    } catch (error) {
      console.error('Error processing text-guided edit:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Examples of text instructions for users to select
  const instructionExamples = [
    "Make it look like winter with snow",
    "Turn day into night",
    "Change the red car to blue",
    "Add clouds to the sky",
    "Make the person look older",
    "Change it to an oil painting style"
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="border rounded-lg overflow-hidden mb-4">
            <img src={imageUrl} alt="Original" className="w-full h-auto" />
            <div className="p-2 bg-gray-100 text-center text-sm font-medium">Original Image</div>
          </div>
          
          {editedImageUrl && (
            <div className="border rounded-lg overflow-hidden">
              <img src={editedImageUrl} alt="Edited" className="w-full h-auto" />
              <div className="p-2 bg-gray-100 text-center text-sm font-medium">Edited Image</div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Edit Instructions:</label>
            <Textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Describe what changes to make, e.g., 'Make it look like winter with snow'"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Examples (click to use):</p>
            <div className="flex flex-wrap gap-2">
              {instructionExamples.map((example, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  size="sm"
                  onClick={() => setInstruction(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <label className="text-sm font-medium">Image Preservation: {imageGuidance}</label>
            <Slider
              min={0.5}
              max={3}
              step={0.1}
              value={[imageGuidance]}
              onValueChange={([value]) => setImageGuidance(value)}
            />
            <div className="grid grid-cols-3 text-xs justify-between">
              <span>More changes</span>
              <span className="text-center">Balanced</span>
              <span className="text-right">Preserve original</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Instruction Strength: {textGuidance}</label>
            <Slider
              min={1}
              max={15}
              step={0.5}
              value={[textGuidance]}
              onValueChange={([value]) => setTextGuidance(value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Quality (Steps): {steps}</label>
            <Slider
              min={20}
              max={100}
              step={5}
              value={[steps]}
              onValueChange={([value]) => setSteps(value)}
            />
          </div>
          
          <Button
            className="w-full mt-4"
            onClick={handleProcessEdit}
            disabled={isProcessing || !instruction}
          >
            {isProcessing ? 'Processing...' : 'Apply Text Instructions'}
          </Button>
          
          {editedImageUrl && (
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditedImageUrl(null)}>Try Again</Button>
              <Button onClick={() => onEditComplete(editedImageUrl)}>Accept Edit</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 5.4 Integrated Multi-Model Editing Service

To provide a unified interface for all our editing capabilities, we'll create a comprehensive service that selects the appropriate model based on the editing task:

```typescript
// services/image-editing/index.ts
import { inpaintWithRealisticVision, RealisticVisionInpaintingParams } from './realistic-vision-inpainting';
import { editImageWithInstructions, InstructPix2PixParams } from './instruct-pix2pix';
import { editWithDepthAwareness, FluxDepthProParams } from './flux-depth-pro';
import { inpaintWithSDXL, SDXLInpaintingParams } from './sdxl-inpainting';
import { outpaintWithSDXL, SDXLOutpaintingParams } from './sdxl-outpainting';
import { generateMaskWithDino, MaskDinoParams } from './mask-dino';

export type EditOperationType = 
  | 'inpaint-realistic' 
  | 'inpaint-standard' 
  | 'outpaint' 
  | 'text-edit' 
  | 'depth-edit' 
  | 'auto-mask';

export interface EditRequest {
  type: EditOperationType;
  imageUrl: string;
  prompt: string;
  mask?: string; // for inpainting
  instructionText?: string; // for text-edit
  paddingDirection?: 'all' | 'left' | 'right' | 'up' | 'down'; // for outpainting
  quality?: 'draft' | 'standard' | 'high'; // Influences steps and scale
  preserveOriginal?: 'low' | 'medium' | 'high'; // For depth-edit and text-edit
  additionalParams?: Record<string, any>; // For model-specific parameters
}

export interface EditResult {
  image: string; // URL to edited image
  depth_map?: string; // Optional depth map for depth-aware edits
  edit_params: Record<string, any>; // Parameters used for the edit
  model_used: string; // Name of the model used
}

export async function editImage(request: EditRequest): Promise<EditResult> {
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
  
  // Determine preservation strength for applicable modes
  let strength = 0.8;
  let imageGuidanceScale = 1.5;
  
  switch (request.preserveOriginal) {
    case 'low':
      strength = 1.0;
      imageGuidanceScale = 1.0;
      break;
    case 'high':
      strength = 0.6;
      imageGuidanceScale = 2.0;
      break;
    default: // medium
      strength = 0.8;
      imageGuidanceScale = 1.5;
  }
  
  // Process based on edit type
  switch (request.type) {
    case 'inpaint-realistic':
      if (!request.mask) throw new Error('Mask is required for inpainting');
      
      const realisticResult = await inpaintWithRealisticVision({
        image: request.imageUrl,
        mask: request.mask,
        prompt: request.prompt,
        num_inference_steps: steps,
        guidance_scale: guidanceScale,
        strength: strength,
        ...request.additionalParams
      });
      
      return {
        image: realisticResult,
        edit_params: {
          prompt: request.prompt,
          steps,
          guidance_scale: guidanceScale,
          strength
        },
        model_used: 'realistic-vision-v3-inpainting'
      };
    
    case 'inpaint-standard':
      if (!request.mask) throw new Error('Mask is required for inpainting');
      
      const sdxlResult = await inpaintWithSDXL({
        image: request.imageUrl,
        mask: request.mask,
        prompt: request.prompt,
        num_inference_steps: steps,
        guidance_scale: guidanceScale,
        ...request.additionalParams
      });
      
      return {
        image: sdxlResult,
        edit_params: {
          prompt: request.prompt,
          steps,
          guidance_scale: guidanceScale
        },
        model_used: 'sdxl-inpainting'
      };
      
    case 'outpaint':
      const outpaintResult = await outpaintWithSDXL({
        image: request.imageUrl,
        prompt: request.prompt,
        padding_direction: request.paddingDirection || 'all',
        padding_size: request.additionalParams?.padding_size || 256,
        num_inference_steps: steps,
        guidance_scale: guidanceScale
      });
      
      return {
        image: outpaintResult,
        edit_params: {
          prompt: request.prompt,
          padding_direction: request.paddingDirection,
          padding_size: request.additionalParams?.padding_size || 256,
          steps,
          guidance_scale: guidanceScale
        },
        model_used: 'sdxl-outpainting'
      };
      
    case 'text-edit':
      if (!request.instructionText) throw new Error('Instruction text is required for text-based editing');
      
      const textEditResult = await editImageWithInstructions({
        image: request.imageUrl,
        instruction: request.instructionText,
        image_guidance_scale: imageGuidanceScale,
        num_inference_steps: steps,
        guidance_scale: guidanceScale
      });
      
      return {
        image: textEditResult,
        edit_params: {
          instruction: request.instructionText,
          image_guidance_scale: imageGuidanceScale,
          steps,
          guidance_scale: guidanceScale
        },
        model_used: 'instruct-pix2pix'
      };
      
    case 'depth-edit':
      const depthEditResult = await editWithDepthAwareness({
        image: request.imageUrl,
        prompt: request.prompt,
        strength: strength,
        use_depth_control: true,
        depth_strength: request.additionalParams?.depth_strength || 0.5,
        num_inference_steps: steps,
        guidance_scale: guidanceScale
      });
      
      return {
        image: depthEditResult.image,
        depth_map: depthEditResult.depth_map,
        edit_params: {
          prompt: request.prompt,
          strength,
          depth_strength: request.additionalParams?.depth_strength || 0.5,
          steps,
          guidance_scale: guidanceScale
        },
        model_used: 'flux-depth-pro'
      };
      
    case 'auto-mask':
      if (!request.prompt) throw new Error('Text prompt is required for auto-masking');
      
      const maskResult = await generateMaskWithDino({
        image: request.imageUrl,
        text_prompt: request.prompt
      });
      
      if (maskResult.masks.length === 0) {
        throw new Error('No masks were generated for the given prompt');
      }
      
      return {
        image: maskResult.masks[0],
        edit_params: {
          text_prompt: request.prompt
        },
        model_used: 'mask-dino'
      };
      
    default:
      throw new Error(`Unsupported edit operation: ${request.type}`);
  }
}
```

### 5.5 Unified Edit Mode Selector Component

```tsx
// components/image-editing/edit-mode-selector.tsx
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TextGuidedEditor } from './text-guided-editor';
import { DepthAwareEditor } from './depth-aware-editor';
import { ManualMaskTool } from './manual-mask-tool';
import { SmartSelectionTool } from './smart-selection-tool';
import { ImageEditor } from './image-editor';
import { EditOperationType } from '../../services/image-editing';

interface EditModeSelectorProps {
  imageUrl: string;
  onEditStart: (mode: EditOperationType) => void;
  onEditComplete: (result: { image: string; depth_map?: string }) => void;
}

export function EditModeSelector({ 
  imageUrl, 
  onEditStart, 
  onEditComplete 
}: EditModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<EditOperationType | null>(null);
  
  // Select edit mode and notify parent
  const handleSelectMode = (mode: EditOperationType) => {
    setSelectedMode(mode);
    onEditStart(mode);
  };
  
  // Handle edit completion and pass result to parent
  const handleEditComplete = (editedImageUrl: string, depthMapUrl?: string) => {
    onEditComplete({
      image: editedImageUrl,
      depth_map: depthMapUrl
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Select Editing Method</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer ${selectedMode === 'text-edit' ? 'ring-2 ring-primary' : ''}`} 
          onClick={() => handleSelectMode('text-edit')}
        >
          <CardHeader>
            <CardTitle>Text-Guided Editing</CardTitle>
            <CardDescription>Edit with natural language instructions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Example: "Make it sunset", "Change the red car to blue"</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer ${selectedMode === 'depth-edit' ? 'ring-2 ring-primary' : ''}`} 
          onClick={() => handleSelectMode('depth-edit')}
        >
          <CardHeader>
            <CardTitle>Depth-Aware Editing</CardTitle>
            <CardDescription>Edit while preserving spatial relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Best for maintaining 3D structure and consistent depth</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer ${selectedMode === 'inpaint-realistic' ? 'ring-2 ring-primary' : ''}`} 
          onClick={() => handleSelectMode('inpaint-realistic')}
        >
          <CardHeader>
            <CardTitle>Realistic Inpainting</CardTitle>
            <CardDescription>Replace selected regions with photorealistic results</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Best for object removal and seamless replacements</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer ${selectedMode === 'inpaint-standard' ? 'ring-2 ring-primary' : ''}`} 
          onClick={() => handleSelectMode('inpaint-standard')}
        >
          <CardHeader>
            <CardTitle>Creative Inpainting</CardTitle>
            <CardDescription>Replace regions with artistic or stylized results</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Great for artistic modifications and style changes</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer ${selectedMode === 'outpaint' ? 'ring-2 ring-primary' : ''}`} 
          onClick={() => handleSelectMode('outpaint')}
        >
          <CardHeader>
            <CardTitle>Extend Image</CardTitle>
            <CardDescription>Add more content around your image</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Expand boundaries to create wider scenes</p>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer ${selectedMode === 'auto-mask' ? 'ring-2 ring-primary' : ''}`} 
          onClick={() => handleSelectMode('auto-mask')}
        >
          <CardHeader>
            <CardTitle>Smart Selection</CardTitle>
            <CardDescription>Automatically select objects with text</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Example: "Select the person", "Select the car"</p>
          </CardContent>
        </Card>
      </div>
      
      {selectedMode && (
        <div className="mt-8 border rounded-lg p-6">
          {selectedMode === 'text-edit' && (
            <TextGuidedEditor
              imageUrl={imageUrl}
              onEditComplete={(editedImageUrl) => handleEditComplete(editedImageUrl)}
            />
          )}
          
          {selectedMode === 'depth-edit' && (
            <DepthAwareEditor
              imageUrl={imageUrl}
              onEditComplete={(editedImageUrl, depthMapUrl) => 
                handleEditComplete(editedImageUrl, depthMapUrl)
              }
            />
          )}
          
          {(selectedMode === 'inpaint-realistic' || selectedMode === 'inpaint-standard' || selectedMode === 'outpaint') && (
            <ImageEditor
              imageUrl={imageUrl}
              editMode={selectedMode}
              onEditComplete={(editedImageUrl) => handleEditComplete(editedImageUrl)}
            />
          )}
          
          {selectedMode === 'auto-mask' && (
            <SmartSelectionTool
              imageUrl={imageUrl}
              onMaskGenerated={(maskUrl) => handleEditComplete(maskUrl)}
            />
          )}
        </div>
      )}
    </div>
  );
}
```

## 6. Implementation Strategy

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
- Implement Realistic Vision v3 for high-quality inpainting
- Build Instruct-Pix2Pix for text-guided editing
- Develop Flux Depth Pro integration for depth-aware editing
- Create manual painting tools for mask creation
- Implement MaskDino for smart object selection
- Create unified image editing service

**Key Deliverables:**
- Basic image generation capabilities
- Advanced image editing tools with multiple specialized models
- Depth-aware editing interface
- Text-guided editing interface
- Smart object selection
- Unified edit mode selector component

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

## 7. API Structure

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
    /inpaint-realistic
    /inpaint-standard
    /outpaint
    /text-edit
    /depth-edit
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

## 8. Testing Strategy

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

## 9. Deployment Plan

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

## 10. Conclusion

This comprehensive implementation plan provides a detailed roadmap for developing the AI MovieMaker application with cutting-edge AI models from Replicate. The enhanced image editing capabilities now include Realistic Vision v3 for photorealistic inpainting, Instruct-Pix2Pix for text-guided editing, and Flux Depth Pro for depth-aware image manipulation. 

These specialized models will give users advanced editing tools that preserve spatial relationships, respond to natural language instructions, and provide photorealistic results for seamless image manipulation. The unified editing interface with multiple specialized models ensures that users can select the right tool for each specific editing task, balancing between realism, creative control, and technical capabilities.