llm instructions for this file:
this file contains the short term goals for this git branch. update as necessary

Short-term branch goals:
- Ground decisions in the project goal/plan (`imp-plan.md`) while keeping this branch focused on MLS-MPM water-first integration.
- Use WebGPU-Ocean’s MLS-MPM (https://github.com/matsuoka-601/WebGPU-Ocean/tree/main) and the MPM guide (https://nialltl.neocities.org/articles/mpm_guide) as primary references for structure and kernels; keep peercompute compatibility in mind.

Status: WebGPU-Ocean MLS-MPM reviewed (buffers, constants, workgroup sizes, pipeline order captured).

Immediate tasks:
1) Research & architecture
   - Finish a quick pass over WebGPU-Ocean MLS-MPM to note buffer layouts, dispatch sizes, and kernel sequencing. ✅
   - Decide integration approach: reuse `src/device.js` helpers vs. parallel module; outline data schemas for particles/grid/material/phase/temperature with peercompute-friendly layouts. (Decision: reuse device helpers, wrap existing `World` as `RigidDomain`, add simple `Engine`; schema/factories/headless helpers in `src/domains/mpm/`.)
2) Core scaffold
   - Draft module boundaries for MLS-MPM core, material registry, and demo adapter (can coexist with toychest). ✅ (domain/factory/headless scaffolds added)
   - Sketch WGSL pipeline list (P2G, grid forces/stress, boundaries, G2P, integration) and buffer schemas. ✅ (kernels/pipelines added)
3) Water MVP prep
   - Define water material parameters (quadratic B-spline weights, APIC transfers, explicit integration, boundary rules) and initial test harness requirements (headless mass/momentum checks). (Headless harness added: `demos/mpm-headless.html`; tuned demo constants and drift alerts.)
4) Phase/compatibility considerations
   - Note fields needed for temperature/phase change and hooks for additional materials (wood/steel float/sink).
   - Track any peercompute alignment requirements (buffer formats/interop) to avoid rework later.
