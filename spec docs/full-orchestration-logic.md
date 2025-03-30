# Full Orchestration Logic

This flow maps:
	•	ControlNet layer selection and preprocessing
	•	Prompt conditioning and refinement
	•	Per-frame scripting (camera, subject)
	•	Frame-by-frame orchestration for animation consistency

```mermaid
flowchart TD
    Start([Scene Frame Input]) --> ApplyControlNet[Apply ControlNet Behavior]
    
    ApplyControlNet --> ControlType{Select Control Type}
    ControlType -->|Pose| PoseModule[Pose Detection + Keypoints]
    ControlType -->|Depth| DepthMap[Depth Estimation]
    ControlType -->|Edge| EdgeMap[Line Detection / Scribble]

    PoseModule --> RefinePrompt
    DepthMap --> RefinePrompt
    EdgeMap --> RefinePrompt

    RefinePrompt[Incorporate Control Map + Refined Prompt] --> ScriptStep[Check Scripting Rules]
    
    ScriptStep -->|Camera Move| AnimateCamera[Apply Pan / Zoom / Angle]
    ScriptStep -->|Subject Move| AdjustSubject[Reposition Character / Object]

    AnimateCamera --> RenderFrame[Render Frame Output]
    AdjustSubject --> RenderFrame

    RenderFrame --> NextFrame{More Frames?}
    NextFrame -->|Yes| ApplyControlNet
    NextFrame -->|No| Done([Animation Sequence Complete])
```
