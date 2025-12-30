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
- continue water system implementation and wire up the UI to the dropdown stub entry

### Changes
- Added readbackVersion tracking to WaterCycleSystem and WaterCycleVolumeSystem to sync downstream consumers.
- Implemented per-cell wind field support in OceanComputeSystem (new buffer + WGSL path) and PlanetManager hook.
- Added ocean wind field decoding helper and wired holistic weather mode to drive ocean winds from weather aux data on new readbacks.
- Added ocean wind field unit test and updated PlanetGen test script.

### Tests
- npm test (in demos/planetgen)
- read all plan files first. then update the current-branch.md file with the tasks neccessary to complete the following:
- We're on a new branch called server-changes. I'd like to get the relay server ready to run on my server at secretworkshop.net port 8080 using wss. add a prod-config file to the root directory which we can set the relay server URL and port. when running the build for production (npm run build) it should populate the demos with the production-config relay location.

### Changes
- Added a server-changes branch plan with tasks for production relay config, WSS relay setup, and build-time relay-config injection.

## Date: 2025-12-25

### Prompt
- make the ppf-cubic particle count configurable from 128 to 200000
- finish the three water system enhancements and update the holistic plan
- investigate Universes black hole lensing (no visible lensing)

### Changes
- Added holistic ocean wind coupling/update controls (UI + docs), scaled ocean wind field decode, and gated updates on a configurable cadence.
- Scaffolded cubed-sphere grid + ocean current state modules for the holistic solver and added a round-trip mapping test.
- Extended ocean wind field tests for scale handling.
- Tuned Universes lensing shader with screen-space radius scaling, stronger distortion, and added uBHRadius uniforms for more visible lensing.
- Updated holistic weather plan status notes.

### Tests
- npm test (demos/planetgen)
- node demos/webgpuphys/tests/ppf-runtime.js (initial EPERM on listen; reran with escalated permissions)

## Date: 2025-12-25

### Prompt
- not seeing the tell tales change; are they wired up?
- add more debug vectors to the ocean to show currents and waves

### Changes
- Added ocean current and wave vector overlays (new OceanVectorVisualizationSystem) and UI toggles to enable them.
- Wired ocean vectors to the ocean wind field + ocean wave normal texture for visualizing coupling impact.
- Added a unit test for ocean vector visualization and updated PlanetGen test script.

### Tests
- npm test (demos/planetgen)

## Date: 2025-12-25

### Prompt
- ocean current vectors should show both wind direction and pressure

### Changes
- Added pressure sampling to ocean vector debug overlays and wired weather texture into the ocean vector visualization.
- Updated ocean vector viz test to cover weather texture inputs.

### Tests
- npm test (demos/planetgen)
- do it!

### Changes
- Added `prod-config.json` for production relay host/port/protocol and optional peerId/ssl settings.
- Added `scripts/write-prod-relay-config.mjs` to generate demo `public/relay-config.json` for production builds.
- Added `scripts/start-relay-prod.sh` to launch the relay with prod-config defaults.
- Wired `scripts/build-all.sh` to run the production relay-config writer before demo builds.
- Added release test coverage for prod-config/build hook and updated README + branch status.

### Tests
- node --test demos/tests/demo-release.test.js

## Date: 2025-12-29

### Prompt
- can you implement a more complete ppf demo with friction iterative constraint solving and spatial acceleration?

### Changes
- Added a new PPF contact solver demo with uniform-grid neighbor lookup, iterative solver passes, and friction forces (`demos/webgpuphys/demos/ppf-contact-solver.html`, `demos/webgpuphys/demos/ppf-contact-solver.js`).
- Wired the new demo into the WebGPUPhys demo index, Vite build inputs, and README.
- Added a Playwright runtime smoke test for the new demo.

### Tests
- node demos/webgpuphys/tests/ppf-contact-runtime.js (required escalated permissions to bind a local port)

## Date: 2025-12-29

### Prompt
- I'm sorry I'm not seeing your changes when I run docs:preview

### Changes
- Rebuilt the WebGPUPhys docs bundle so `docs:preview` reflects the updated demo tiles.

### Tests
- npm run build:webgpuphys

## Date: 2025-12-29

### Prompt
- add tiles to the WebGPUPhys demos overview; move MPM visual and PPF solver into tiles with screenshots; add a PeerCompute GitHub tile with block diagram + README summary.

