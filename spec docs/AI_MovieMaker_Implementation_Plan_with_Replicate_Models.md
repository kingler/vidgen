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
  - Ideogram v2 Turbo for image generation with style controls and inpainting

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
        InPainting[In-Painting Tools]
        SelectionTools[Advanced Selection Tools]
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
    end

    subgraph ReplicateModels["Replicate AI Models"]
        WavespeedAI[WAN-2.1-i2v Models]
        FluxSchnell[Flux-Schnell]
        IdeogramTurbo[Ideogram v2 Turbo]
    end

    subgraph OtherExternalServices["Other External Services"]
        OpenAIAPI[OpenAI API]
        RunwayAPI[Runway API]
        PikaLabsAPI[Pika Labs API]
        StabilityAPI[Stability AI API]
    end

    subgraph Database["Supabase (PostgreSQL)"]
        Auth[Auth]
        Projects[Projects]
        Stories[Stories]
        Scenes[Scenes]
        Frames[Frames]
        GaussianData[Gaussian Data]
    end

    Frontend <--> Backend
    Backend <--> ReplicateModels
    Backend <--> OtherExternalServices
    Backend <--> Database
    ModelControls --> WavespeedAI
    ModelControls --> FluxSchnell
    ModelControls --> IdeogramTurbo
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
```

## 5. UI/UX Design Principles

Based on the wireframes, we'll implement a sleek, modern UI with the following principles:

1. **Progressive Disclosure**:
   - Show only essential information initially
   - Reveal more details as users interact with the application
   - Use expandable panels and contextual tooltips

2. **Infinite Canvas**:
   - Implement zooming and panning capabilities
   - Provide visual cues for navigation
   - Enable seamless transition between zoomed-in and zoomed-out views

3. **Visual Affordance**:
   - Clear visual feedback for interactive elements
   - Consistent use of colors to indicate state
   - Intuitive icons with labels

4. **Material Design Principles**:
   - Elevation and shadows for visual hierarchy
   - Consistent spacing and alignment
   - Responsive layout adapting to different screen sizes

5. **Animation and Transitions**:
   - Smooth transitions between states
   - Subtle animations for focus
   - Loading states with progress indicators

6. **Advanced Selection and Editing Tools**:
   - Photoshop-like selection tools (lasso, magic wand, marquee)
   - Edge refinement for selections
   - In-painting capabilities for selected areas

7. **Model Parameter Controls**:
   - Intuitive controls for AI model parameters
   - Presets for common configurations
   - Advanced mode for fine-tuning

## 6. Detailed Implementation of Key Replicate AI Models

### 6.1 WavespeedAI WAN-2.1-i2v Models for Image-to-Video Generation

The WAN-2.1-i2v models (available in 480p and 720p versions) will be our primary method for generating videos from images. We'll implement a comprehensive interface for these models:

#### 6.1.1 Model Integration

```typescript
// services/video-generation/wavespeed.ts
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface WavespeedVideoParams {
  prompt: string;
  image: string; // URL or base64
  num_frames?: number; // minimum: 81, maximum: 100, default: 81
  max_area?: string; // e.g., "832x480" or "1280x720" depending on model
  frames_per_second?: number; // minimum: 5, maximum: 24, default: 16
  fast_mode?: "Off" | "Balanced" | "Fast"; // default: "Balanced"
  sample_steps?: number; // minimum: 1, maximum: 40, default: 30
  sample_guide_scale?: number; // minimum: 0, maximum: 10, default: 5
  sample_shift?: number; // minimum: 1, maximum: 10, default: 3
  seed?: number; // random seed
  lora_weights?: string; // optional LoRA weights
  lora_scale?: number; // default: 1
}

