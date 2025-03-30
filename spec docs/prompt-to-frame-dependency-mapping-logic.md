# Prompt to Frame Dependency Mapping Logic

```mermaid
flowchart TD
  Prompt[User Prompt Input] --> Tokenize[Tokenize Prompt]
  Tokenize --> AnalyzeIntent[Analyze Narrative + Visual Intent]
  
  AnalyzeIntent -->|Subject Entities| SubjectMap[Map to Subject Agent]
  AnalyzeIntent -->|Actions / Poses| PoseMap[Map to Pose Agent]
  AnalyzeIntent -->|Scene Style| StyleMap[Map to Stylization Agent]
  AnalyzeIntent -->|Lighting / Mood| LightMap[Map to Lighting Agent]
  AnalyzeIntent -->|Temporal / Motion| CameraMap[Map to Camera Agent]
  
  SubjectMap --> FrameData[Generate Frame Metadata]
  PoseMap --> FrameData
  StyleMap --> FrameData
  LightMap --> FrameData
  CameraMap --> FrameData
  
  FrameData --> FrameGen[Render Initial Key Frame]

  FrameGen --> Propagate[Propagate Constraints to Next Frames]
  Propagate --> FrameSeq[Generate Frame Sequence with Interpolations]

  FrameSeq --> OutputFrames([Output Final Frame Strip])

 ``` 


 ## What this maps:
	•	Prompt analysis → broken into components (subject, style, motion, etc.)
	•	Specialized agents interpret and transform components
	•	Each contributes metadata that informs the initial keyframe
	•	Constraints and styles are then propagated across frames
	•	Output is a consistent, animated strip derived from a single prompt