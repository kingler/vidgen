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

- **Image-to-Video Technologies**:
  - Runway Gen-2 (video generation from images)
  - Stability AI Stable Video Diffusion
  - Replicate's WaveSpeedAI WAN-2.1-i2v-720p model
  - Pika Labs video generation API
  - Google's Lumiere video generation model (when available)

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
    end

    subgraph Backend["Backend (Next.js API Routes)"]
        APIRoutes[API Routes]
        PromptProcessor[Prompt Processor]
        SceneOrchestrator[Scene Orchestrator]
        ImageGenerator[OpenAI Image Generation]
        VideoGenerator[Multi-Model Video Generation]
        ControlNetModule[ControlNet Integration]
        GaussianSplatting[3D Gaussian Splatting]
        RealTimeFeeback[Real-Time Feedback System]
    end

    subgraph ExternalServices["External Services"]
        OpenAIAPI[OpenAI API]
        ReplicateAPI[Replicate API]
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
    Backend <--> ExternalServices
    Backend <--> Database
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

## 6. Component Structure

### Frontend Components

```mermaid
classDiagram
    class RootLayout {
        +Header
        +Sidebar
        +MainContent
        +Footer
    }
    
    class OnboardingFlow {
        +WelcomeStep
        +GenreSelectionStep
        +SettingPromptStep
        +ProtagonistPromptStep
        +AntagonistStep
        +ToneThemeStep
        +VisualStyleStep
        +ReviewGenerateStep
    }
    
    class InfiniteCanvas {
        +ZoomedOutView
        +ZoomedInView
        +NavigationControls
        +SceneNodes
    }
    
    class SceneEditor {
        +ScenePreview
        +PromptEditor
        +ActionToolbar
        +ReferenceImages
        +TimelineStrip
    }
    
    class FrameTimeline {
        +FrameStrip
        +KeyframeMarkers
        +TimeControls
        +AddFrameButton
    }
    
    class ControlNetInterface {
        +LayerControls
        +ScriptingPanel
        +PoseAdjustments
        +ParameterSettings
    }
    
    class InPaintingTools {
        +SelectionTools
        +BrushTools
        +MaskGenerationTools
        +PromptBasedEditing
    }
    
    class VideoGenerationControls {
        +ModelSelector
        +ParameterControls
        +PreviewPlayer
        +ExportOptions
    }
    
    class RealtimeFeedback {
        +ProgressIndicator
        +StatusMessages
        +GenerationInsights
        +AIFeedback
    }
    
    RootLayout --> OnboardingFlow
    RootLayout --> InfiniteCanvas
    InfiniteCanvas --> SceneEditor
    SceneEditor --> FrameTimeline
    SceneEditor --> ControlNetInterface
    SceneEditor --> InPaintingTools
    SceneEditor --> VideoGenerationControls
    SceneEditor --> RealtimeFeedback
```

### Backend Services

```mermaid
classDiagram
    class AuthService {
        +signup()
        +login()
        +logout()
        +getCurrentUser()
    }
    
    class ProjectService {
        +createProject()
        +getProject()
        +updateProject()
        +deleteProject()
        +listProjects()
    }
    
    class StoryService {
        +createStory()
        +getStory()
        +updateStory()
        +deleteStory()
        +listStories()
    }
    
    class SceneService {
        +createScene()
        +getScene()
        +updateScene()
        +regenerateScene()
        +branchScene()
        +listScenes()
    }
    
    class FrameService {
        +createFrame()
        +getFrame()
        +updateFrame()
        +interpolateFrames()
        +listFrames()
    }
    
    class ImageGenerationService {
        +generateImage()
        +enhanceImage()
        +processReferenceImage()
        +inpaintImage()
    }
    
    class VideoGenerationService {
        +generateWithRunway()
        +generateWithReplicate()
        +generateWithPikaLabs()
        +generateWithStability()
        +interpolateFrames()
    }
    
    class ControlNetService {
        +decomposeImage()
        +applyControlNet()
        +getLayerData()
    }
    
    class GaussianSplattingService {
        +initializeGaussians()
        +optimizeParameters()
        +renderScene()
    }
    
    class RealTimeFeedbackService {
        +startGenerationStream()
        +updateGenerationStatus()
        +getGenerationInsights()
        +provideAIFeedback()
    }
    
    AuthService --> ProjectService
    ProjectService --> StoryService
    StoryService --> SceneService
    SceneService --> FrameService
    SceneService --> ImageGenerationService
    ImageGenerationService --> ControlNetService
    ImageGenerationService --> VideoGenerationService
    ControlNetService --> GaussianSplattingService
    ImageGenerationService --> RealTimeFeedbackService
    VideoGenerationService --> RealTimeFeedbackService
    GaussianSplattingService --> RealTimeFeedbackService
```