export async function generateVideoWithWavespeed(
  params: WavespeedVideoParams,
  resolution: "480p" | "720p" = "720p"
): Promise<string> {
  const model = resolution === "720p" 
    ? "wavespeedai/wan-2.1-i2v-720p" 
    : "wavespeedai/wan-2.1-i2v-480p";
  
  const output = await replicate.run(
    model,
    {
      input: {
        prompt: params.prompt,
        image: params.image,
        num_frames: params.num_frames || 81,
        max_area: params.max_area || (resolution === "720p" ? "1280x720" : "832x480"),
        frames_per_second: params.frames_per_second || 16,
        fast_mode: params.fast_mode || "Balanced",
        sample_steps: params.sample_steps || 30,
        sample_guide_scale: params.sample_guide_scale || 5,
        sample_shift: params.sample_shift || 3,
        seed: params.seed,
        lora_weights: params.lora_weights,
        lora_scale: params.lora_scale || 1
      }
    }
  );
  
  return output as string; // Returns video URL
}
```

#### 6.1.2 User Interface Component

```tsx
// components/video-generation/wavespeed-controls.tsx
import { useState } from 'react';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { WavespeedVideoParams } from '../../services/video-generation/wavespeed';

interface WavespeedControlsProps {
  onParamsChange: (params: Partial<WavespeedVideoParams>) => void;
  defaultParams?: Partial<WavespeedVideoParams>;
  showAdvanced?: boolean;
}

