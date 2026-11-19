# SecretWorkshop root registry deployment

The first service is a persistent Chromium client running the existing
NodeKernel/StateManager and the model-evidence RPC. It connects through the
existing production relay. The optional native companion is disabled here;
no relay, TURN, ports, certificates or existing service unit need replacement.
This release accepts structural observations; it does not load models or accept
remote executable code. Node 24 and system Chrome/Chromium are prerequisites.

Build from a clean source export, with the validated dependency tree available:

```sh
node root-node/deploy/build-release.mjs /absolute/external/release-directory
```

Install releases under `/opt/peercompute-root/releases/<revision>` and atomically
point `/opt/peercompute-root/current` at the chosen release. In that release run
`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --omit=dev --ignore-scripts`.
The generated package pins the already-tested Playwright version. It uses system
Chromium; it does not download a second browser. Keep the resulting lock file
with the deployed release. The minimal Node supervisor does not need Vite or
libp2p dependencies when `--no-build` and `companion.enabled=false` are used.

Create an unprivileged `peercompute-root` service user, private
`/var/lib/peercompute-root/runtime`, and readable
`/var/lib/peercompute-root/public`. The parent/public directory must be traversable
by nginx, but keep runtime/profile data mode 0700. Copy the release `browser/`
contents to `/var/lib/peercompute-root/runtime/bundle/` with service-user ownership.
Do not replace the profile or `installation.json` during upgrades or rollback.

Write `/etc/peercompute-root.json` (root-owned, readable by service user):

```json
{
  "dataDir": "/var/lib/peercompute-root/runtime",
  "port": 5199,
  "chromePath": "/usr/bin/google-chrome",
  "chromeArgs": ["--disable-gpu"],
  "bootstrapPeers": ["COPY_CURRENT_SECURE_BOOTSTRAP_FROM_PRODUCTION_RELAY_CONFIG"],
  "connectNetwork": true,
  "requireHardwareGpu": false,
  "companion": {"enabled": false},
  "directoryFile": "/var/lib/peercompute-root/public/model-evidence.json"
}
```

Install `peercompute-root.service`, start only that unit, and verify its loopback
`http://127.0.0.1:5199/health`: browser ready, persisted identity, connected,
evidence serving, no directory error. Confirm the actual Node executable is
version 24 before starting. Chromium's sandbox stays enabled.

Include `nginx-evidence.conf` in the existing SecretWorkshop TLS server, run
`nginx -t`, then reload nginx. Do not run the combined relay/TURN installer.
Verify the exact public descriptor URL from another host, its expiry and secure
root circuit address; then submit/query signed observations from a browser.
The descriptor refreshes with root health and expires after two minutes.

Restart the root unit and confirm unchanged peer ID, IndexedDB receipts and
successful delivery/query. Check production relay WebSocket connectivity and
TURN service health before and after. Keep the previous release for rollback;
stop this unit, restore its release symlink and bundle, then restart. The original
persistent origin/port and runtime data must remain unchanged.

**Local qualification (2026-11-15):** clean source commit `cc4f6dd7` produced a
standalone release that starts with only Playwright/core installed and system
Chromium, with its sandbox enabled. CPU-only operation, disabled companion,
and a full supervisor restart preserve identity and committed model evidence.
No source tree, Vite, or native relay dependencies are needed at runtime.

**Live deployment (2026-11-18):** SecretWorkshop runs release `cc4f6dd7` with
Node 24 under `/opt/peercompute-root/runtime/node/bin/` and system Chrome.
Public discovery and encrypted browser submission/query passed. A service
restart retained the peer identity and committed receipt. The original nginx
virtual host is backed up at
`/var/backups/secretworkshop.net.pre-peercompute-root`. Relay and TURN service
configuration was not changed.