## 7. Detailed Implementation of Key Features

### 7.1 3D Gaussian Splatting Implementation

The 3D Gaussian Splatting module will be implemented with the following components:

1. **Structure from Motion (SfM) Integration**:
   - Utilize COLMAP or OpenSfM for estimating camera parameters and sparse point cloud from images
   - Store camera parameters (intrinsics, extrinsics) for consistent 3D reconstruction
   - Provide API endpoints for uploading multiple views of a scene

2. **3D Gaussian Initialization and Optimization**:
   ```typescript
   // lib/gaussian-splatting/initialization.ts
   export interface GaussianPoint {
     position: [number, number, number]; // [x, y, z]
     scale: [number, number, number]; // [scale_x, scale_y, scale_z]
     rotation: [number, number, number, number]; // quaternion [w, x, y, z]
     opacity: number;
     shCoefficients: number[]; // Spherical Harmonics coefficients
   }

   export function initializeGaussians(
     sfmPoints: { position: [number, number, number] }[]
   ): GaussianPoint[] {
     return sfmPoints.map(point => ({
       position: point.position,
       scale: [0.1, 0.1, 0.1], // Initial isotropic scale
       rotation: [1, 0, 0, 0], // Identity quaternion
       opacity: 0.5,
       shCoefficients: new Array(9).fill(0) // Initial SH coefficients
     }));
   }
   ```

3. **WebGL/CUDA Renderer**:
   - Implement a WebGL-based renderer for client-side visualization
   - For high-performance requirements, use CUDA via a server-side rendering service
   - Tile-based rasterization for efficient rendering of thousands of Gaussians

4. **Optimization Pipeline**:
   - Implement loss function combining L1 and D-SSIM (structural similarity)
   - Optimize position, scale, rotation, opacity, and SH coefficients through gradient descent
   - Apply adaptive density control for detailed regions

5. **Integration with UI**:
   - Real-time scene visualization with camera controls
   - Progress feedback during optimization
   - Export optimized Gaussians for reuse

6. **Example Implementation Code**:
   ```typescript
   // lib/gaussian-splatting/optimizer.ts
   export async function optimizeGaussians(
     initialGaussians: GaussianPoint[],
     referenceImages: { imageUrl: string, cameraParams: CameraParams }[],
     optimizationConfig: OptimizationConfig
   ): Promise<GaussianPoint[]> {
     // Initialize optimization state
     let gaussians = [...initialGaussians];
     let iteration = 0;
     
     while (iteration < optimizationConfig.maxIterations) {
       // For each reference view
       for (const ref of referenceImages) {
         // 1. Forward render (project Gaussians to 2D)
         const renderedImage = renderGaussians(gaussians, ref.cameraParams);
         
         // 2. Compute loss against reference image
         const loss = computeLoss(renderedImage, ref.imageUrl);
         
         // 3. Backpropagate gradients
         const gradients = computeGradients(loss, gaussians);
         
         // 4. Update Gaussian parameters
         gaussians = updateParameters(gaussians, gradients, optimizationConfig.learningRate);
         
         // 5. Apply adaptive density control
         if (iteration % optimizationConfig.densityControlInterval === 0) {
           gaussians = adaptiveDensityControl(gaussians);
         }
       }
       
       iteration++;
       
       // Report progress
       reportProgress(iteration, optimizationConfig.maxIterations, computeMetrics(gaussians));
     }
     
     return gaussians;
   }
   ```

