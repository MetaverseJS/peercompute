Instructions: This file contains short term goals for the current branch.

## Branch Goal: Production relay + demo config for secretworkshop.net:8080 (WSS)

### Requirements
- Relay server runs on secretworkshop.net:8080 over WSS with valid certs.
- Root `prod-config.json` defines the relay host/port used for production builds.
- `npm run build` writes production relay bootstrap addresses into demo `relay-config.json`.

### Plan
1) Production config file
- Add `/prod-config.json` schema: `relayHost`, `relayPort`, `relayProtocol` (default `wss`), optional `relayPeerId` or `bootstrapPeers`.
- Document production usage in `README.md` and keep `config/relay.json` as the dev-only config.

2) Relay server production wiring
- Add `scripts/start-relay-prod.sh` to read `prod-config.json` and export:
  - `RELAY_PUBLIC_HOST`, `RELAY_PUBLIC_PORT`, `RELAY_LISTEN_HOST`, `RELAY_LISTEN_PORT`.
  - `RELAY_SSL_CERT` and `RELAY_SSL_KEY` (paths or env overrides).
- Ensure the relay advertises the public WSS multiaddr for secretworkshop.net:8080.
- Optional: persist relay identity key so peerId stays stable across restarts.

3) Production build config injection
- Add `scripts/write-prod-relay-config.mjs` to read `prod-config.json` and write
  `relay-config.json` into each demo's `public/` folder.
- Wire the script into `npm run build` (prebuild step in `scripts/build-all.sh`).
- Ensure `relay-config.json` includes the full bootstrap multiaddr for the relay (WSS + peerId).

4) Validation
- Add a small test in `demos/tests/demo-release.test.js` for `prod-config.json`
  and build script usage.
- Manual: run `npm run build` and confirm the built demo `relay-config.json` files contain
  the production relay address.

### Status
- [x] Prod config file defined + documented.
- [x] Relay production launcher (WSS, 8080, certs).
- [x] Build pipeline writes production relay-config.json into demos.
- [x] Tests/validation updated.
- [ ] Optional: persist relay identity key so peerId stays stable across restarts.
