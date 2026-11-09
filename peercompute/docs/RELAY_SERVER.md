# PeerCompute relay and TURN deployment

The libp2p Circuit Relay v2 server gives browser peers a reachable rendezvous
point and a relayed transport when direct WebRTC is unavailable. Pubsub discovery,
room scoping and ICE configuration are separate parts of establishing a session.
A connected relay alone does not prove that another peer can accept a request.

Run commands below from the **repository root**, using Node.js **24 LTS**.
[Library guide](../README.md) · [Project setup](../../README.md#quick-start)

## Runtime selection and local development

- [`scripts/run-relay.sh`](../../scripts/run-relay.sh) selects Go by default and
  falls back to Node if Go is missing, unless `RELAY_REQUIRE_GO=1`.
- Production uses Go with strict startup; no silent Node fallback.
- The Deno relay is legacy and is not selected by the current launchers.

To select a runtime explicitly:

```bash
RELAY_IMPL=node npm run dev:relay
RELAY_IMPL=go npm run dev:relay
```

For Go, use the toolchain required by
[`peercompute/src/relay-go/go.mod`](../src/relay-go/go.mod). The direct launcher is
`bash scripts/run-go-relay.sh`. To start the local relay plus demo stack, run
`npm run dev` or `npm run dev:local-relay`.

Local demo launchers keep relay addresses loopback-safe by default. Opt into LAN
exposure with `RELAY_DEV_EXPOSE_LAN=1 npm run dev:local-relay`. Their default
`DEV_STRICT_PORT=1` makes port conflicts fail instead of moving a demo; use
`DEV_STRICT_PORT=0` only when automatic fallback is intended.

For a VPN/LAN host with coturn already running:

```bash
npm run dev:vpn-coturn -- --dry-run
npm run dev:vpn-coturn
```

This launcher detects a Tailscale IPv4 address when available, binds the demo
stack on `0.0.0.0`, disables automatic browser opening and advertises one host for
WSS and TURN. Override `RELAY_PUBLIC_HOST`, `RELAY_LISTEN_HOST`,
`RELAY_LISTEN_PORT`, `RELAY_TURN_HOST`, `RELAY_TURN_PORT`,
`RELAY_TURN_USERNAME` and `RELAY_TURN_CREDENTIAL` when needed. Use a trusted HTTPS
certificate valid for the exact hostname or IP that clients open.

## Host configuration

[`config/relay.json`](../../config/relay.json) holds shared host settings;
`config/relay.env` supplies local environment overrides. Do not commit private
keys, credentials or runtime identity files.

| Setting | Purpose |
| --- | --- |
| `relayHost`, `relayPort`, `relayProtocol` | Browser-facing relay address, typically the public hostname, `443`, `wss` |
| `relayPeerId` / `bootstrapPeers` | Stable relay identity or explicit full multiaddrs |
| `relayIdentityFile` / `RELAY_IDENTITY_FILE` | Persist the server identity across restarts |
| `listenHost`, `listenPort` | Local bind address, such as `127.0.0.1:8080` behind a proxy |
| `relayConfigFile`, `relayConfigUrl` | Generated configuration file and its public discovery URL |
| `webrtc.iceServers` | STUN/TURN URLs and browser-visible TURN credentials |

`RELAY_PUBLIC_HOST`, `RELAY_PUBLIC_PORT`, `RELAY_PUBLIC_PROTOCOL`,
`RELAY_LISTEN_HOST` and `RELAY_LISTEN_PORT` override host settings. Relay IDs and
multiaddrs are printed as `Relay Server ID` / `Relay Address` at startup. Actual
listen ports come from configuration; a port of `0` requests an ephemeral port.

For example, a browser-facing multiaddr is:

```text
/dns4/relay.example.com/tcp/443/wss/p2p/<relay-peer-id>
```

Keep public advertisement separate from local binding. The Go relay uses public
host/protocol/port for libp2p advertisements and reservations as well as generated
JSON; a wrong advertised address can break peer dialing even when the initial
WebSocket connection succeeds.

## Browser configuration

`npm run build` generates each demo's `public/relay-config.json` and
`public/relay-config-source.json`. Shared demo loading resolves:

1. `?relayConfigUrl=...` override.
2. The URL in `relay-config-source.json`.
3. Local `relay-config.json` fallback.

The repository's public discovery URL is
`https://secretworkshop.net/peercompute/config/relay-config.json`. A minimal local
configuration has this shape:

```json
{
  "bootstrapPeers": [
    "/ip4/127.0.0.1/tcp/9090/ws/p2p/<relay-peer-id>"
  ]
}
```

Use the actual generated address, not this placeholder. Applications pass
`bootstrapPeers` into NodeKernel and apply the corresponding `webrtc`/ICE
configuration. Peers must share their game, topology and room scope. Multiple
relay addresses may be supplied for redundancy. Model files and private agent
records are separate from pubsub/shared-state synchronization.

## Production launch and TLS

[`scripts/pcserver.sh`](../../scripts/pcserver.sh) runs the relay and local
TURN/STUN service together, using the shared config and environment overrides:

```bash
npm run backend:dry-run
RELAY_IMPL=go \
RELAY_SSL_CERT=/path/to/fullchain.pem \
RELAY_SSL_KEY=/path/to/privkey.pem \
bash scripts/pcserver.sh
```

`RELAY_SSL_CERT` / `RELAY_SSL_KEY` select relay TLS files (with `SSL_CERT` /
`SSL_KEY` fallbacks). Production Go startup sets `RELAY_REQUIRE_GO=1`.
To run only the production relay, use `bash scripts/start-relay-prod.sh`.

With TLS terminated on a dedicated nginx/Caddy relay hostname, bind the relay
locally with empty relay certificate fields. A minimal nginx WebSocket location
inside that TLS virtual host is:

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

Set `RELAY_PUBLIC_HOST` to the proxy hostname, `RELAY_PUBLIC_PORT=443` and
`RELAY_PUBLIC_PROTOCOL=wss`. Serve `relayConfigFile` at the configured public
configuration URL with CORS for demo origins. Match the proxy route to the
advertised WebSocket address.

## systemd services

The one-command installer defaults to separate relay and coturn services:

```bash
sudo -E env "PATH=$PATH" bash scripts/install-prod-systemd-services.sh --dry-run
sudo -E env "PATH=$PATH" bash scripts/install-prod-systemd-services.sh
```

This installs `peercompute-relay.service` with Go and
`peercompute-coturn.service` for TURN/STUN. Use `--combined` to install one backend
unit instead. The installer's dry run prints its intended commands without
installing services.

For the individual combined-backend installer:

```bash
sudo -E bash scripts/install-relay-systemd.sh
```

It runs `scripts/pcserver.sh`, defaults `RELAY_IMPL=go`, sets
`RELAY_REQUIRE_GO=1` for Go and records the install-time `PATH`. Override
`RELAY_SERVICE_NAME`, `RELAY_SERVICE_USER` and `RELAY_SERVICE_GROUP` as needed.
Set `PCSERVER_ENABLE_TURN=0` to make this unit relay-only before installing a
separate coturn service.

```bash
systemctl status peercompute-relay
journalctl -u peercompute-relay -f
```

## TURN/STUN configuration

The shared config currently lists Google STUN and UDP/TCP coturn endpoints on
`secretworkshop.net:3478`. To use another TURN host, set local overrides:

```bash
RELAY_TURN_HOST=turn.example.com
RELAY_TURN_PORT=3478
RELAY_TURN_USERNAME=peer
RELAY_TURN_CREDENTIAL='<turn-password>'
```

`pcserver.sh` and `start-turn-prod.sh` use these same settings when generating
coturn configuration. `RELAY_WEBRTC_CONFIG` accepts a full JSON configuration when
per-field composition is unsuitable. For a TURN host behind NAT, also set
`PCSERVER_TURN_EXTERNAL_IP` and `PCSERVER_TURN_RELAY_IP` to its public and local
addresses. `PCSERVER_TURN_LISTEN_IP` controls its bind address.

A standalone coturn configuration can start from:

```ini
listening-port=3478
fingerprint
lt-cred-mech
user=peer:<turn-password>
realm=turn.example.com
stale-nonce
no-multicast-peers
no-tls
no-dtls
min-port=49152
max-port=65535
total-quota=200
bps-capacity=0
```

That example is plaintext TURN on port 3478. Configure certificates/listeners
separately for TURN over TLS. Only use additional directives such as
`no-loopback-peers` if the installed coturn parser supports them; the repository's
generated config handles the supported service path.

To install a standalone coturn unit after creating its config:

```bash
sudo apt update
sudo apt install -y coturn
sudoedit /etc/turnserver.conf
sudo -E bash scripts/install-coturn-systemd.sh
```

Optional overrides are `COTURN_SERVICE_NAME`, `COTURN_SERVICE_USER`,
`COTURN_SERVICE_GROUP` and `COTURN_CONFIG_FILE`. The helper installs and starts
`/etc/systemd/system/<service>.service` and prints status.

Keep TURN credentials and browser ICE entries aligned. Use deployment-specific
credentials and rotate them; allow `3478/tcp`, `3478/udp` and the configured UDP
relay range through the firewall. Both relay implementations currently allow
1000 reservations with a one-hour reservation TTL and disable default per-circuit
limits; do not assume the historical 100-reservation/50-MB defaults apply.

## Checks and troubleshooting

- **Port conflict:** check the configured listen port and existing service. A
  random port is used only when requested with port `0`.
- **Relay connection failure:** verify WSS hostname, certificate, peer ID,
  firewall and public advertisement. Test the generated configuration URL with
  `curl --fail --show-error`; an HTTP response from the relay socket is not proof
  of a libp2p connection.
- **Connected but no peers:** check discovery/pubsub and matching game, topology
  and room scopes. Inspect actual encrypted connections in NetViz.
- **ICE failure:** verify coturn reachability and credentials. A bounded check is
  `turnutils_uclient -u peer -w '<turn-password>' -p 3478 -n 1 -m 1 -y <turn-host>`.
- **Core browser tests:** run `npm --prefix peercompute run test:auto` to launch
  the test relay and Playwright harness; see the [library guide](../README.md#tests).

## Architecture

```text
┌─────────────┐         ┌─────────────┐
│  Browser A  │         │  Browser B  │
│   (Node 1)  │         │   (Node 2)  │
└──────┬──────┘         └──────┬──────┘
       │                       │
       │ WebSocket (WS/WSS)    │ WebSocket (WS/WSS)
       │                       │
       ├───────────────────────┤
       │                       │
       ▼                       ▼
┌─────────────────────────────────────┐
│      libp2p Relay Server             │
│   - WebSocket transport             │
│   - Configured listen/public ports  │
│   - Circuit Relay v2                │
│   - Pubsub discovery                │
└─────────────────────────────────────┘
```

## References

- [Circuit Relay v2 specification](https://github.com/libp2p/specs/blob/master/relay/circuit-v2.md)
- [js-libp2p](https://github.com/libp2p/js-libp2p)
- [Relay configuration](../../config/relay.json)
- [Backend entry point](../../scripts/pcserver.sh)
