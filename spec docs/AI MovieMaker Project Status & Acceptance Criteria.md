# AI MovieMaker Project Status & Acceptance Criteria

This document tracks the progress of all user stories, their associated development tasks, and acceptance criteria (in Given/When/Then format) that will be implemented as unit tests.

---

## User Story 1: Onboarding and Prompt Generation
**Description:**  
As a user, I want to input my story elements so that the system constructs a live prompt for scene generation.

### Development Tasks
- [ ] **Task 1.1:** Design and implement interactive onboarding UI.
- [ ] **Task 1.2:** Build tokenization function for prompt processing.
- [ ] **Task 1.3:** Develop intent analysis function to extract narrative and visual elements.
- [ ] **Task 1.4:** Integrate live prompt preview that updates in real time.
- [ ] **Task 1.5:** Implement reference image upload (drag & drop zone with 2x2 grid and tagging).
- [ ] **Task 1.6:** Persist prompt and onboarding data in the backend database.

### Acceptance Criteria (Unit Tests)
- **AC 1.1: Tokenization**
  - **Given:** A user enters the prompt "A melancholic alien in a noir city".
  - **When:** The prompt is tokenized.
  - **Then:** The output tokens should include "alien" and "noir".  
    - [ ] Unit Test Passed

- **AC 1.2: Intent Analysis**
  - **Given:** The tokenized prompt contains "alien" and "noir".
  - **When:** The analysis function is executed.
  - **Then:** The returned intent data must include `"subject": "alien"`, `"style": "noir"`, and `"lighting": "low-light"`.  
    - [ ] Unit Test Passed

- **AC 1.3: Live Prompt Preview**
  - **Given:** The user modifies any field in the onboarding flow.
  - **When:** The live prompt preview is updated.
  - **Then:** The preview should display the updated composite prompt accurately.  
    - [ ] Unit Test Passed

- **AC 1.4: Reference Image Upload**
  - **Given:** A user drags and drops up to 4 images.
  - **When:** The images are uploaded.
  - **Then:** The drop zone should display a 2x2 grid with the image thumbnails and correct tag labels (e.g., Style, Subject, Theme).  
    - [ ] Unit Test Passed

---

## User Story 2: Infinite Canvas Scene Editor
**Description:**  
As a user, I want to view a zoomed-in scene with adjacent previews and an inline editable prompt, plus drag-and-drop support for reference images.

### Development Tasks
- [ ] **Task 2.1:** Build zoomed-in editor UI with a central scene preview.
- [ ] **Task 2.2:** Implement peripheral (left/right/top/bottom) preview for adjacent scenes.
- [ ] **Task 2.3:** Create an inline editable prompt box.
- [ ] **Task 2.4:** Integrate drag-and-drop functionality for reference images.
- [ ] **Task 2.5:** Develop a timeline/frame strip that updates with scene thumbnails.
- [ ] **Task 2.6:** Implement zoom controls to expand peripheral views.

### Acceptance Criteria (Unit Tests)
- **AC 2.1: Zoomed-In Editor Display**
  - **Given:** A scene is generated.
  - **When:** The editor loads.
  - **Then:** The main preview must occupy 60% of the horizontal and vertical space with adjacent scenes partially visible.  
    - [ ] Unit Test Passed

- **AC 2.2: Inline Prompt Editing**
  - **Given:** The user clicks the prompt box.
  - **When:** They type or edit the prompt.
  - **Then:** The prompt box updates in real time without modals.  
    - [ ] Unit Test Passed

- **AC 2.3: Drag-and-Drop Image Upload**
  - **Given:** The user drags images into the drop zone.
  - **When:** Images are dropped.
  - **Then:** The system should display the images in a 2x2 grid with appropriate tags.  
    - [ ] Unit Test Passed

- **AC 2.4: Timeline Functionality**
  - **Given:** Multiple scenes exist.
  - **When:** The timeline is loaded.
  - **Then:** The timeline displays scene thumbnails with a "+" placeholder for adding new scenes.  
    - [ ] Unit Test Passed

---

## User Story 3: Scene Regeneration & Branching
**Description:**  
As a user, I want to regenerate a scene and branch off alternate narrative arcs while preserving continuity.

### Development Tasks
- [ ] **Task 3.1:** Implement regeneration logic with prompt-to-frame dependency mapping.
- [ ] **Task 3.2:** Develop key frame linkage viewer with editable dependency fields.
- [ ] **Task 3.3:** Create frame diff indicator UI to show changes between iterations.
- [ ] **Task 3.4:** Enable branching functionality for alternate scene versions.
- [ ] **Task 3.5:** Integrate continuity checks and trigger warnings if needed.