### Changes
- Rebuilt the WebGPUPhys demos overview into a tile grid with retro styling and staggered card reveals.
- Added dedicated tiles for MPM Visual and the new PPF contact solver with screenshots, plus a PeerCompute GitHub tile using the block diagram image and README summary.
- Copied the PeerCompute block diagram into WebGPUPhys assets for the demo index page.

## Date: 2025-12-29

### Prompt
- make the box that contains the ppf demo much larger like 10x bigger.

### Changes
- Increased the PPF contact solver box size (boxHalf = 42) and adjusted grid sizing heuristics to avoid oversized spatial buffers.

### Tests
- node demos/webgpuphys/tests/ppf-contact-runtime.js (required escalated permissions to bind a local port)

## Date: 2025-12-29

### Prompt
- ppf-contact-solver.html WGSL error: unresolved value 'prevPos'

### Changes
- Fixed the grid build shader to use the particle position rather than an undefined `prevPos` value.

### Tests
- node demos/webgpuphys/tests/ppf-contact-runtime.js (required escalated permissions to bind a local port)

## Date: 2025-12-29

### Prompt
- it looks like we aren't gitignoring the node_modules folders in the demos directory. can you fix that?

### Changes
- Added explicit `demos/**/node_modules/` ignore entry.
- Removed tracked demo `node_modules` entries from the git index so the ignore takes effect.

## Date: 2025-12-29

### Prompt
- can you explain what the ppf cubic barrier simulation is doing?

### Changes
- No code changes; provided a walkthrough of the PPF cubic barrier demo behavior and shader mechanics.

## Date: 2025-12-29

### Prompt
- can the ppf cubic barrier model be used to improve our buggy mpm simulation?

### Changes
- No code changes; explained where the cubic barrier fits (contact handling) vs core MPM stability issues.

## Date: 2025-12-28

### Prompt
- can you split the permissions stuff into it's own script? set the env var in that script.

### Changes
- Added `scripts/ensure-relay-config-perms.sh` to grant nginx read access to `relay-config.json` and export `RELAY_ACL_USER`.
- Updated `scripts/start-relay-prod.sh` to delegate permission setup to the new script.

## Date: 2025-12-28

### Prompt
- alright we're actually on the server now. can you try that stuff yourself?

### Changes
- Hardened the ACL helper to tolerate missing nginx user output and ran it to grant www-data read/execute ACLs on config/relay-config.json.

## Date: 2025-12-28

### Prompt
- do 2

### Changes
- Added websocket upgrade routing for the apex secretworkshop.net server block: proxy upgrade requests on `/` to the relay at 127.0.0.1:8080 while keeping normal HTTP redirect to GitHub Pages.
## Date: 2025-12-27

### Prompt
- cos@p2p:~/projects/peercompute$ bash scripts/start-relay-prod.sh

### Changes
- Fixed the nginx user detection command in `scripts/start-relay-prod.sh` so the ACL setup no longer fails with awk parsing errors.

## Date: 2025-12-27

### Prompt
- yes please

### Changes
- Set `config/relay.json` to advertise the public relay on 443 with `wss`, while clearing `sslCert`/`sslKey` so the relay listens with `ws` behind nginx.
- Exported `RELAY_PUBLIC_PROTOCOL` from `scripts/start-relay-prod.sh` and clarified the proxy/TLS warning message.
- Allowed `peercompute/src/relay/server.js` to override the advertised protocol in `relay-config.json` so clients still get `wss` multiaddrs.

## Date: 2025-12-27

### Prompt
- yes patch it

### Changes
- Added CORS headers for `/peercompute/config/relay-config.json` in the apex/wildcard nginx server block so GitHub Pages demos can fetch the relay config.

## Date: 2025-12-27

### Prompt
- can you add a chmod line to the start server script that makes sure nginx can read the file?

### Changes
- Ensured the relay startup script relaxes permissions for the relay-config directory/file and sets a `umask 022` so nginx can read newly written relay config files.

## Date: 2025-12-27

### Prompt
- OK do 1, and add it to the start server script but with a dynamic user based on whoever is running it and wherever the project is.

### Changes
- Switched relay-config permissions to ACLs in `scripts/start-relay-prod.sh`, detecting the nginx user dynamically and granting traverse/read access down to the repo path without global chmods.

## Date: 2025-12-27

### Prompt
- ok put these instructions at the end of log.md

### Changes
- Appended deployment checklist for VM/nginx relay config.

