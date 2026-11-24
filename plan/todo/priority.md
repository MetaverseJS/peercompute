# Priority queue

Active open tasks in priority order. Completed tasks move to `plan/todo/done/`; paused tasks move to `plan/todo/hiatus/`.

1. [Core CRDT, Networking, Conjecture & Compute Hardening](core-crdt-network-hardening.md) — fix core CRDT sync storm & nested `Y.Map` loss, harden P2P trust boundaries/relays, fix & export `WorkMesh` + throughput profiles, and close core compute security/lease/cancellation bugs in isolated worktree.
2. [Publish `peercompute` and `exopute` on npm (0.1.0-alpha.1)](npm-package-reservation.md) — authenticate with `npm login`, claim free `@exopute` / `@peercompute` npm orgs and `github.com/exopute`, and publish the prepared real `peercompute` and `exopute` packages.
3. [Root Node parity & signed execution qualification](root-node.md) — qualify opt-in signed execution reports from the published client on `secretworkshop.net` and advance installed root-node hosted-model parity.
4. [Keystone throughput-emergence demo](keystone-demo.md) — flagship live demonstration of the core conjecture (slime-mold throughput-driven topology emergence across browser/edge peers).
5. [Retire `demos/multiscale` & migrate `peercompute` standalone build to Vite](retire-multiscale-and-webpack.md) — retire the legacy Multiscale demo once ULG replaces it, and replace `peercompute/webpack.config.js` with Vite.
