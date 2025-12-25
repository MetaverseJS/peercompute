llm instructions for this file: this file documents how weather simulation scaling works (auto and manual), including tiers, metrics, and fallbacks. keep it concise and actionable.

# Weather Auto Scaling

## Goal
Keep the WebGPU weather simulation responsive by adjusting cost based on frame-time budget, while preserving manual control when auto-scaling is off.

## Where it lives
- Runtime policy + UI: `index.js`
- UI toggle: `index.html`
- Weather systems: `WaterCycleVolumeSystem.js`, `WaterCycleSystem.js`

## Auto-scaling policy (current)
- **Metric:** frame delta EMA (approx frame time).
- **Budget thresholds:** scale down when EMA > 33 ms; scale up when EMA < 20 ms.
- **Hysteresis:** 1.5 s over-budget before downshift; 6 s under-budget before upshift.
- **Cooldowns:** 2 s after downshift; 4 s after upshift.

## 3D volume tiers (current)
Auto scaling adjusts these in lockstep:
- `volumeN` (recreates 3D system)
- `readback Hz`
- `raymarch steps min/max`
- `ray bundle size`

Tier table (low → high):
- T0: N=16, Hz=4, steps=10–20, bundle=4
- T1: N=24, Hz=5, steps=14–26, bundle=3
- T2: N=32, Hz=6, steps=18–32, bundle=2
- T3: N=48, Hz=7, steps=22–38, bundle=2
- T4: N=64, Hz=8, steps=28–48, bundle=1

## 2D tiers (current)
Auto scaling adjusts:
- `readback Hz`
- `moistureLayers`

Tier table (low → high):
- T0: Hz=4, layers=1
- T1: Hz=6, layers=2
- T2: Hz=8, layers=3
- T3: Hz=10, layers=4

## Manual mode behavior
- When auto is enabled, the managed UI controls are disabled and their manual values are saved.
- When auto is disabled, saved manual values are restored and applied.

## Known gaps / next steps
- Add GPU adapter-based starting tier selection (use adapter limits).
- Optional fallback from 3D to 2D when 3D is at lowest tier and still over budget.
- Consider including readback latency as an additional signal.