### Deployment Checklist (VM)
1) Pull latest repo changes on the VM.
2) Generate the relay config file from the repo root:
```
bash scripts/start-relay-prod.sh
```
3) Ensure nginx can read the config file (keep identity key private):
```
chmod 755 /home/cos /home/cos/projects /home/cos/projects/peercompute /home/cos/projects/peercompute/config
chmod 644 /home/cos/projects/peercompute/config/relay-config.json
chmod 600 /home/cos/projects/peercompute/config/relay-peer-id.json
```
4) Update the nginx alias to the repo path:
```
location = /peercompute/config/relay-config.json {
    alias /home/cos/projects/peercompute/config/relay-config.json;
    default_type application/json;
    add_header Access-Control-Allow-Origin *;
    add_header Cache-Control "no-store";
}
```
5) Reload nginx:
```
sudo nginx -t
sudo systemctl reload nginx
```
6) Verify the config URL loads:
- `https://secretworkshop.net/peercompute/config/relay-config.json`

## Date: 2025-12-27

### Prompt
- yes

### Changes
- Updated `config/relay.json` and README to point relay host/port at `secretworkshop.net:8080` instead of the subdomain.

## Date: 2025-12-27

### Prompt
- can you set the relay cert and key to the same value as the ssl cert from the nginx config file?

### Changes
- Set `sslCert` and `sslKey` in `config/relay.json` to the Let’s Encrypt paths used by nginx.

## Date: 2025-12-27

### Prompt
- looks like we weren't able to write to that location for nginx can we reconfigure nginx to serve that file directly from the config directory?

### Changes
- Pointed `relayConfigFile` to `config/relay-config.json` and updated nginx alias in `secretworkshop.net` to serve the config file from the repo config directory.
- Updated README and gitignore to reflect the new relay-config file location.

## Date: 2025-12-27

### Prompt
- lets host it at secretworkshop.net/peercompute/config/relay-config.json

### Changes
- Updated nginx config to serve the relay config at `/peercompute/config/relay-config.json`.
- Updated `config/relay.json` and README defaults to match the new relay config URL.

## Date: 2025-12-25

### Prompt
- wind vectors shouldn't be static and pressure shouldn't be uniform

### Changes
- Increased pressure relaxation + wind response rates and added time-varying turbulence/planetary-wave forcing so wind vectors evolve.
- Reduced reliance on the Hadley-only fallback by blending in dynamic pressure and widened pressure color range for clearer variation.

### Tests
- npm test (demos/planetgen)
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

## Date: 2025-12-29

### Prompt
- ya that was your mistake. I wanted those tiles added to the root docs index.

### Changes
- Added root docs tiles for MPM Visual, the PPF contact solver, and the PeerCompute GitHub page, plus updated the WebGPUPhys tile links.
- Added root docs assets for the new tiles (MPM visual, PPF solver, PeerCompute block diagram).

## Date: 2025-12-29

### Prompt
- the orbit controls and input are broken on mobile for the toychest and ppf solver. it only moves a fraction of an inch. on load you should be zoomed out twice as far on the dynamics and ppf solver demos.

### Changes
- Improved OrbitCamera touch handling with multi-touch pinch zoom + pan, disabled default touch gestures on the canvas, and boosted touch rotate speed.
- Doubled initial camera radius for Toychest and the PPF contact solver demos.

## Date: 2025-12-29

### Prompt
- on mobile make sure the shapes demo UI controls are collapsed on the toychest demo, also particles per side should default to 2 for mobile or desktop.

### Changes
- Set Toychest particle resolution default to 2 and collapse the lil-gui controls on coarse pointer/touch devices.

## Date: 2025-12-29

### Prompt
- the vertical look is inverted by default on the right mobile stick in cubechat. please change that.

### Changes
- Flipped the mobile look joystick vertical direction so pushing up looks up by default.

## Date: 2025-12-29

### Prompt
- we're in a new chat. please review all plan files. take a careful look at the current-branch.md file which links to "demo-fixes.md" consider the list of items and come up with a plan to implement them. suggest how we break up these tasks into a couple branches and which ones we should do first. think really deeply about all of this and how it ties into the larger plan for peercompute. once you have this plan typed out in current-branch. we can go  over it together and you can dig in and start working.

### Changes
- Reviewed plan files and expanded plan/branch/demo-fixes.md with a branch breakdown, dependencies, and a prioritized implementation plan aligned with the PeerCompute roadmap.

## Date: 2025-12-29

### Prompt
- I added a new demo called keystone demo. factor that into your plans

### Changes
- Added the Keystone demo to the demo-experiences branch list and updated the suggested ordering in plan/branch/demo-fixes.md.

