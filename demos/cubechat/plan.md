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
