Instructions: This file contains short term goals for the current branch.

## Branch Goal: Production relay + runtime config for relay.secretworkshop.net (WSS)

### Requirements
- Relay reachable at `wss://relay.secretworkshop.net` (443) with nginx TLS termination -> relay on 8080.
- `config/relay.json` is the single source of truth for relay host/port and runtime config URL.
- `npm run build` writes production relay bootstrap addresses into demo `relay-config.json`.
- Demos fetch relay config at runtime via `relay-config-source.json` + query override.

### Plan
1) Production config file
- Use `config/relay.json` for both dev and prod: `relayHost`, `relayPort`, `relayProtocol` (default `wss`),
  optional `relayPeerId` or `bootstrapPeers`, plus `relayConfigUrl`/`relayConfigFile`.
- Document the unified config in `README.md`.

2) Relay server production wiring
- Add `scripts/start-relay-prod.sh` to read `config/relay.json` and export:
  - `RELAY_PUBLIC_HOST`, `RELAY_PUBLIC_PORT`, `RELAY_LISTEN_HOST`, `RELAY_LISTEN_PORT`.
  - `RELAY_SSL_CERT` and `RELAY_SSL_KEY` (paths or env overrides).
- Persist relay identity via `RELAY_IDENTITY_FILE` (from `config/relay.json`).
- Ensure the relay advertises the public WSS multiaddr for secretworkshop.net:8080.

3) Production build config injection
- Add `scripts/write-prod-relay-config.mjs` to read `config/relay.json` and write
  `relay-config.json` + `relay-config-source.json` into each demo's `public/` folder.
- Wire the script into `npm run build` (prebuild step in `scripts/build-all.sh`).
- Ensure `relay-config.json` includes the full bootstrap multiaddr for the relay (WSS + peerId).

4) Validation
- Add a small test in `demos/tests/demo-release.test.js` for `config/relay.json`
  and build script usage.
- Manual: run `npm run build` and confirm the built demo `relay-config.json` files contain
  the production relay address.

### Status
- [x] Unified config file in `config/relay.json` defined + documented.
- [x] Relay production launcher (WSS, 8080, certs).
- [x] Build pipeline writes production relay-config.json + relay-config-source.json into demos.
- [x] Tests/validation updated.
- [x] Persist relay identity key so peerId stays stable across restarts.
- [x] Runtime relay-config URL override + source file support in demos.