export function WavespeedControls({ 
  onParamsChange, 
  defaultParams = {}, 
  showAdvanced = false 
}: WavespeedControlsProps) {
  const [params, setParams] = useState<Partial<WavespeedVideoParams>>({
    num_frames: 81,
    frames_per_second: 16,
    fast_mode: "Balanced",
    sample_steps: 30,
    sample_guide_scale: 5,
    sample_shift: 3,
    ...defaultParams
  });
  
  const handleChange = (key: keyof WavespeedVideoParams, value: any) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onParamsChange(newParams);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Frames Per Second</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <InfoCircledIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <p className="text-sm">Controls how smooth your video will be. Higher values create smoother motion but may require more processing time.</p>
            </PopoverContent>
          </Popover>
        </div>
        <Slider
          min={5}
          max={24}
          step={1}
          value={[params.frames_per_second || 16]}
          onValueChange={([value]) => handleChange('frames_per_second', value)}
        />
        <div className="text-xs text-right">{params.frames_per_second} fps</div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Generation Mode</label>
        <Select 
          value={params.fast_mode || "Balanced"} 
          onValueChange={(value) => handleChange('fast_mode', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Off">Quality Mode (Slower)</SelectItem>
            <SelectItem value="Balanced">Balanced Mode</SelectItem>
            <SelectItem value="Fast">Fast Mode (Lower Quality)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {showAdvanced && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Number of Frames</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <InfoCircledIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <p className="text-sm">81 frames give the best results. Higher values create longer videos but may affect quality.</p>
                </PopoverContent>
              </Popover>
            </div>
            <Slider
              min={81}
              max={100}
              step={1}
              value={[params.num_frames || 81]}
              onValueChange={([value]) => handleChange('num_frames', value)}
            />
            <div className="text-xs text-right">{params.num_frames} frames</div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sample Steps</label>
            <Slider
              min={1}
              max={40}
              step={1}
              value={[params.sample_steps || 30]}
              onValueChange={([value]) => handleChange('sample_steps', value)}
            />
            <div className="text-xs text-right">{params.sample_steps} steps</div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Guidance Scale</label>
            <Slider
              min={0}
              max={10}
              step={0.1}
              value={[params.sample_guide_scale || 5]}
              onValueChange={([value]) => handleChange('sample_guide_scale', value)}
            />
            <div className="text-xs text-right">{params.sample_guide_scale}</div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sample Shift</label>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[params.sample_shift || 3]}
              onValueChange={([value]) => handleChange('sample_shift', value)}
            />
            <div className="text-xs text-right">{params.sample_shift}</div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Seed (optional)</label>
            <Input
              type="number"
              value={params.seed || ''}
              onChange={(e) => handleChange('seed', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Random seed"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">LoRA Weights (optional)</label>
            <Input
              value={params.lora_weights || ''}
              onChange={(e) => handleChange('lora_weights', e.target.value)}
              placeholder="e.g., fofr/flux-pixar-cars"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">LoRA Scale</label>
            <Slider
              min={0}
              max={2}
              step={0.1}
              value={[params.lora_scale || 1]}
              onValueChange={([value]) => handleChange('lora_scale', value)}
            />
            <div className="text-xs text-right">{params.lora_scale}</div>
          </div>
        </>
      )}
    </div>
  );
}
```

### 6.2 Flux-Schnell Model for Fast Image Generation

The Flux-Schnell model from Black Forest Labs will be used for rapid, high-quality image generation.

#### 6.2.1 Model Integration

```typescript
// services/image-generation/flux-schnell.ts
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface FluxSchnellParams {
  prompt: string;
  aspect_ratio?: string; // default: "1:1"
  num_outputs?: number; // minimum: 1, maximum: 4, default: 1
  num_inference_steps?: number; // minimum: 1, maximum: 4, default: 4
  seed?: number;
  output_format?: "webp" | "jpg" | "png"; // default: "webp"
  output_quality?: number; // minimum: 0, maximum: 100, default: 80
  disable_safety_checker?: boolean; // default: false
  go_fast?: boolean; // default: true
  megapixels?: string; // default: "1"
}

export async function generateImageWithFluxSchnell(
  params: FluxSchnellParams
): Promise<string[]> {
  const output = await replicate.run(
    "black-forest-labs/flux-schnell",
    {
      input: {
        prompt: params.prompt,
        aspect_ratio: params.aspect_ratio || "1:1",
        num_outputs: params.num_outputs || 1,
        num_inference_steps: params.num_inference_steps || 4,
        seed: params.seed,
        output_format: params.output_format || "webp",
        output_quality: params.output_quality || 80,
        disable_safety_checker: params.disable_safety_checker || false,
        go_fast: params.go_fast !== undefined ? params.go_fast : true,
        megapixels: params.megapixels || "1"
      }
    }
  );
  
  return output as string[]; // Returns array of image URLs
}
```

#### 6.2.2 User Interface Component

```tsx
// components/image-generation/flux-schnell-controls.tsx
import { useState } from 'react';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { FluxSchnellParams } from '../../services/image-generation/flux-schnell';

interface FluxSchnellControlsProps {
  onParamsChange: (params: Partial<FluxSchnellParams>) => void;
  defaultParams?: Partial<FluxSchnellParams>;
}

export function FluxSchnellControls({ 
  onParamsChange, 
  defaultParams = {} 
}: FluxSchnellControlsProps) {
  const [params, setParams] = useState<Partial<FluxSchnellParams>>({
    aspect_ratio: "1:1",
    num_outputs: 1,
    num_inference_steps: 4,
    output_format: "webp",
    output_quality: 80,
    go_fast: true,
    megapixels: "1",
    ...defaultParams
  });
  
  const handleChange = (key: keyof FluxSchnellParams, value: any) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onParamsChange(newParams);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Aspect Ratio</label>
        <Select 
          value={params.aspect_ratio || "1:1"} 
          onValueChange={(value) => handleChange('aspect_ratio', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select aspect ratio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1:1">Square (1:1)</SelectItem>
            <SelectItem value="4:3">Standard (4:3)</SelectItem>
            <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
            <SelectItem value="9:16">Portrait (9:16)</SelectItem>
            <SelectItem value="3:2">Photo (3:2)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Number of Outputs</label>
        <Slider
          min={1}
          max={4}
          step={1}
          value={[params.num_outputs || 1]}
          onValueChange={([value]) => handleChange('num_outputs', value)}
        />
        <div className="text-xs text-right">{params.num_outputs} image(s)</div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Inference Steps</label>
        <Slider
          min={1}
          max={4}
          step={1}
          value={[params.num_inference_steps || 4]}
          onValueChange={([value]) => handleChange('num_inference_steps', value)}
        />
        <div className="text-xs text-right">{params.num_inference_steps} steps</div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Output Format</label>
        <Select 
          value={params.output_format || "webp"} 
          onValueChange={(value: "webp" | "jpg" | "png") => handleChange('output_format', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webp">WebP (Recommended)</SelectItem>
            <SelectItem value="jpg">JPEG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {(params.output_format === "webp" || params.output_format === "jpg") && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Output Quality</label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[params.output_quality || 80]}
            onValueChange={([value]) => handleChange('output_quality', value)}
          />
          <div className="text-xs text-right">{params.output_quality}%</div>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Switch
          id="go-fast"
          checked={params.go_fast !== undefined ? params.go_fast : true}
          onCheckedChange={(checked) => handleChange('go_fast', checked)}
        />
        <Label htmlFor="go-fast">Optimize for speed (recommended)</Label>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Image Size</label>
        <Select 
          value={params.megapixels || "1"} 
          onValueChange={(value) => handleChange('megapixels', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.5">Small (0.5MP)</SelectItem>
            <SelectItem value="1">Medium (1MP)</SelectItem>
            <SelectItem value="2">Large (2MP)</SelectItem>
            <SelectItem value="4">Extra Large (4MP)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Seed (optional)</label>
        <Input
          type="number"
          value={params.seed || ''}
          onChange={(e) => handleChange('seed', e.target.value ? parseInt(e.target.value) : undefined)}
          placeholder="Random seed"
        />
      </div>
    </div>
  );
}
```

### 6.3 Ideogram v2 Turbo for Stylized Image Generation with Inpainting

The Ideogram v2 Turbo model will be used for generating stylized images and for inpainting capabilities.

#### 6.3.1 Model Integration

```typescript
// services/image-generation/ideogram.ts
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export interface IdeogramParams {
  prompt: string;
  negative_prompt?: string;
  aspect_ratio?: string; // default: "1:1"
  resolution?: string; // default: "None"
  magic_prompt_option?: "Auto" | "Disabled"; // default: "Auto"
  image?: string; // for inpainting, URL or base64
  mask?: string; // for inpainting, URL or base64
  style_type?: string; // default: "None"
  seed?: number;
}

export async function generateImageWithIdeogram(
  params: IdeogramParams
): Promise<string> {
  const output = await replicate.run(
    "ideogram-ai/ideogram-v2-turbo",
    {
      input: {
        prompt: params.prompt,
        negative_prompt: params.negative_prompt,
        aspect_ratio: params.aspect_ratio || "1:1",
        resolution: params.resolution || "None",
        magic_prompt_option: params.magic_prompt_option || "Auto",
        image: params.image, // Optional for inpainting
        mask: params.mask, // Optional for inpainting
        style_type: params.style_type || "None",
        seed: params.seed
      }
    }
  );
  
  return output as string; // Returns image URL
}

// Function specifically for inpainting
export async function inpaintWithIdeogram(
  imageUrl: string,
  maskUrl: string,
  prompt: string,
  options: Partial<IdeogramParams> = {}
): Promise<string> {
  return generateImageWithIdeogram({
    prompt,
    image: imageUrl,
    mask: maskUrl,
    ...options
  });
}
```

#### 6.3.2 User Interface Component

```tsx
// components/image-generation/ideogram-controls.tsx
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { IdeogramParams } from '../../services/image-generation/ideogram';

interface IdeogramControlsProps {
  onParamsChange: (params: Partial<IdeogramParams>) => void;
  defaultParams?: Partial<IdeogramParams>;
  showInpaintingControls?: boolean;
}

export function IdeogramControls({ 
  onParamsChange, 
  defaultParams = {},
  showInpaintingControls = false
}: IdeogramControlsProps) {
  const [params, setParams] = useState<Partial<IdeogramParams>>({
    aspect_ratio: "1:1",
    magic_prompt_option: "Auto",
    style_type: "None",
    ...defaultParams
  });
  
  const handleChange = (key: keyof IdeogramParams, value: any) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onParamsChange(newParams);
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Aspect Ratio</label>
            <Select 
              value={params.aspect_ratio || "1:1"} 
              onValueChange={(value) => handleChange('aspect_ratio', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">Square (1:1)</SelectItem>
                <SelectItem value="4:3">Standard (4:3)</SelectItem>
                <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                <SelectItem value="3:2">Photo (3:2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Style Type</label>
            <Select 
              value={params.style_type || "None"} 
              onValueChange={(value) => handleChange('style_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">Default</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="illustration">Illustration</SelectItem>
                <SelectItem value="photographic">Photographic</SelectItem>
                <SelectItem value="painting">Painting</SelectItem>
                <SelectItem value="3d_art">3D Art</SelectItem>
                <SelectItem value="pixel_art">Pixel Art</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Negative Prompt (Optional)</label>
            <Textarea
              value={params.negative_prompt || ""}
              onChange={(e) => handleChange('negative_prompt', e.target.value)}
              placeholder="What you don't want to see in the image"
              rows={3}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="magic-prompt"
              checked={params.magic_prompt_option !== "Disabled"}
              onCheckedChange={(checked) => handleChange('magic_prompt_option', checked ? "Auto" : "Disabled")}
            />
            <Label htmlFor="magic-prompt">Enable Magic Prompt</Label>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Resolution (Optional)</label>
            <Input
              value={params.resolution || ""}
              onChange={(e) => handleChange('resolution', e.target.value)}
              placeholder="e.g., 1024x1024"
            />
            <p className="text-xs text-gray-500">Leave empty to use aspect ratio</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Seed (Optional)</label>
            <Input
              type="number"
              value={params.seed || ""}
              onChange={(e) => handleChange('seed', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Random seed"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {showInpaintingControls && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Inpainting Controls</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <Button variant="outline" className="mb-2">Upload Image</Button>
                <p className="text-xs text-gray-500">or drag and drop</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Mask</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <Button variant="outline" className="mb-2">Upload Mask</Button>
                <p className="text-xs text-gray-500">Black areas will be replaced</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 6.4 Unified Model Selector Component

To make it easy for users to choose between different models, we'll create a unified model selector component:

```tsx
// components/ai-models/model-selector.tsx
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { WavespeedControls } from '../video-generation/wavespeed-controls';
import { FluxSchnellControls } from '../image-generation/flux-schnell-controls';
import { IdeogramControls } from '../image-generation/ideogram-controls';
import type { WavespeedVideoParams } from '../../services/video-generation/wavespeed';
import type { FluxSchnellParams } from '../../services/image-generation/flux-schnell';
import type { IdeogramParams } from '../../services/image-generation/ideogram';

interface ModelSelectorProps {
  onVideoModelSelect: (modelName: string, params: Partial<WavespeedVideoParams>) => void;
  onImageModelSelect: (modelName: string, params: Partial<FluxSchnellParams | IdeogramParams>) => void;
  initialTab?: 'image' | 'video';
}

export function ModelSelector({ 
  onVideoModelSelect, 
  onImageModelSelect, 
  initialTab = 'image' 
}: ModelSelectorProps) {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>(initialTab);
  const [activeImageModel, setActiveImageModel] = useState<'flux' | 'ideogram'>('flux');
  const [activeVideoModel, setActiveVideoModel] = useState<'wavespeed-720p' | 'wavespeed-480p'>('wavespeed-720p');
  
  // State for params
  const [wavespeedParams, setWavespeedParams] = useState<Partial<WavespeedVideoParams>>({});
  const [fluxParams, setFluxParams] = useState<Partial<FluxSchnellParams>>({});
  const [ideogramParams, setIdeogramParams] = useState<Partial<IdeogramParams>>({});
  
  // Handle selecting image model
  const handleImageModelSelect = () => {
    if (activeImageModel === 'flux') {
      onImageModelSelect('flux-schnell', fluxParams);
    } else {
      onImageModelSelect('ideogram-v2-turbo', ideogramParams);
    }
  };
  
  // Handle selecting video model
  const handleVideoModelSelect = () => {
    onVideoModelSelect(
      activeVideoModel === 'wavespeed-720p' ? 'wavespeedai/wan-2.1-i2v-720p' : 'wavespeedai/wan-2.1-i2v-480p', 
      wavespeedParams
    );
  };
  
  return (
    <div className="w-full">
      <Tabs 
        defaultValue={initialTab} 
        onValueChange={(value) => setActiveTab(value as 'image' | 'video')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image">Image Generation</TabsTrigger>
          <TabsTrigger value="video">Video Generation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="image" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className={`cursor-pointer ${activeImageModel === 'flux' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setActiveImageModel('flux')}>
              <CardHeader>
                <CardTitle>Flux-Schnell</CardTitle>
                <CardDescription>Fast, high-quality image generation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Optimized for speed with good quality results</p>
              </CardContent>
            </Card>
            
            <Card className={`cursor-pointer ${activeImageModel === 'ideogram' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setActiveImageModel('ideogram')}>
              <CardHeader>
                <CardTitle>Ideogram v2 Turbo</CardTitle>
                <CardDescription>Stylized images & inpainting</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Great for detailed images with style controls</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 border rounded-lg p-4">
            {activeImageModel === 'flux' ? (
              <FluxSchnellControls 
                onParamsChange={setFluxParams}
                defaultParams={fluxParams}
              />
            ) : (
              <IdeogramControls 
                onParamsChange={setIdeogramParams}
                defaultParams={ideogramParams}
                showInpaintingControls={false}
              />
            )}
          </div>
          
          <Button className="w-full" onClick={handleImageModelSelect}>
            Select Image Model
          </Button>
        </TabsContent>
        
        <TabsContent value="video" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className={`cursor-pointer ${activeVideoModel === 'wavespeed-720p' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setActiveVideoModel('wavespeed-720p')}>
              <CardHeader>
                <CardTitle>WAN-2.1 720p</CardTitle>
                <CardDescription>HD video generation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Best quality with 1280x720 resolution</p>
              </CardContent>
            </Card>
            
            <Card className={`cursor-pointer ${activeVideoModel === 'wavespeed-480p' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setActiveVideoModel('wavespeed-480p')}>
              <CardHeader>
                <CardTitle>WAN-2.1 480p</CardTitle>
                <CardDescription>Standard video generation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Faster generation with 832x480 resolution</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 border rounded-lg p-4">
            <WavespeedControls 
              onParamsChange={setWavespeedParams}
              defaultParams={wavespeedParams}
              showAdvanced={true}
            />
          </div>
          
          <Button className="w-full" onClick={handleVideoModelSelect}>
            Select Video Model
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
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

### Sprint 3: AI Model Integration (2 weeks)

**Tasks:**
- Integrate Replicate API for various AI models
- Implement Flux-Schnell for fast image generation
- Set up Ideogram v2 Turbo for stylized images
- Build WavespeedAI WAN-2.1 integration for video generation
- Create unified model selector component
- Implement parameter controls for all models
- Build real-time feedback system for generation processes

**Key Deliverables:**
- Working integration with multiple Replicate models
- Unified model selection interface
- Parameter controls for fine-tuning generation
- Real-time feedback during generation

### Sprint 4: Advanced Editing Tools (2 weeks)

**Tasks:**
- Implement Photoshop-like selection tools using Fabric.js
- Build in-painting functionality with Ideogram v2 Turbo
- Create masking tools for image editing
- Develop frame diff visualization
- Implement continuity checking system
- Build key frame linkage viewer
- Create branching functionality for alternate narratives

**Key Deliverables:**
- Advanced image editing tools
- In-painting capabilities
- Scene branching and versioning
- Continuity checking system

### Sprint 5: 3D Reconstruction & Advanced Features (3 weeks)

**Tasks:**
- Implement 3D Gaussian Splatting module
- Integrate ControlNet for image decomposition
- Develop camera and pose adjustment tools
- Create per-frame scripting interface
- Build 3D scene visualization tools
- Implement frame interpolation functionality
- Create advanced video export options

**Key Deliverables:**
- 3D reconstruction capabilities
- Advanced camera and pose controls
- Frame interpolation for smoother videos
- Video export system with multiple options

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
    /enhance
    /mask
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

This comprehensive implementation plan provides a detailed roadmap for developing the AI MovieMaker application using cutting-edge AI models from Replicate, including WavespeedAI WAN-2.1-i2v for video generation, Flux-Schnell for fast image generation, and Ideogram v2 Turbo for stylized images and inpainting. The application will feature a modern UI with progressive disclosure principles, advanced editing tools, and 3D reconstruction capabilities, all while providing an intuitive and engaging user experience.