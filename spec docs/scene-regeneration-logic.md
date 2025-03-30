# Scene Regeneration Logic Flow

```mermaid

flowchart TD
    Start([Start Regeneration Request])
    
    Start --> ValidateInput[Validate Prompt + Scene ID]
    ValidateInput -->|Valid| FetchContext[Fetch Scene + Narrative Context]
    ValidateInput -->|Invalid| ErrorState([Return Error & Halt])

    FetchContext --> AnalyzeChange[Compare Old vs New Prompt]
    AnalyzeChange --> ClassifyChange{Is it major or minor?}

    ClassifyChange -->|Minor| RegenerateFrames[Generate New Frame Variants]
    ClassifyChange -->|Major| RebuildScene[Re-evaluate Dependencies<br/>Reconstruct Scene Structure]

    RegenerateFrames --> CheckContinuity[Run Continuity Check]
    RebuildScene --> CheckContinuity

    CheckContinuity -->|Pass| PushToCanvas[Update Canvas View]
    CheckContinuity -->|Fail| TriggerWarning[Trigger Continuity Warning<br/>Suggest Regeneration]

    TriggerWarning --> AwaitUserDecision{User Decision}
    AwaitUserDecision -->|Accept Suggestion| RegenerateFrames
    AwaitUserDecision -->|Dismiss| PushToCanvas

    PushToCanvas --> Done([Regeneration Complete])

```


This diagram maps:
	•	Input validation
	•	Minor vs major prompt changes
	•	Control flow through frame generation, scene reconstruction, and continuity checks
	•	Error handling and user decision paths