## Date: 2025-12-29

### Prompt
- do 2. also thie whole plan looks good. I'd like you to update the rest of the plan files and readme's architecture etc to match.

### Changes
- Added a dedicated Keystone demo plan at plan/branch/keystone-demo.md and linked it from the demo-fixes branch plan.
- Updated plan/plan.md, plan/arch/arch.md, and plan/branch/distributed-compute.md to reflect the Keystone demo as a validation surface for topology + placement.
- Updated README.md, peercompute/README.md, and demos/README.md to mention the Keystone demo in the docs and demo backlog.

## Date: 2025-12-29

### Prompt
- OK I redid the ordering a little bit. go ahead and dig in with #1.

### Changes
- Added telemetry counters to NetworkManager, exposed getTelemetrySnapshot, and documented it in the API/arch notes.
- Scaffolded the NetViz demo with a retro terminal HUD, warm-delta telemetry publishing, and a minimal 3D node/edge view.
- Wired NetViz into workspaces/dev scripts, updated docs index + demo README list, and added a telemetry unit test.

### Tests
- node --test peercompute/tests/unit/networkManager.telemetry.test.js

## Date: 2025-12-29

### Prompt
- you should be able to see the connections between the other peers as well.

### Changes
- NetViz now derives peer-to-peer edges from telemetry snapshots and renders non-local connections; HUD marks inferred nodes as GHOST.

## Date: 2025-12-29

### Prompt
- Add RTT/throughput sampling (ping + byte rate) into the telemetry snapshot. Upgrade NetViz visuals to the full tron grid + NURBS edge paths. add the ability to click a node to show an info window about that node. same goes for an edge.

### Changes
- Added telemetry sampling in NetworkManager (byte-rate tracking + RTT ping sampling) and extended telemetry snapshots with rates/RTT fields.
- Upgraded NetViz visuals with a layered tron grid and NURBS tube edges, and added node/edge inspectors via raycast picking.
- Updated NetViz docs and API/arch notes to reflect the new telemetry fields.

### Tests
- node --test peercompute/tests/unit/networkManager.telemetry.test.js

## Date: 2025-12-29

### Prompt
- continue with the netvis updates. one thing that seems odd. we're seeing more nodes than actually exist how are you uniquely identifying them? also have the netvis demo automatically connect to the telemetry room.

### Changes
- NetViz now auto-connects to the telemetry room on load and documentation notes the behavior.

## Date: 2025-12-29

### Prompt
- add a checkbox to hide ghosts. set it by default.

### Changes
- Added a "Hide ghosts" toggle to NetViz (default on) and filtered inferred nodes/edges when enabled.

## Date: 2025-12-29

### Prompt
- add a checkbox to enable auto rotate. disable it by default. add orbit controls so the user can pan and zoom.

### Changes
- Added orbit controls to NetViz for pan/zoom and an auto-rotate toggle (default off).
- Updated NetViz UI and README to reflect the new controls.

## Date: 2025-12-29

### Prompt
- add a visual indication to the nurbs link when mesages are sent or received from your direct peers. maybe something that travels along the nurbs line. higher bandwidth should be shown as a thicker line.

### Changes
- Added animated tx/rx pulses that travel along NetViz NURBS edges based on recent telemetry activity.
- Scaled edge tube thickness using throughput and preferred local peer metrics for directional edge data.
- Updated NetViz README to mention pulse activity and bandwidth-based thickness.

## Date: 2025-12-29

### Prompt
- watching my server log now. is that what the peercompute-stat pc-snapshot info is showing?

### Changes
- Clarified that relay logs summarize pubsub snapshot traffic (`pc-snapshot`) on the state topics, which can include NetViz telemetry warm deltas; no code changes.

## Date: 2025-12-29

### Prompt
- I see. so why does the relay have to handle all of that. shouldn't this be passed directly through the libp2p network via webRTC or websockets or something?

### Changes
- Explained that browsers currently connect via WSS to the relay and pubsub forwarding requires the relay to subscribe, so snapshots flow through it unless direct peer transports (e.g., WebRTC) are added; no code changes.

## Date: 2025-12-29

### Prompt
- right OK but the browser based js-libp2p example we based our relay server on shows the connection like the attached screenshot... how difficult would it be to implement that? Don't actually implement it just gauge difficulty and add it to the current-branch.md plan.

### Changes
- Reviewed the js-libp2p browser pubsub example and added a WebRTC direct-connection upgrade item with difficulty notes to plan/branch/current-branch.md; no code changes.

