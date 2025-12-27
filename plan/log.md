Instructions: This file contains a detailed implementation log describing choices made and things tried and whether they worked or not. this must be updated after every prompt with the prompt used and a summary of changes. In general this file should not be rewriteen but appended to. The point of this file is to understand what we've done already so we do not retread ground we've already covered. 

## Implementation Log

## Historical Summary (from plan.old/imp-log.md)
- 2025-11-20: libp2p keepalive issues (yamux idle close, ping streams too short); tests failed.
- 2025-11-21: updated stream API and tuned gossipsub; discovery still failed; temporary PeerJS pivot for test stability.
- 2025-11-22 to 2025-11-23: PeerJS-era game integration work for sw2/cb, presence cleanup, time sync, evented state, LOD, XR fixes.
- 2025-11-26: pivoted back to libp2p.
- 2025-12-21: relay recovery (WSS, config flow), floodsub switch, time anchor, dev/test script updates.
- 2025-12-22: NetworkScheduler core + reliability, room isolation, cb/sw2 integration, unit tests; Playwright results mixed in sandbox.

## Date: 2025-12-23

### Prompt
- I'd like you to go over the plan files inside plan.old and migrate their content into the new plan/ structure. remove redundant items and perform some general cleanup of the content to make it consice.

### Changes
- Migrated and condensed plan.old content into plan/plan.md, plan/branch.md, plan/arch/arch.md, plan/arch/netman.md, plan/refs/refs.md.
- Added a concise historical summary and updated plan/llm.md with workflow/tooling notes.

## Date: 2025-12-23

### Prompt
- I've added a project overview to the plan, and a few diagrams to the arch. I'd like you to examine the diagram pngs and the drawio file and the overview I added and create architecture design documents similar to netman.md for each (non duplicate) entity in the block diagram. also update the rest of the documents to align with the new project overview and arch documents.

### Changes
- Added per-entity architecture docs for the compute node, managers, workers, IO, and node roles in plan/arch.
- Added topology summary doc sourced from the topology diagram.
- Aligned plan/plan.md, plan/arch/arch.md, and plan/arch/netman.md with the new overview and component docs.
- Added main-thread summary doc and cross-links in arch/netman.

## Date: 2025-12-23

### Prompt
- OK I want you to document all of these tradeoffs in the discussion/datastate.md file and note in the plans/branch/current-branch.md file that we're going to go with a main thread owned GPU hub in addition to supporting isolated compute worker threads via the compute manager. we're going to use the hot/warm/cold layered datastate approach we discussed earlier as well. ... now I want you to document all of this and update all plan/architecture files and diagrams and images and the readme to reflect this new major direction change.

### Changes
- Documented GPU hub vs worker tradeoffs and adopted layered DataState in plan/discussions/datastate.md.
- Added GPU hub component doc and updated arch/plan docs for shared-GPU main-thread ownership, isolated GPU workers, and commit deltas.
- Updated branch/current-branch decisions and branch TODOs to reflect the new direction.
- Updated README files and diagram references; annotated compute-node diagram and updated drawio source.

## Date: 2025-12-23

### Prompt
- OK I want you to lay out a comprehensive implementation plan for this in the plan/branch/datastate.md file and then implement it.

### Changes
- Added a layered DataState implementation plan in plan/branch/datastate.md.
- Implemented DataState wrapper with commitDelta and hot buffer tracking.
- Added GPUHubManager stub and wired NodeKernel/ComputeManager commitDelta flow.
- Exposed DataState and GPUHubManager exports for integration.

## Date: 2025-12-23

### Prompt
- go ahead and proceed. write your own tests and run them without my input and let me know when you can't proceed any farther.

### Changes
- Added unit coverage for DataState commitDelta and hot buffer helpers.
- Added unit coverage for ComputeManager commitDelta handling in inline tasks.

