# PeerCompute WebXR/Input Toolkit

This directory is a browser-first ES module toolkit with no bundled Three.js
copy. Consumers inject their renderer's `renderer.xr`, Three namespace, and
official addon factories, so target-ray spaces, grip models, HTMLMesh panels,
and the application scene all use one Three revision.

## Unified controls

`ActionInput` merges keyboard/pointer, multitouch Pointer Events, `standard`
gamepads, and WebXR `xr-standard` gamepads into an immutable control frame:

```js
const frame = actionInput.sample().control;
// sequence, steer, throttle, frontBrake, rearBrake, clutch, shiftDelta,
// handbrake, reset, cameraToggle, recenter
```

Held device state is sampled before edge detection. `shiftDelta`, `reset`,
`cameraToggle`, and `recenter` fire for one frame. A higher-priority context can
capture named actions, which both routes its own sources and neutralizes lower
contexts until capture is released.

Each adapter has explicit `poll`, `clear`, and/or `dispose` boundaries. Pointer
controls use Pointer Events so separate steering, throttle, brake, and command
touch points remain live simultaneously.

`KeyboardPointerAdapter` keeps pointer lock opt-in. Applications may call
`adapter.requestPointerLock()` from their own user gesture, or set
`pointerLock: true` (equivalently
`pointerLock: { requestOnPointerDown: true, options }`) to use the primary
pointer-down gesture. Relative `movementX`/`movementY` values accumulate while
locked. Lock loss, blur, visibility changes, `stop()`, and `dispose()` clear
held state; the default never requests lock.

## WebXR ownership

`XRSessionLifecycle` probes support, requests and ends the real session,
connects it to Three, and restores non-XR camera/control state after either a
normal end or setup failure. DOM overlay is optional and feature-detected.
Projection `layers` is omitted unless `enableLayers: true` is explicit.

`XRControllerRegistry` keys sources by identity, handedness, and controller or
hand role. Three slot indexes are only used to obtain spatial objects; action
mapping never relies on a left/right index convention. Target-ray objects and
grip-space models are distinct. Inject `XRControllerModelFactory` and an
optional hand model factory from the active Three addon revision.

The registry copies `selectstart`/`selectend` and
`squeezestart`/`squeezeend` into every entry's `inputState`. That state exposes
held flags, event counters, the last plain event record, hand metadata, and
plain target-ray/grip/hand poses. It is available for controllers and tracked
hands even when `inputSource.gamepad` is absent. Session detach/end and registry
disposal remove the event listeners and entries.

`WebXRInputAdapter` retains the compatible
`mapSource(xrStandardSnapshot, entry, options)` path for gamepads. Its generic
path maps every registry entry:

```js
const adapter = new WebXRInputAdapter({
  input: actionInput,
  registry,
  mapInput(source, entry, { deadzone }) {
    // source.xrStandard may be null for a tracked hand.
    // source.events contains one-poll event edges; source.select and
    // source.squeeze contain held/pressed/released state.
    return applicationMap({ source, entry, deadzone });
  },
});

adapter.poll({ frame, referenceSpace }); // frame arguments are optional
adapter.getInputStates();                // immutable copied source states
```

`TerminalUIInteraction.updateFromIntersection()` accepts the same copied
`inputState` and uses `inputState.select.held` when `pressed` is omitted, so ray
or poke UI does not need to inspect a Gamepad.

`ViewRig` coordinates first-person, damped third-person, and tracked-head XR
views without overwriting the XR camera pose. `resetPose({ recenter })` clears
third-person damping before the next update; `snap({ position, orientation,
lookAt, recenter })` clears damping and optionally applies a pose immediately.
`XRHaptics` supports both WebXR haptic pulse and standard dual-rumble APIs.

## Terminal UI

`TerminalPanel`, `TerminalButton`, `TerminalSlider`, and
`TerminalUIInteraction` provide one ray/poke/focus interaction model. The
canvas-texture `createThreeTerminalPanel` is the always-available in-scene
fallback. `createThreeHtmlUiBridge` optionally wraps accessible DOM controls
with injected `InteractiveGroup`/`HTMLMesh` constructors. DOM overlay and the
HTML bridge are enhancements, not requirements.

Every owner exposes cleanup; applications should dispose adapters, interaction
instances, render bridges, haptics, registry, and session lifecycle during
teardown.