### Acceptance Criteria (Unit Tests)
- **AC 3.1: Regeneration Logic**
  - **Given:** A user clicks "Regenerate" on a scene.
  - **When:** The regeneration logic is executed.
  - **Then:** New frame variants are generated based on slight prompt modifications and continuity is checked.  
    - [ ] Unit Test Passed

- **AC 3.2: Frame Diff Indicator**
  - **Given:** A scene is regenerated.
  - **When:** Comparing the new and old versions.
  - **Then:** The diff indicator must display changes (e.g., “Subject changed from X to Y”).  
    - [ ] Unit Test Passed

- **AC 3.3: Branching Functionality**
  - **Given:** A user chooses to branch off from an existing scene.
  - **When:** The branch is created.
  - **Then:** The system should display the branch as an alternate version in the key frame viewer with proper dependencies.  
    - [ ] Unit Test Passed

---

## User Story 4: ControlNet & 3D Reconstruction Integration
**Description:**  
As a user, I want to generate immersive 3D scenes from 2D images by decomposing them into layers (background, foreground, subject, etc.) and reconstructing via 3D Gaussian Splatting.

### Development Tasks
- [ ] **Task 4.1:** Integrate Flux/OpenAI image generation models.
- [ ] **Task 4.2:** Implement ControlNet module to decompose images into layers.
- [ ] **Task 4.3:** Develop interface for adjusting and fine-tuning ControlNet outputs.
- [ ] **Task 4.4:** Integrate a 3D Gaussian Splatting module for 3D scene reconstruction.
- [ ] **Task 4.5:** Connect the output to the infinite canvas for real-time rendering.

### Acceptance Criteria (Unit Tests)
- **AC 4.1: Image Decomposition**
  - **Given:** A 2D image input.
  - **When:** The ControlNet module processes it.
  - **Then:** The output must include separate layers for background, foreground, subject, depth map, and color channels.  
    - [ ] Unit Test Passed

- **AC 4.2: 3D Reconstruction**
  - **Given:** Layered output from ControlNet.
  - **When:** The 3D Gaussian Splatting module reconstructs the scene.
  - **Then:** The generated 3D scene must maintain spatial continuity and visual fidelity to the original 2D input.  
    - [ ] Unit Test Passed

- **AC 4.3: Real-Time Rendering**
  - **Given:** A completed 3D reconstruction.
  - **When:** The scene is rendered on the infinite canvas.
  - **Then:** The rendering latency must be within acceptable real-time limits (< 500ms per frame).  
    - [ ] Unit Test Passed

---

## 9. Development Task Tracking & Sprint Breakdown

### Sprint 1: Onboarding & Prompt Generation
- [ ] Implement onboarding UI
- [ ] Develop prompt tokenization and intent analysis
- [ ] Integrate live prompt preview and reference image upload

### Sprint 2: Infinite Canvas Editor
- [ ] Develop zoomed-in and zoomed-out editor views
- [ ] Implement inline prompt editing
- [ ] Integrate drag-and-drop reference image functionality
- [ ] Build timeline/frame strip

### Sprint 3: Scene Regeneration & Branching
- [ ] Develop regeneration logic and key frame linkage viewer
- [ ] Implement frame diff indicator
- [ ] Build branching functionality and dependency toggles
- [ ] Integrate continuity checks

### Sprint 4: AI & ControlNet Integration
- [ ] Integrate Flux/OpenAI image gen models
- [ ] Implement ControlNet for image decomposition
- [ ] Develop 3D Gaussian Splatting reconstruction
- [ ] Build per-frame scripting interface and real-time feedback

### Sprint 5: Testing, QA, and Beta Launch
- [ ] Write unit and integration tests for all modules
- [ ] Perform user acceptance testing
- [ ] Finalize UI/UX and prepare for deployment

---

## 10. Additional Technical Considerations

- **Scalability:**  
  Cloud-based infrastructure (AWS, GCP) with horizontal scaling.
- **Performance:**  
  Optimize AI inference and caching mechanisms.
- **Security:**  
  Ensure secure API endpoints, authentication, and data encryption.
- **Monitoring:**  
  Integrate centralized logging, error reporting, and performance dashboards.
- **Documentation:**  
  Maintain comprehensive API docs and developer guides.

---

This detailed development specification document provides all necessary diagrams, code examples, user stories, acceptance criteria, and sprint breakdowns. It should serve as a complete guide for the development team to implement the AI MovieMaker application.