## Date: 2025-12-29

### Prompt
- alright we definitely want to do that soon. but first I want you to decrease the total ammount of messages being sent in the netviz maybe just reduce the update freq. Then add a ? button with an explanation for what the netviz is. and what they are seeing. then I want you to add it to the demos page as a tile in the demo overview page.

### Changes
- Reduced NetViz telemetry publish/snapshot cadence to cut message volume.
- Added a help toggle with an explanatory panel in the NetViz HUD.
- Verified the NetViz tile is present in the docs demo overview.

## Date: 2025-12-29

### Prompt
- alright we're on a new branch dedicated to implementing the webrtc functionality. knock yourself out. write your own tests runtime and unit you can run to validate functionality. port all demos over. go as long as you can without my input.

### Changes
- Added WebRTC config normalization, direct-first dialing, and relay pruning when direct connections are available in `NetworkManager`, with NodeKernel passing through WebRTC settings.
- Extended relay config generation + relay server output to include WebRTC config, and wired `scripts/start-relay-prod.sh` to export it.
- Ported demo NodeKernel usage to pass WebRTC settings from relay-config (NetViz, DaddyGo, CubeChat, Hyperborea, SneakyWoods + room directory nodes).
- Regenerated demo `public/relay-config.json` files to include WebRTC config defaults.
- Added unit tests for WebRTC config/relay pruning + a runtime smoke script.

### Tests
- node --test peercompute/tests/unit/*.test.js
- node peercompute/tests/runtime/webrtc-config.smoke.js

## Date: 2025-12-29

### Prompt
- alright in the netviz change the color of the nurbs line to amber when it's a direct connection with webRTC

### Changes
- Added telemetry edge `via` propagation in NetViz so edges can track WebRTC connections.
- Updated NetViz edge rendering to tint NURBS tubes amber when the edge is marked as WebRTC-direct.

## Date: 2025-12-29

### Prompt
- interesting. they turn amber in both windows then revert back to green.

### Changes
- Kept preferred connection type on `peer:connect` so WebRTC links don't get downgraded to a generic `connection` via flag.

## Date: 2025-12-29

### Prompt
- you should add any active relay servers to the netviz. you should render those above the plane where the peer nodes are. identify them with a green icosahedron. peers should be rendered in amber. a connection to a peer that passes through the relay server should be rendered as green with a green nurbs that connects the midpoint of the peer nurbs connection to the relay server.

### Changes
- Added relay peer detection from bootstrap config/telemetry, included active relays in NetViz, and tagged them in the HUD list.
- Updated NetViz node styling to render peers in amber and relays as green icosahedrons above the plane.
- Rendered relayed peer connections in green with a relay spur NURBS linking the edge midpoint to the relay node.

## Date: 2025-12-29

### Prompt
- make all the netvis console info divs render inside a single collapsible window that can be expanded or collapsed via a [console] button in the top left of the screen. when viewing the visualization from a mobile device make sure the console window doesn't take up more than half of the screen vertically. I'd like you to show the relay pub-sub messages in the visualization. render pub-sub lines as blueish white... also the peer cubes should be rendered as amber as well. and the relay icosahedron should appear as blueish white. clicking the icosahedron should show something in the node info window telling you it is a relay server.

### Changes
- Collapsed NetViz HUD into a single console window with a [console] toggle button and added mobile max-height constraints.
- Added pubsub telemetry tracking in NetworkManager and visualized relay pubsub arcs with directional pulses.
- Updated NetViz styling to render peers in amber, relays in blue-white icosahedrons, and annotate relay nodes in the inspector.

## Date: 2025-12-29

### Prompt
- style the scrollbars to match the aesthetic and wordwrap the peerID so it doesn't cause horizontal scrolling like in the screenshot. for the netviz: throttle the presence heatbeats to every 15 seconds. lets dial the PC snapshot back to once every 5 seconds.

### Changes
- Styled the NetViz console scrollbar to match the neon theme and enabled word wrapping in console text to avoid horizontal scrolling.
- Added configurable presence heartbeat interval support and set NetViz to 15s.
- Reduced NetViz snapshot cadence to one every 5 seconds.

## Date: 2025-12-29

### Prompt
- I updated the netviz screenshot to be a gif in the demo/netviz folder can you make the overview tile for netviz use this gif instead of the current diagram?

### Changes
- Pointed the NetViz demo tile on the docs overview page to the new `demos/netviz/netviz-screenshot.gif`.
