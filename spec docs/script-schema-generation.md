
# 🎬 ControlNet Generation Scripting Schema (JSON-like)



```json
{
    "frame_index": 0,
    "prompt": "A futuristic alleyway with blinking neon signs",
    "camera": {
      "motion": "pan_right",
      "angle_degrees": 5,
      "zoom": 1.0
    },
    "pose": {
      "subject": "main_character",
      "action": "raise_left_arm"
    },
    "style": {
      "lighting": "cinematic",
      "color_grade": "cool"
    },
    "control_net": {
      "enabled": true,
      "type": "pose",
      "mask": "mask_001.png",
      "weight": 1.0
    },
    "reference_image": "scene001_ref.jpg",
    "dependencies": ["frame_000"],
    "notes": "Maintain continuity of rain animation"
}
```



Each frame in a scene sequence is orchestrated with:

•	🎥 camera: Pan, zoom, angle
•	🕺 pose: Subject and action behavior
•	🎨 style: Lighting and tone
•	🔧 control_net: Parameters for image manipulation
•	📎 dependencies: Frame sequence linkage


## Replicate Python Client

https://replicate.com/wavespeedai/wan-2.1-i2v-720p/examples?input=python

Install Replicate’s Python client library:

```bash
pip install replicate
```


### Set the REPLICATE_API_TOKEN environment variable:

```bash
export REPLICATE_API_TOKEN=<paste-your-token-here>
```

Find your API token in your account settings.

Import the client:

```python
import replicate
```


Run wavespeedai/wan-2.1-i2v-720p using Replicate’s API. Check out the model's schema for an overview of inputs and outputs.

```python

output = replicate.run(
    "wavespeedai/wan-2.1-i2v-720p",
    input={
        "image": "https://api.replicate.com/v1/files/NTliZTAyYjItNmUzMy00MGJlLTk1YWYtMzQyMWI5NWFjOGQ1/download?expiry=1740612318&owner=wavespeedai&signature=NmJd%252BAq0TrAmRJT50xqsJsd0U6mMoG3C1qBeXh%252Bekfg%253D",
        "prompt": "a woman turns as her dress blows in the wind",
        "max_area": "1280x720",
        "num_frames": 81,
        "sample_shift": 8,
        "sample_steps": 30,
        "frames_per_second": 16,
        "sample_guide_scale": 6
    }
)
print(output)
```