### Tests
- node --test peercompute/tests/unit/*.test.js

## Date: 2025-12-23

### Prompt
- OK update all files in plan to reflect your changes.

### Changes
- Updated branch goals to reflect completed DataState/GPU hub wiring and the next netman follow-ups.
- Aligned arch docs (datastate, gpuhub, nodekernel, stateman, compman, wgpuworker, arch) with commitDelta, warm delta provider hooks, and GPU hub scaffolding.
- Updated plan roadmap/completed to reflect the layered DataState and GPU hub scaffolding work.

## Date: 2025-12-23

### Prompt
- yes do that and alos provide an example for how the new datastate works and how to use all the different kinds of compute workers.

### Changes
- Added DataState commitDelta and compute worker usage examples to README files.

## Date: 2025-12-23

### Prompt
- first thiing I'd like you to do is refactor demos/hyperborea/cb.html it should be made more modular, broken out into ES6 modules and it should use vite. then update it for the changes we've made to peercompute.

### Changes
- Converted demos/hyperborea into a Vite-based module structure with a new entrypoint and styles.
- Split Hyperborea demo logic into ES module files (config, net utils, noise, time system, terrain generator, VR/NURBS helpers, Game class).
- Updated the demo to import NodeKernel directly from the PeerCompute source alias instead of relying on a global bundle.

## Date: 2025-12-23

### Prompt
- I get a 404 when I try to run it

### Changes
- Added `demos/hyperborea/index.html` to avoid a root 404 and updated Vite build inputs.

## Date: 2025-12-23

### Prompt
- alright it's running: [Immersive Web Emulator] ... nurbs.js:3 Uncaught TypeError: Cannot add property NURBSUtils, object is not extensible ... Please run it yourself until it loads without console errors.

### Changes
- Reworked NURBS helpers to avoid mutating the frozen `three` module namespace and updated the game to use the new helper.

## Date: 2025-12-23

### Prompt
- OK we're rendering! but we have a multiplayer issue ... getNetHzFromQuery is not defined

### Changes
- Imported `getNetHzFromQuery` into the Hyperborea Game module to fix multiplayer scheduler setup.

## Date: 2025-12-23

### Prompt
- OK I don't see any errors but the players don't seem to be connecting to one another.

### Changes
- Added a relay-config.json under demos/hyperborea/public so the Vite demo can discover bootstrap peers.

## Date: 2025-12-23

### Prompt
- OK we're rendering! ... players don't seem to be connecting ... season/day/time doesn't seem to be syncing yet

### Changes
- Broadcast the time anchor on peer connections to ensure late joiners receive the current time sync payload.

## Date: 2025-12-23

### Prompt
- We are in a new branch called demo-ports... port all demos with "-ref" suffix ... make a detailed plan in demo-ports.md ... proceed as far as you can ... devise tests you can run.

### Changes
- Drafted a detailed porting plan in plan/branch/demo-ports.md and created scaffolds for cubechat, planetgen, universes, and webgpuphys.
- Ported CubeChat networking to a PeerCompute-based adapter and added a relay-config.json for the demo.
- Added a demo scaffold test at demos/tests/demo-ports.test.js and ran it.
- Hooked webgpuphys demos to a PeerCompute GPU hub device helper for shared WebGPU ownership.

### Tests
- node --test demos/tests/demo-ports.test.js

## Date: 2025-12-23

### Prompt
- go ahead

### Changes
- Added a StateManager+ComputeManager integration test for commitDelta flow.

### Tests
- node --test peercompute/tests/unit/*.test.js

## Date: 2025-12-23

### Prompt
- do 1 then 2 then 3 write tests for each make sure they pass then let me know

### Changes
- Added GPUHubManager WebGPU initialization and hot buffer creation helpers.
- Added warm delta accessors and warm-delta provider registration in NetworkManager/StateManager.
- Added a hot/warm demo helper to show hot buffer registration and warm delta commit.
- Added unit tests for GPUHubManager, warm delta provider, and hot/warm demo flow.

### Tests
- node --test peercompute/tests/unit/*.test.js

## Date: 2025-12-23

### Prompt
- OK do all four of those things, write tests you can execute yourself, then execute those tests to verify everything works for every one of the demos, and then fix the things you discover broke in the demos.

### Changes
- Restored CubeChat WebRTC signaling over PeerCompute events and added screen-share renegotiation/track classification.
- Added a shared GPU hub helper to PlanetGen and wired Ocean + WaterCycle compute to accept injected devices.
- Offloaded Universes universe/galaxy generation to ComputeManager tasks with main-thread fallback.
- Added isolated worker compute tasks for WebGPUPhys headless MPM and updated the demo wiring.
- Updated demo READMEs to reflect new compute/network behavior.
- Expanded demo-ports tests to validate compute wiring and WebRTC signaling.

### Tests
- node --test demos/tests/demo-ports.test.js

## Date: 2025-12-25

### Prompt
- I don't mean to interrupt but make sure you read all the files in the root plan folder. there's one rule you need to refer to me correctly or I know you're not paying attention to the plan files. OK proceed with what you were doing.

### Changes
- Reviewed plan/llm.md, plan/plan.md, and plan/log.md before continuing work.
- Added holistic weather plan document at demos/planetgen/plan/hollistic-weather-plan.md.
- Added the Holistic weather sim mode option in PlanetGen UI (source + docs html) and stub handling in demos/planetgen/src/index.js.
- Reduced water-cycle cloud flicker by updating uniforms when possible instead of rebuilding the mesh every update.
- Updated Universes black hole rendering to hide the black sphere and intensify the lensing shader with an event-horizon shadow mask.
- Added a WebGPUPhys cubic barrier demo (ppf-cubic-barrier.html/.js), demo index link, Vite build input, README note, and a headless runtime test.
- Appended new tasks to plan/branch/current-branch.md for the holistic weather reset, black hole lensing, and PPF demo.

### Tests
- node demos/webgpuphys/tests/ppf-runtime.js (required escalated permissions for local port)

## Date: 2025-12-25

### Prompt
- read all plan files first. then update the current-branch.md file with the tasks neccessary to complete the following:
- We're on a new branch called server-changes. I'd like to get the relay server ready to run on my server at secretworkshop.net port 8080 using wss. add a prod-config file to the root directory which we can set the relay server URL and port. when running the build for production (npm run build) it should populate the demos with the production-config relay location.

### Changes
- Added a server-changes branch plan with tasks for production relay config, WSS relay setup, and build-time relay-config injection.

## Date: 2025-12-25

### Prompt
- do it!

### Changes
- Added `prod-config.json` for production relay host/port/protocol and optional peerId/ssl settings.
- Added `scripts/write-prod-relay-config.mjs` to generate demo `public/relay-config.json` for production builds.
- Added `scripts/start-relay-prod.sh` to launch the relay with prod-config defaults.
- Wired `scripts/build-all.sh` to run the production relay-config writer before demo builds.
- Added release test coverage for prod-config/build hook and updated README + branch status.

### Tests
- node --test demos/tests/demo-release.test.js

## Date: 2025-12-25

### Prompt
- yes we will want to persist the key.

### Changes
- Added relay identity persistence via `RELAY_IDENTITY_FILE` in `peercompute/src/relay/server.js`.
- Added `relayIdentityFile` to `prod-config.json` and wired it through `scripts/start-relay-prod.sh`.
- Updated README and branch plan to document stable relay peer IDs across restarts.

## Date: 2025-12-26

### Prompt
- alright perform the recommended changes in the secretworkshop file we have here in root and I'll deploy it. then make any necessary local changes to the relay server and peercompute demos and build scripts in general to support these changes.

### Changes
- Added nginx relay subdomain blocks in `secretworkshop.net` to proxy WSS on 443 to localhost:8080.
- Updated `prod-config.json` defaults for relay subdomain/443 with local listen on 127.0.0.1:8080.
- Documented nginx TLS termination guidance in `README.md` and aligned branch requirements.
- Ignored `config/relay-peer-id.json` to avoid committing relay identity secrets.

## Date: 2025-12-27

### Prompt
- alright
- what do you think ?

### Changes
- Adjusted the relay server block in `secretworkshop.net` to remove `ipv6only=on` and avoid duplicate listen options for `[::]:443`.

## Date: 2025-12-27

### Prompt
- hmm I'm getting a 502 when I try to browse to secretworkshop.net now

### Changes
- Updated `secretworkshop.net` to include the apex `secretworkshop.net` in the wildcard HTTPS server block so it no longer falls back to the relay vhost.

## Date: 2025-12-27

### Prompt
- got this: start-relay-prod.sh: 2: set: Illegal option -o pipefail

### Changes
- Added a bash guard to `scripts/start-relay-prod.sh` so it exits with a clear message when run under `/bin/sh`.

## Date: 2025-12-27

### Prompt
- yes I mean the source of that hardcoded URL should also be located in a config file. 

### Changes
- Consolidated relay settings into `config/relay.json` as the single config source; removed `prod-config.json`.
- Updated build and relay scripts to read `config/relay.json` and emit `relay-config-source.json` for runtime URLs.
- Added runtime relay-config URL resolution (query override + source file + fallback) across demos.
- Added nginx `relay-config.json` CORS endpoint in `secretworkshop.net`.
- Updated README, branch plan, and release test expectations for the unified config flow.

### Tests
- node --test demos/tests/demo-release.test.js
