# VR Branch Plan (UI + Exit Fix)

## Current Issue: Black Screen After Exiting VR

### Likely Cause
When leaving an immersive WebXR session, the WebGL state can remain bound to an XR framebuffer / viewport for a frame or more. Our non‑VR pipeline uses `EffectComposer`, so if the renderer still targets an XR framebuffer (or stale GL state), the canvas can appear black on exit.

Also, Three.js’ `WebXRManager` overwrites the *user camera* each XR frame (position/quaternion/projection). If that camera state is left in an invalid/extreme state after exit (e.g. bad FOV/projection), the non‑VR render can effectively draw nothing.

### Fix Strategy (Implemented)
- Add `renderer.xr` `sessionstart/sessionend` handlers.
- On `sessionend`, force a return to the canvas pipeline:
  - `renderer.setRenderTarget(null)` + `renderer.resetState()`
  - `updatePixelation()` to restore correct canvas/composer size
  - re‑attach `renderer.setAnimationLoop(animate)` defensively
- If the canvas is still black on some devices, rebuild the graphics pipeline on exit:
  - recreate `WebGLRenderer` + `EffectComposer` (keep the existing `scene`/`camera` state)
  - remount the VR button and rebind UI/canvas events
- Avoid the WebXR `layers` feature (projection layers) during session creation:
  - implement a custom “ENTER VR” button that calls `navigator.xr.requestSession(...)`
  - request only `optionalFeatures: ['local-floor', 'bounded-floor']` (omit `'layers'`)
- Save/restore camera + controls state on XR enter/exit:
  - store camera `position/quaternion/fov/near/far/zoom` and `controls.target`
  - disable `OrbitControls` while in XR, restore on exit

This keeps VR rendering simple (direct `renderer.render`), but reliably restores post‑processing when VR ends.

## VR UI Update Issue (Fixed 2024-12-15)

### Problem
The VR UI plane showed the frozen initial capture but never updated afterward.

### Root Cause
After the first `vrUiCapture()` completed, the `finally` block set:
```javascript
vrUI.needsCapture = dirtyNow !== dirtyAtStart;
```
If no DOM mutations happened during the ~50-100ms async capture, `needsCapture` became `false`. Subsequent captures only triggered when `needsCapture` was true (from MutationObserver) OR `forceCapture` was true (from controller interaction).

The plan mentioned having a "minimum refresh rate (5-10 fps) for frequently updated text like FPS/coords" but this wasn't implemented - the code relied entirely on MutationObserver.

### Fix
Added a forced periodic refresh (5 fps / 200ms) at the start of `vrUiUpdatePoseAndRay()`:
```javascript
const timeSinceLastCapture = nowMs - (vrUI.lastCaptureMs || 0);
if (timeSinceLastCapture >= 200) {
    vrUI.needsCapture = true;
}
```
This ensures the VR UI updates at least 5 times per second regardless of whether MutationObserver detects changes.

## Goal: VR UI That Mirrors Existing UI Automatically

### Requirements
- Same controls, labels, and dynamic values as the current HTML UI.
- “Automatic mirroring”: minimal duplication and no separate VR-only UI state.
- Interactable in VR via controller ray / gaze pointer.
- Works on devices that *don’t* support WebXR DOM Overlay.

## Plan A (Preferred When Supported): WebXR DOM Overlay

### Concept
Use the WebXR `dom-overlay` feature to show the existing HTML UI directly in the headset. This is the cleanest “mirror” because it *is* the UI.

### Pros / Cons
- Pros: true 1:1 UI, all interactions already work, no texture capture cost.
- Cons: feature support varies across browsers/devices; overlay is 2D “HUD-like” (not a 3D panel in world space).

### Implementation Sketch
- Replace `VRButton` usage with a custom session request:
  - `optionalFeatures: ['local-floor', 'dom-overlay']`
  - `domOverlay: { root: document.getElementById('ui-layer') }`
- If session request fails due to missing feature, fall back to Plan B automatically.

## Plan B (Universal Fallback): Render UI To a Plane In VR

### Concept
Render the existing DOM UI into a bitmap (canvas), upload it as a `CanvasTexture`, and display it on a rectangular plane attached in front of the user in VR. Send “virtual pointer” events back into the DOM so the same handlers run.

### Core Pieces
1. **UI capture**
   - Use `html2canvas` (or similar) to rasterize `#ui-layer` to an offscreen canvas.
   - Keep the source UI laid out in a “capture root” that is offscreen but visible (not `display:none`).
2. **Plane rendering**
   - Create `uiTexture = new THREE.CanvasTexture(uiCanvas)`.
   - Create `uiMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: uiTexture, transparent: true }))`.
   - Attach to the camera rig (ex: `camera.add(uiMesh)`), position at ~`z = -1.2`.
3. **Interaction mapping**
   - Raycast from controller to the plane.
   - Convert hit `uv` → pixel coordinates within the capture root’s bounding rect.
   - Find DOM target (use `document.elementFromPoint(x, y)` if the capture root is in the main DOM flow; otherwise walk the capture root with `elementsFromPoint` + hit test).
   - Dispatch `PointerEvent`/`MouseEvent` (`pointerdown/move/up`, `click`) with translated `clientX/clientY`.
4. **Update scheduling**
   - Don’t capture every frame.
   - Use a `MutationObserver` + throttle to refresh when the UI changes.
   - Also refresh at a low rate (ex: 5–10 fps) to cover frequently updated text like FPS/coords.

### Pros / Cons
- Pros: works on most WebXR devices; UI becomes a physical panel; minimal UI rewrite.
- Cons: capture cost (CPU/GPU); careful event mapping; some CSS features may rasterize imperfectly.

## Plan C (Longer-Term): Native 3D UI With Shared View-Model

### Concept
Create a single UI “state model” (data + actions). Render it:
- to HTML for desktop (current),
- and to a VR-native UI (Three.js meshes via `three-mesh-ui`, or custom SDF text/buttons).

### Pros / Cons
- Pros: best VR experience and performance; crisp text; full 3D placement.
- Cons: more refactor work; not an “automatic mirror” unless we first build the shared view-model.

## Recommended Path
1. Keep the `sessionend` restore fix (done).
2. Prototype Plan B first (plane + pointer mapping), because it works everywhere.
3. Add Plan A opportunistically: if `dom-overlay` is supported, use it for the cleanest mirror; otherwise keep Plan B.
4. If VR becomes a primary mode, graduate to Plan C (shared view-model) for high-performance, fully-native VR UI.
