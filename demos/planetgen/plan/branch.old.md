llm instructions for this file: this file contains the short term goals for this git branch. update as necessary. 

immediate goals: 


- Weather/space: tune 3D voxel clouds at high resolution, add axial tilt + physical sun/moon for seasons and moon phases; wire precip → surface moisture/biomes/erosion/glaciers.
- Weather/space: add raymarch budget bounds and ray bundling controls for volumetric cloud performance tuning.

recent progress:

- Fixed camera zoom issue after exiting Tiny Planet mode.
- Added volumetric cloud raymarch controls (min/max steps + ray bundling slider) and wired to the modular cloud shader.
- Implemented "Rocky Areas": Add surface detail/roughness modulation based on slope/height.
- Implemented sliding physics on ice surfaces.
- Refactored index.js: Extracted rendering, UI, and Planet generation into separate modules (SceneManager, PlanetManager, UIManager).
- Modularized Atmosphere and Cloud systems.
- Implemented physical ice collision in polar regions.
- Fixed VR spawn location bugs and inverted joystick inputs.
- VR entry/exit button added (WebXR), with thumbstick locomotion mapping.
- Water shader now blends to ice near poles.
- TrackballControls replaced OrbitControls for overview.
- Added mobile twinstick controls and dynamic switching.
- Input router abstraction created.
- SceneManager now powers renderer/scene/camera/lights in index.js (duplicate setup removed; resize handled by the module).
- Planet generation now flows through PlanetManager (uses AtmosphereSystem/CloudSystem); render loop renders via SceneManager.update.
- AtmosphereSystem wired to weather map + rain haze; controls update skip in Tiny mode to keep mouse/orbit input working.
- UIManager now owns presets + settings read/write/status/hud; legacy water/atmosphere builders removed from index.js (cloud builder delegates to CloudSystem).

---

## Identified Deficiencies & Refactor Targets

### Critical: Incomplete Refactor (index.js bloat)

**Problem:** The refactor that created SceneManager, PlanetManager, UIManager, AtmosphereSystem, and CloudSystem was never completed. These modules exist but **are not used** - index.js still contains ~2000+ lines of monolithic code duplicating most functionality.

**Evidence:**
- SceneManager is now imported for renderer/scene/camera/lights, and PlanetManager is used for planet/water/atmosphere/cloud generation; UIManager is partially used (presets/settings/status) but DOM refs remain in index.js.
- Legacy builders largely removed; index.js still contains `buildWaterCycleCloudMeshVolume()` and duplicated mobile/UI wiring (`bindMobileControls()`, etc.).
- Over 80 DOM element references defined at the top of index.js that should be in UIManager
- The modules were created but the wiring was never completed

**Refactor Target:** Complete the modular integration:
1. ✅ Use SceneManager for renderer/scene/camera/lights/controls
2. ✅ Use PlanetManager for planet/water/freshwater generation and management
3. Use UIManager for all DOM interactions and settings management
4. ✅ Use AtmosphereSystem and CloudSystem for visual effects
5. Reduce index.js to a thin orchestration layer

---

### High: Duplicate Code Across Modules

**Problem:** Same functions appear in multiple files with slight variations.

**Duplicates found:**
- `clamp()` - index.js, UIManager.js, WaterCycleUtils.js
- `normalizeHeightmap()` / `smoothHeightmap()` - index.js, PlanetManager.js
- `buildWaterMesh()` - index.js, PlanetManager.js
- `bindMobileControls()` - index.js, UIManager.js (different implementations!)
- `setStatus()`, `setHudCollapsed()`, `toggleConfigPanel()` - index.js, UIManager.js
- `readSettings()`, `writeSettings()` - index.js, UIManager.js
- `getBaseCloudSettings()` - index.js, UIManager.js

**Refactor Target:** Consolidate to single sources of truth:
- Move utilities to a shared utils module
- Remove duplicate implementations from index.js once modules are wired

---

### High: TinyPlanetControls Stability

**Problem:** First-person controls remain unstable despite multiple fix attempts.

**Known Issues (from council.md and log.md):**
- Spawn height logic may place player underground
- Orientation can face inward toward planet center
- Pointer lock behavior inconsistent
- Mobile input not fully integrated with controls
- Ice collision logic tied to world Y coordinate instead of local normal

**Refactor Target:**
- Review and test spawn logic end-to-end
- Ensure heightmap sampling uses correct coordinate space
- Validate orientation basis construction
- Add debug visualization for spawn point/orientation

---

### Medium: No Centralized State Management

**Problem:** Settings and state scattered across multiple locations.

**Current state:**
- Settings read directly from DOM elements
- `lastPlanetSettings` stored in index.js
- `pendingWaterCycleSurface` stored in index.js
- No dirty flags or change tracking
- UI updates coupled with logic

**Refactor Target:** Introduce a minimal state store:
- Centralized settings object
- Change listeners/observers
- Dirty flags for selective updates
- Decouple UI from state

---

### Medium: Weather System Complexity

**Problem:** Two parallel weather systems (2D and 3D) with complex runtime switching.

**Current implementation:**
- `WaterCycleSystem` (2D lat/lon grid)
- `WaterCycleVolumeSystem` (3D voxel volume)
- Complex `selectWaterCycleSystemIfNeeded()` async switching logic
- Shared surface data (`pendingWaterCycleSurface`) with race conditions possible

**Refactor Target:**
- Abstract common interface for both systems
- Clean initialization/switching logic
- Consider single configurable system with dimension as parameter

---

### Medium: Atmosphere/Cloud Systems Not Integrated

**Problem:** AtmosphereSystem and CloudSystem exist but aren't used.

