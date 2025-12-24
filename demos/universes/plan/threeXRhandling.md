# Three.js WebXR Exit Black Screen (Bug + Fix)

## Symptom
- Entering VR works.
- Exiting VR returns to the page UI (buttons/labels still update), **but the 3D view stays black**.

This strongly suggests the app loop is still running, but the WebGL canvas is no longer presenting the scene correctly after the XR session ends.

## Root Cause (Most Likely)
Two Three.js/WebXR behaviors can combine into this failure mode:

### 1) `VRButton` requests the `layers` feature by default
Three’s `VRButton.createButton(renderer)` builds session options with:
- `optionalFeatures: ['local-floor', 'bounded-floor', 'layers', ...]`

On devices/browsers that support XR projection layers, this can route the session into the `XRWebGLBinding` + projection layer path. Some platforms appear to have trouble cleanly returning to a normal canvas framebuffer after that session ends (result: black canvas, UI still live).

### 2) Three’s `WebXRManager` overwrites the *user camera* during XR
During XR rendering, `WebXRManager` updates the provided camera’s:
- position/quaternion
- projection matrix / derived FOV

If that camera state is left “XR-shaped” after exit, the non‑XR render can effectively draw nothing (bad projection, bad pose, etc). OrbitControls continuing to run at the same time can make this worse.

## Fix (What Worked)

### A) Replace `VRButton` with a custom “ENTER VR” button and omit `layers`
Instead of `VRButton.createButton(renderer)`, request the session ourselves:
- `navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor'] })`
- do **not** include `'layers'` in `optionalFeatures`

This prevents the session from using projection layers on platforms where it leads to a broken exit-to-canvas transition.

### B) Save/restore camera + controls state on XR enter/exit
On `sessionstart`:
- snapshot camera: `position`, `quaternion`, `fov`, `near`, `far`, `zoom`
- snapshot controls: `controls.target`, `controls.enabled`, `controls.autoRotate`
- disable OrbitControls while XR is presenting

On `sessionend`:
- restore the saved camera + controls state
- call `camera.updateProjectionMatrix()` + `camera.updateMatrixWorld(true)` and `controls.update()`

### C) Ensure canvas framebuffer + viewport are valid on non‑XR frames
Before non‑XR rendering:
- `renderer.setRenderTarget(null)`
- reset viewport/scissor to match the canvas

## Code Location
- `main.js`:
  - Custom VR session button: `mountVrButton()`
  - Camera/controls save/restore: `attachXRSessionListeners()`
  - Non‑XR viewport enforcement: `animate()` (just before choosing composer vs direct render)

## Notes / Follow-ups
- If we later want XR projection layers (for perf/quality), we should gate `'layers'` behind a runtime opt-in and test exit behavior per device/browser.
- This fix keeps the existing UI as-is; it only stabilizes exiting VR. The next step is implementing the VR UI mirroring plan (`plan/branch.md`).