7. **WebWorker Implementation**:
   - Offload heavy computations to background threads
   - Use SharedArrayBuffer for efficient memory sharing between UI and computation threads
   - Handle browser limitations with fallbacks

### 7.2 Multiple Image-to-Video Generation Techniques

We'll implement a comprehensive suite of image-to-video generation techniques:

1. **Model Integrations**:

   a. **Runway Gen-2**:
   ```typescript
   // services/video-generation/runway.ts
   import axios from 'axios';

   export async function generateVideoWithRunway(
     imageUrl: string, 
     prompt: string,
     options = { numFrames: 24, fps: 8 }
   ) {
     const response = await axios.post(
       'https://api.runwayml.com/v1/generate',
       {
         model: 'gen-2',
         input: {
           image: imageUrl,
           prompt,
           num_frames: options.numFrames,
           fps: options.fps
         }
       },
       {
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`
         }
       }
     );
     
     return response.data.output.video;
   }
   ```

   b. **Replicate's WAN-2.1-i2v-720p**:
   ```typescript
   // services/video-generation/replicate.ts
   import Replicate from 'replicate';

   const replicate = new Replicate({
     auth: process.env.REPLICATE_API_TOKEN,
   });

   export async function generateVideoWithReplicate(
     imageUrl: string,
     prompt: string,
     options = { numFrames: 81, fps: 16 }
   ) {
     const output = await replicate.run(
       "wavespeedai/wan-2.1-i2v-720p",
       {
         input: {
           image: imageUrl,
           prompt,
           max_area: "1280x720",
           num_frames: options.numFrames,
           sample_shift: 8,
           sample_steps: 30,
           frames_per_second: options.fps,
           sample_guide_scale: 6
         }
       }
     );
     
     return output;
   }
   ```

   c. **Stability AI's Stable Video Diffusion**:
   ```typescript
   // services/video-generation/stability.ts
   import axios from 'axios';

   export async function generateVideoWithStability(
     imageUrl: string,
     options = { motionBucketId: 127, fps: 24 }
   ) {
     const response = await axios.post(
       'https://api.stability.ai/v2beta/stable-video-diffusion/generate',
       {
         image: imageUrl,
         motion_bucket_id: options.motionBucketId,
         fps: options.fps
       },
       {
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
         }
       }
     );
     
     return response.data.video;
   }
   ```

   d. **Pika Labs API**:
   ```typescript
   // services/video-generation/pika.ts
   import axios from 'axios';

   export async function generateVideoWithPika(
     imageUrl: string,
     prompt: string,
     options = { duration: 4 }
   ) {
     const response = await axios.post(
       'https://api.pika.art/v1/generate',
       {
         input_image: imageUrl,
         prompt,
         duration: options.duration
       },
       {
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${process.env.PIKA_API_KEY}`
         }
       }
     );
     
     return response.data.output.video_url;
   }
   ```

2. **Model Selection Algorithm**:
   ```typescript
   // services/video-generation/model-selector.ts
   export interface ModelCapabilities {
     motionQuality: number; // 1-10
     fidelity: number; // 1-10
     speed: number; // 1-10
     styleAdaptability: number; // 1-10
     maxResolution: [number, number];
   }

   export interface ModelSelector {
     models: {
       [key: string]: ModelCapabilities;
     };
     
     selectModel(criteria: {
       prioritizeQuality?: boolean;
       prioritizeSpeed?: boolean;
       minResolution?: [number, number];
       stylePreference?: string;
     }): string;
   }

   export const videoModelSelector: ModelSelector = {
     models: {
       'runway': {
         motionQuality: 9,
         fidelity: 8,
         speed: 4,
         styleAdaptability: 9,
         maxResolution: [1024, 576]
       },
       'replicate-wan': {
         motionQuality: 8,
         fidelity: 7,
         speed: 6,
         styleAdaptability: 8,
         maxResolution: [1280, 720]
       },
       'stability': {
         motionQuality: 7,
         fidelity: 9,
         speed: 5,
         styleAdaptability: 7,
         maxResolution: [1024, 576]
       },
       'pika': {
         motionQuality: 8,
         fidelity: 8,
         speed: 3,
         styleAdaptability: 9,
         maxResolution: [1280, 720]
       }
     },
     
     selectModel(criteria) {
       // Default criteria
       const { 
         prioritizeQuality = false, 
         prioritizeSpeed = false,
         minResolution = [512, 512],
         stylePreference = 'balanced'
       } = criteria;
       
       // Filter models that meet minimum resolution
       const validModels = Object.entries(this.models)
         .filter(([_, capabilities]) => 
           capabilities.maxResolution[0] >= minResolution[0] && 
           capabilities.maxResolution[1] >= minResolution[1]
         );
       
       // Score models based on criteria
       const scoredModels = validModels.map(([name, capabilities]) => {
         let score = 0;
         
         if (prioritizeQuality) {
           score += capabilities.fidelity * 2;
           score += capabilities.motionQuality * 2;
         } else if (prioritizeSpeed) {
           score += capabilities.speed * 3;
         } else {
           // Balanced approach
           score += capabilities.fidelity;
           score += capabilities.motionQuality;
           score += capabilities.speed;
         }
         
         // Style adaptability bonus for style-focused work
         if (stylePreference === 'artistic') {
           score += capabilities.styleAdaptability * 1.5;
         }
         
         return { name, score };
       });
       
       // Sort by score and return best model
       scoredModels.sort((a, b) => b.score - a.score);
       return scoredModels[0]?.name || 'replicate-wan'; // Default fallback
     }
   };
   ```

3. **Universal Video Generation Service**:
   ```typescript
   // services/video-generation/index.ts
   import { generateVideoWithRunway } from './runway';
   import { generateVideoWithReplicate } from './replicate';
   import { generateVideoWithStability } from './stability';
   import { generateVideoWithPika } from './pika';
   import { videoModelSelector } from './model-selector';

   export async function generateVideo(
     imageUrl: string,
     prompt: string,
     options = {
       prioritizeQuality: false,
       prioritizeSpeed: false,
       minResolution: [512, 512] as [number, number],
       stylePreference: 'balanced',
       numFrames: 24,
       fps: 8
     }
   ) {
     // Select the best model based on criteria
     const selectedModel = videoModelSelector.selectModel({
       prioritizeQuality: options.prioritizeQuality,
       prioritizeSpeed: options.prioritizeSpeed,
       minResolution: options.minResolution,
       stylePreference: options.stylePreference
     });
     
     // Generate video with the selected model
     switch (selectedModel) {
       case 'runway':
         return generateVideoWithRunway(imageUrl, prompt, {
           numFrames: options.numFrames,
           fps: options.fps
         });
       case 'replicate-wan':
         return generateVideoWithReplicate(imageUrl, prompt, {
           numFrames: options.numFrames,
           fps: options.fps
         });
       case 'stability':
         return generateVideoWithStability(imageUrl, {
           fps: options.fps
         });
       case 'pika':
         return generateVideoWithPika(imageUrl, prompt, {
           duration: options.numFrames / options.fps
         });
       default:
         throw new Error(`Unknown video generation model: ${selectedModel}`);
     }
   }
   ```

### 7.3 Advanced In-Painting Tools

We'll implement Photoshop-like selection and in-painting tools using Fabric.js:

1. **Selection Tools Implementation**:
   ```typescript
   // components/in-painting/selection-tools.tsx
   import { useEffect, useRef } from 'react';
   import { fabric } from 'fabric';

   interface SelectionToolsProps {
     canvas: fabric.Canvas | null;
     onSelectionCreated: (mask: ImageData) => void;
   }

   export function SelectionTools({ canvas, onSelectionCreated }: SelectionToolsProps) {
     const activeToolRef = useRef<'lasso' | 'rectangle' | 'ellipse' | 'wand' | null>(null);
     
     // Create a lasso (freeform) selection tool
     const enableLassoTool = () => {
       if (!canvas) return;
       
       activeToolRef.current = 'lasso';
       canvas.isDrawingMode = true;
       canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
       canvas.freeDrawingBrush.width = 3;
       canvas.freeDrawingBrush.color = '#ff0000';
       
       // When drawing is complete, convert to selection
       canvas.on('path:created', (e) => {
         const path = e.path;
         // Convert path to selection area
         const selectionPath = new fabric.Path(path.path, {
           fill: 'rgba(0,0,0,0.3)',
           stroke: '#0000ff',
           strokeWidth: 2
         });
         
         canvas.remove(path);
         canvas.add(selectionPath);
         canvas.setActiveObject(selectionPath);
         
         // Create mask from selection
         const mask = createMaskFromPath(selectionPath, canvas);
         onSelectionCreated(mask);
       });
     };
     
     // Create a magic wand selection based on color similarity
     const enableMagicWandTool = () => {
       if (!canvas) return;
       
       activeToolRef.current = 'wand';
       canvas.isDrawingMode = false;
       
       // When canvas is clicked
       canvas.on('mouse:down', (opt) => {
         const pointer = canvas.getPointer(opt.e);
         const x = Math.round(pointer.x);
         const y = Math.round(pointer.y);
         
         // Get pixel data at click position
         const context = canvas.getContext();
         const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
         const targetColor = getPixelColor(imageData, x, y);
         
         // Use flood fill algorithm to select similar colors
         const mask = floodFill(imageData, x, y, targetColor, 20);
         onSelectionCreated(mask);
         
         // Visualize selection
         visualizeSelection(canvas, mask);
       });
     };
     
     // Helper functions for selection tools
     const createMaskFromPath = (path: fabric.Path, canvas: fabric.Canvas) => {
       // Implementation that converts a path to an image mask
       // ...
     };
     
     const getPixelColor = (imageData: ImageData, x: number, y: number) => {
       // Implementation to get pixel color at x,y
       // ...
     };
     
     const floodFill = (imageData: ImageData, x: number, y: number, targetColor: number[], tolerance: number) => {
       // Flood fill algorithm implementation
       // ...
     };
     
     const visualizeSelection = (canvas: fabric.Canvas, mask: ImageData) => {
       // Visualize the selection on the canvas
       // ...
     };
     
     return (
       <div className="selection-tools">
         <button onClick={enableLassoTool}>Lasso Tool</button>
         <button onClick={() => { /* Rectangle selection */ }}>Rectangle Select</button>
         <button onClick={() => { /* Ellipse selection */ }}>Ellipse Select</button>
         <button onClick={enableMagicWandTool}>Magic Wand</button>
         <div className="tool-options">
           {activeToolRef.current === 'wand' && (
             <div>
               <label>Tolerance:</label>
               <input type="range" min="0" max="100" defaultValue="20" />
             </div>
           )}
         </div>
       </div>
     );
   }
   ```

2. **In-Painting Service**:
   ```typescript
   // services/image-generation/in-painting.ts
   import axios from 'axios';

   export async function inpaintImage(
     imageUrl: string,
     maskDataUrl: string,
     prompt: string
   ) {
     // OpenAI in-painting implementation
     const response = await fetch('https://api.openai.com/v1/images/edits', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
       },
       body: JSON.stringify({
         image: imageUrl,
         mask: maskDataUrl,
         prompt,
         n: 1,
         size: '1024x1024',
       }),
     });
     
     const data = await response.json();
     return data.data[0].url;
   }
   
   // Alternative implementation using Replicate for in-painting
   export async function inpaintWithReplicate(
     imageUrl: string,
     maskDataUrl: string,
     prompt: string
   ) {
     const replicate = new Replicate({
       auth: process.env.REPLICATE_API_TOKEN,
     });
     
     const output = await replicate.run(
       "stability-ai/sdxl-inpainting:fa9ac5b4e5e30c92d6a49a6576e1c90c115bcdce82bd86aea322e4684a7d0793",
       {
         input: {
           image: imageUrl,
           mask: maskDataUrl,
           prompt,
           negative_prompt: "ugly, deformed, broken",
           num_inference_steps: 50,
           guidance_scale: 7.5,
         }
       }
     );
     
     return output;
   }
   ```

3. **In-Painting Component**:
   ```tsx
   // components/in-painting/in-painting-editor.tsx
   import { useEffect, useRef, useState } from 'react';
   import { fabric } from 'fabric';
   import { SelectionTools } from './selection-tools';
   import { inpaintImage, inpaintWithReplicate } from '../../services/image-generation/in-painting';

   interface InPaintingEditorProps {
     imageUrl: string;
     onEditComplete: (newImageUrl: string) => void;
   }

   export function InPaintingEditor({ imageUrl, onEditComplete }: InPaintingEditorProps) {
     const canvasRef = useRef<HTMLCanvasElement>(null);
     const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
     const [selectionMask, setSelectionMask] = useState<ImageData | null>(null);
     const [prompt, setPrompt] = useState('');
     const [isProcessing, setIsProcessing] = useState(false);
     
     // Initialize Fabric.js canvas
     useEffect(() => {
       if (canvasRef.current) {
         const canvas = new fabric.Canvas(canvasRef.current, {
           width: 800,
           height: 600
         });
         
         // Load the image to edit
         fabric.Image.fromURL(imageUrl, (img) => {
           // Scale image to fit canvas
           const scale = Math.min(
             canvas.width / img.width,
             canvas.height / img.height
           );
           
           img.scale(scale);
           canvas.add(img);
           canvas.centerObject(img);
           canvas.renderAll();
         });
         
         setFabricCanvas(canvas);
         
         return () => {
           canvas.dispose();
         };
       }
     }, [imageUrl]);
     
     // Handle selection creation
     const handleSelectionCreated = (mask: ImageData) => {
       setSelectionMask(mask);
     };
     
     // Handle in-painting request
     const handleInPaint = async () => {
       if (!selectionMask || !prompt) return;
       
       setIsProcessing(true);
       
       try {
         // Convert mask to data URL
         const maskDataUrl = maskToDataURL(selectionMask);
         
         // Call in-painting service
         const newImageUrl = await inpaintImage(imageUrl, maskDataUrl, prompt);
         
         // Update the original image
         onEditComplete(newImageUrl);
       } catch (error) {
         console.error('In-painting failed:', error);
         // Show error to user
       } finally {
         setIsProcessing(false);
       }
     };
     
     // Convert ImageData mask to a data URL
     const maskToDataURL = (mask: ImageData) => {
       const tempCanvas = document.createElement('canvas');
       tempCanvas.width = mask.width;
       tempCanvas.height = mask.height;
       
       const ctx = tempCanvas.getContext('2d');
       ctx.putImageData(mask, 0, 0);
       
       return tempCanvas.toDataURL('image/png');
     };
     
     return (
       <div className="in-painting-editor">
         <div className="canvas-container">
           <canvas ref={canvasRef} />
         </div>
         
         <div className="tools-panel">
           <SelectionTools 
             canvas={fabricCanvas} 
             onSelectionCreated={handleSelectionCreated} 
           />
           
           <div className="prompt-panel">
             <textarea
               placeholder="Describe what should replace the selected area..."
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
             />
           </div>
           
           <button 
             onClick={handleInPaint}
             disabled={!selectionMask || !prompt || isProcessing}
           >
             {isProcessing ? 'Processing...' : 'Apply In-Painting'}
           </button>
         </div>
       </div>
     );
   }
   ```

### 7.4 Real-Time Feedback System

We'll implement a real-time feedback system to keep users informed during generation processes:

```typescript
// components/real-time-feedback/generation-status.tsx
import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/use-socket';

interface GenerationStatusProps {
  generationId: string;
  onComplete: (result: any) => void;
}

export function GenerationStatus({ generationId, onComplete }: GenerationStatusProps) {
  const [status, setStatus] = useState('initializing');
  const [progress, setProgress] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const socket = useSocket();
  
  useEffect(() => {
    if (!socket || !generationId) return;
    
    // Subscribe to generation updates
    socket.emit('subscribe', { generationId });
    
    // Listen for status updates
    socket.on('generation:status', (data) => {
      if (data.generationId === generationId) {
        setStatus(data.status);
      }
    });
    
    // Listen for progress updates
    socket.on('generation:progress', (data) => {
      if (data.generationId === generationId) {
        setProgress(data.progress);
      }
    });
    
    // Listen for AI insights
    socket.on('generation:insights', (data) => {
      if (data.generationId === generationId) {
        setInsights(prev => [...prev, data.insight]);
      }
    });
    
    // Listen for completion
    socket.on('generation:complete', (data) => {
      if (data.generationId === generationId) {
        onComplete(data.result);
      }
    });
    
    return () => {
      socket.emit('unsubscribe', { generationId });
      socket.off('generation:status');
      socket.off('generation:progress');
      socket.off('generation:insights');
      socket.off('generation:complete');
    };
  }, [socket, generationId, onComplete]);
  
  return (
    <div className="generation-status">
      <div className="status-indicator">
        <span className={`status-badge ${status}`}>{status}</span>
        {status !== 'complete' && status !== 'error' && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      
      {insights.length > 0 && (
        <div className="ai-insights">
          <h4>AI Working Notes:</h4>
          <ul>
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## 8. Implementation Strategy

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

### Sprint 3: Image Generation & Enhancement (2 weeks)

**Tasks:**
- Integrate OpenAI image generation capabilities
- Implement prompt-to-image pipeline
- Create image enhancement options
- Build frame sequence generation logic
- Develop initial scene regeneration mechanism
- Implement image metadata storage
- Create basic feedback system for generation results

**Key Deliverables:**
- Working image generation from prompts
- Image enhancement capabilities
- Storage system for generated images
- Basic regeneration functionality

### Sprint 4: Scene Refinement & Advanced Editing (2 weeks)

**Tasks:**
- Implement detailed scene regeneration logic
- Build key frame linkage viewer
- Develop frame diff visualization
- Create branching functionality for alternate narratives
- Implement continuity checking system
- Build in-painting tools with Photoshop-like selection capabilities
- Implement real-time feedback system for editing operations

**Key Deliverables:**
- Complete scene regeneration system
- Frame difference visualization
- Branching capability for narratives
- Continuity checking mechanism
- Advanced in-painting tools

### Sprint 5: Video Generation & 3D Reconstruction (3 weeks)

**Tasks:**
- Integrate multiple video generation models (Runway, Replicate, Stability AI, Pika)
- Build model selection algorithm based on user preferences
- Implement ControlNet for image decomposition
- Develop initial 3D Gaussian Splatting module
- Create camera and pose adjustment tools
- Build 3D scene visualization tools
- Implement frame interpolation for smoother animations

**Key Deliverables:**
- Multi-model video generation system
- Layer decomposition with ControlNet
- Basic 3D reconstruction capabilities
- Camera and pose adjustment interface
- Frame interpolation functionality

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

## 9. API Structure

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
    /video
    /prompt
  /edit/
    /inpaint
    /enhance
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

## 10. Testing Strategy

1. **Unit Testing**:
   - Jest for component testing
   - Testing React hooks and utilities
   - API route testing

2. **Integration Testing**:
   - Testing component interactions
   - API integration testing
   - Database interaction testing

3. **End-to-End Testing**:
   - Cypress for automated UI testing
   - User flow testing
   - Cross-browser compatibility

4. **Performance Testing**:
   - Lighthouse for performance metrics
   - API response time testing
   - Image and video generation performance testing

## 11. Deployment Plan

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
   
   # Video Generation
   REPLICATE_API_TOKEN=your-replicate-api-token
   RUNWAY_API_KEY=your-runway-api-key
   STABILITY_API_KEY=your-stability-api-key
   PIKA_API_KEY=your-pika-api-key
   ```

## 12. Conclusion

This comprehensive implementation plan provides a roadmap for developing the AI MovieMaker application with cutting-edge technologies and a focus on modern UI/UX design principles. The application will leverage multiple AI models for image and video generation, provide sophisticated in-painting capabilities with Photoshop-like selection tools, and offer 3D scene reconstruction through Gaussian Splatting techniques. With real-time feedback and a sleek, intuitive interface, users will be able to create compelling visual narratives with minimal technical expertise.