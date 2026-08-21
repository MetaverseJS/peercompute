Instructions: This file contains short term goals for the current branch.

## Branch Goal: Production backend stack + runtime config for relay.secretworkshop.net (WSS)

### Requirements
- Relay reachable at `wss://relay.secretworkshop.net` (443) with nginx TLS termination -> relay on 8080.
- TURN/STUN available with the same host/credentials advertised through `webrtc.iceServers`.
- Single backend launcher (`scripts/pcserver.sh`) starts relay + TURN/STUN together.
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

3) Backend TURN/STUN wiring
- Add `scripts/start-turn-prod.sh` to generate a coturn-compatible config from `config/relay.env` / `config/relay.json`.
- Add `scripts/pcserver.sh` to launch relay + TURN/STUN together and stop both on failure/shutdown.
- Extend the relay systemd installer so the backend stack starts at `multi-user.target`.

4) Production build config injection
- Add `scripts/write-prod-relay-config.mjs` to read `config/relay.json` and write
  `relay-config.json` + `relay-config-source.json` into each demo's `public/` folder.
- Wire the script into `npm run build` (prebuild step in `scripts/build-all.sh`).
- Ensure `relay-config.json` includes the full bootstrap multiaddr for the relay (WSS + peerId).

5) Validation
- Add a small test in `demos/tests/demo-release.test.js` for `config/relay.json`
  and backend/build script usage.
- Add a dedicated backend script suite in `demos/tests/backend-server.test.js` for
  TURN config generation, `pcserver.sh` mode selection, shell syntax checks, and
  relay systemd backend wiring.
- Manual: run `npm run build` and confirm the built demo `relay-config.json` files contain
  the production relay address.
- Headless: run `npm run test:backend` and, when isolating shell behavior, validate
  `scripts/start-turn-prod.sh --dry-run` and `scripts/pcserver.sh --dry-run`.

### Status
- [x] Unified config file in `config/relay.json` defined + documented.
- [x] Relay production launcher (WSS, 8080, certs).
- [x] Backend TURN/STUN launcher and combined `pcserver.sh` supervisor.
- [x] Relay systemd installer now launches the backend stack at the relay runlevel.
- [x] Build pipeline writes production relay-config.json + relay-config-source.json into demos.
- [x] Tests/validation updated.
- [x] Persist relay identity key so peerId stays stable across restarts.
- [x] Runtime relay-config URL override + source file support in demos.

### 2026-08-21 Production Redeploy Directive

- Complete the audited `ulg` source and generated-frontend release before
  changing the production backend. Do not deploy the stale local-build relay
  fallbacks currently present in the worktree.
- Deploy the production Go relay and coturn/STUN service to the
  `secretworkshop.net` host through the existing split systemd service model.
- Treat the live runtime config as part of the deployment contract: it must
  advertise the public WSS bootstrap peer plus a STUN entry and authenticated
  TURN UDP/TCP entries that match the running coturn service.
- Keep `publicHost` empty in the checked-in production config. The prior
  literal no longer matched production DNS and the combined TURN launcher could
  have mistaken it for coturn's `external-ip`; NAT deployments must provide
  `PCSERVER_TURN_EXTERNAL_IP` explicitly after verifying the host address.
- Capture current remote Git/service/config/listener state before mutation and
  retain a rollback path for service units and coturn/relay configuration.
- Verify HTTPS runtime-config CORS, WSS relay discovery, STUN binding, TURN UDP,
  TURN TCP, and a focused browser relay-only media path after deployment.
- Keep the full chaos lab out of this release unless separately requested.

Status: the source and generated frontend release is validated and included in
the current `ulg` release checkpoint. Public config/CORS, WSS, dual-stack STUN,
and native authenticated TURN UDP/TCP pass, but Chrome TURN allocation fails
with error `701` over both transports. Backend mutation is blocked pending
authenticated host access plus coturn logs/config review; healthy services were
not restarted blindly. Tracked under ICC task
`ulg-release-secretworkshop-deploy-20260821`.
