using vite with vanilla js and js lib p2p create a minimal peer to peer miltiplayer library that runs in it's own service worker. 

Main Design Principles:

* make things modular with ES6 modules
* large components should be capable of running in their own thread as a service worker

Demo:

create a tron themed overworld consisting of a dark infinite grid of blue lines. players who connect to the p2p network should be visible on the grid and be rendered as a randomly colored cube. each player should be able to move around the grid. players should not spawn in the same place.

## Desktop and touch input follow-up — November 6 2026

- Prefer actual mouse/touch/keyboard activation over the coarse-pointer device
  heuristic. Keep the heuristic only when the event has no input-source evidence.
- Keyboard movement, turning and jumping remain independent of touch controls.
  Use one reusable touch HUD, release joystick/jump captures on mode changes,
  ignore editable/composing/modified key input and release keys on focus loss.
- Validate native mouse start on fine/coarse desktop, keyboard start, phone touch,
  switching modalities, typing in UI and blur recovery. Keep screenshots and
  SecretWorkshop connection receipts outside Git; add controller browser tests.

## Inhabited conversational agents — November 6 2026

- Replace the generic floating model-panel launcher with a scene-owned shared
  world agent host. Saved agents inhabit selectable, labeled cubes; direct text
  and voice conversations use the same persistent identity and model routing.
- Keep agent entities separate from human peer/media maps. CubeAgentLayer owns
  static collision bodies, bounded Three.js objects, raycast selection, local
  transient captions and spatial-audio poses. The shared host owns authenticated
  presence/conversation, private persistence, model resources and speech.
- Do not attach the game ComputeManager to the agent runtime: the shared host
  owns its managed worker allocation. Closing a dialog does not stop the host.
- Serialize room switches and await host cancellation/disposal before replacing
  the NodeKernel. Dispose the old layer, then restore the new room's bindings;
  retain failed-cleanup ownership for retry. Shutdown follows the same ordering.
- Test positions/descriptor limits, distinct agent/human ownership, real Cannon
  collision, native mouse/touch/Enter picking, canvas label text, caption expiry,
  texture/listener/body cleanup, floor placement and audio pose with a GPU-disabled
  browser. Initial adapter run passed7/8; the only failure was exact floating-point
  comparison of raycast height6.999999999999998 against7, corrected to tolerance.
- Full-scene multi-peer text/voice and persistent restart gates remain separate
  until shared host/protocol/speech modules complete. This slice adds stationary
  embodiment, not autonomous wandering, learned control or peer migration.
- The combined initial corrected adapter/input suite passed19/19 in4.60s;
  adapter bounds then aligned with the shared paused/offline240-character-name
  contract. P2PNetwork.stop now awaits its asynchronous NodeKernel shutdown so
  the caller can observe completion or retry a failed cleanup.
- Final scoped check: `node --test demos/tests/cubechat-agents.test.js
  demos/tests/cubechat-input.test.js` passed22/22 in6.15s on Node24. Additional
  tests prove paused/offline name compatibility and that network stop waits for
  acknowledgement, preserves ownership on failure and succeeds on retry.
  Syntax/diff checks passed; owned browsers, Vite and temporary caches closed.
  Evidence: `/home/cos/.cache/peercompute-world-agents/cube-focused-tests.log`.
- Final shared acceptance:70/70 combined world-agent checks and79/79 existing
  console/library/native-storage regressions pass. The complete production scene
  passes native picking, typing isolation, same-agent reload, desktop/mobile
  visuals and independent room/global-model SecretWorkshop connections at
  trusted HTTPS5176. Actual shared-host/CubeAgentLayer/browser fixture separately
  passes real GPU peer replies, visitor isolation, cancellation/disconnect and
  three-resident reasoning/ASR/TTS spatial playback. The fixture used encrypted
  relay requests after direct native upgrade timeouts; tiny Gemma quality was
  inconsistent. Neither movement nor autonomous agent dialogue is claimed.


## Model panel scrolling — November 7 2026

- The shared model panel now offers stored-package multi-selection at startup,
  explicit batch loading, paste/drop image attachments and confirmed overview
  navigation. Saved packages do not automatically consume model memory on opening.
- Phone layouts scroll the embedded model panel when metadata exceeds its fixed
  height. Keep the library bulk controls outside the scrolling package list.
- Camera wheel zoom belongs to the actual world canvas, selected after TronScene
  initialization or passed to PlayerController explicitly. Native dialogs,
  editable fields, UI/image canvases and handled/modified events retain browser
  scrolling. Pointer-lock ownership must not transfer camera input to another UI.
- Native controller tests14/14PASS, including actual wheel and pointer lock;
  actual promoted Cube preview must prove modal wheel reaches target/Attach/Talk/
  Send without camera movement, then prove scene-canvas wheel zoom still works.
  Preserve failed prior wheel/hit-test evidence; no GPU/model download is needed.

- Final actual5176PASS: native dialog wheels reach every composer control on
  desktop/phone with hit-tests true and camera zoom unchanged at1.0; after closing
  UI, world-canvas wheel changes zoom to1.1. Both room and model networks have
  authenticated SecretWorkshop Noise connections; no page/console/HTTP/model/
  cleanup errors. Cube-only build13.05s and internal promotion02:01:55Z preserve
  existing assets; owned browser closed.