**Current state:**
- index.js has `buildAtmosphereMesh()` (~100 lines)
- index.js has `buildCloudMesh()` (~150 lines)
- index.js has `buildWaterCycleCloudMeshVolume()` (~200 lines)
- AtmosphereSystem.js and CloudSystem.js exist with similar functionality

**Refactor Target:**
- Wire AtmosphereSystem into main loop
- Wire CloudSystem for both legacy and water-cycle clouds
- Remove duplicate shader code from index.js

---

### Low: Missing Tests

**Problem:** Only `tests/watercycle-utils.test.js` exists; no coverage for:
- TinyPlanetControls state transitions
- Planet generation invariants
- Settings validation
- Control mode switching

**Refactor Target:**
- Add unit tests for TinyPlanetControls (walk/swim/fly transitions)
- Add tests for heightmap generation sanity checks
- Add smoke tests for control state machines

---

### Low: Input System Incomplete

**Problem:** InputRouter exists but isn't fully utilized.

**Current gaps:**
- Desktop keyboard still handled directly in TinyPlanetControls
- VR input polled separately in index.js
- Mobile controls have parallel implementations

**Refactor Target:**
- Route all input through InputRouter
- Unify desktop/mobile/VR input handling
- Remove direct event listeners from TinyPlanetControls

---

### Low: Magic Numbers / Constants

**Problem:** Magic numbers scattered throughout code.

**Examples:**
- `BASE_RADIUS_UNITS = 10` defined in multiple files
- `DEFAULT_DIAMETER_KM = 1000` defined in multiple files
- Player height, walk speeds, jump force hardcoded
- Shader constants embedded in strings

**Refactor Target:**
- Create constants module
- Move shader constants to uniform blocks where possible
- Document units and scaling factors

---

## Suggested Refactor Priority

1. **Complete module integration** - Wire SceneManager, PlanetManager, UIManager into index.js to reduce bloat
2. **Fix TinyPlanetControls** - Stabilize spawn/orientation issues
3. ✅ **Consolidate duplicates** - STARTED 2025-12-16: Created utils.js and constants.js shared modules
4. **Add tests** - Particularly for control state transitions
5. **Centralize state** - Simple settings store to decouple UI
6. **Clean up weather systems** - Abstract common interface
7. **Wire atmosphere/cloud modules** - Remove duplicate shader code

---

## Refactor Progress (2025-12-16)

### Shared Modules Created

**utils.js** - Common utility functions:
- `clamp(v, min, max)` - Clamp value to range
- `lerp(a, b, t)` - Linear interpolation
- `normalizeHeightmap(buffer)` - Normalize heightmap to 0-1
- `smoothHeightmap(buffer, size, passes)` - Smooth heightmap with averaging
- `isMobileDevice()` - Detect mobile/touch devices
- `nextFrame()` - Promise that resolves on next animation frame
- `sampleDataTextureRGBA(tex, u, v)` - Sample RGBA from DataTexture

**constants.js** - Magic numbers:
- `BASE_RADIUS_UNITS = 10` - Base planet radius in scene units
- `DEFAULT_DIAMETER_KM = 1000` - Default planet diameter in km
- `DEFAULT_RADIUS_M = 500_000` - Default planet radius in meters
- `PERSON_HEIGHT_M = 1.8` - Average person height
- `MAX_DELTA_TIME = 0.25` - Max frame delta to prevent physics jumps
- `PRESETS` - UI preset definitions

### Updated Files

- **index.js** - Imports utils/constants, removed duplicate definitions for `clamp`, `isMobileDevice`, `nextFrame`, `sampleDataTextureRGBA`, `normalizeHeightmap`, `smoothHeightmap`
- **PlanetManager.js** - Added imports (local fallbacks still exist)
- **UIManager.js** - Added imports (local fallbacks still exist)
- **SceneManager.js** - Matches runtime defaults (shadow map enabled + PCFSoft, light shadows/target, dim hemisphere light) to mirror index.js setup.
- **index.js** - Instantiates SceneManager for renderer/scene/camera/controls/lights, drops local scene/light/starfield setup, and leaves resize handling to the module (index resize now only updates input/mobile visibility).

### Completed (2025-12-16)

- ✅ Removed duplicate `sampleDataTextureRGBA` function from index.js (was causing SyntaxError)
- ✅ Removed duplicate `normalizeHeightmap` function from index.js (was causing SyntaxError)
- ✅ Removed duplicate `smoothHeightmap` function from index.js (was causing SyntaxError)
- ✅ Browser verified: no more declaration errors, app runs successfully
- ✅ PlanetManager.js: Removed local `normalizeHeightmap()` and `smoothHeightmap()` methods, now uses imports from utils.js
- ✅ PlanetManager.js: Using imported `DEFAULT_DIAMETER_KM` constant instead of local definition
- ✅ UIManager.js: Removed local `clamp()` method, now uses import from utils.js
- ✅ UIManager.js: Removed local `BASE_RADIUS_UNITS` and `DEFAULT_DIAMETER_KM` properties, now uses imports from constants.js
- ✅ Browser verified: all changes work, no errors
- ✅ index.js: Removed duplicate `presets` object, now using `PRESETS` from constants.js
- ✅ index.js: Updated `applyPreset()` to use `PRESETS` instead of local `presets`
- ✅ Added weather auto-scaling toggle that adjusts volume resolution/readback Hz/raymarch settings based on frame-time budget (manual settings restore when off).

### Remaining Work

- Continue module integration: move DOM/state wiring into UIManager and delete legacy builders left in index.js
- Add more constants for physics values (walkSpeed, gravity, etc.) in TinyPlanetControls
- Consider weather auto-scaling refinements: adapter-based starting tier and optional 3D→2D fallback when budget is missed at lowest tier
