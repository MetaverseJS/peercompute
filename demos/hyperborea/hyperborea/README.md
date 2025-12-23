# Cyberborea / Hyperborea

Standalone build of the original `cb.html` demo, now bundled with webpack and ES modules.

## Run
- `npm run dev` (defaults to **HTTPS** at `https://localhost:5180` when `peercompute/certs/dev.{crt,key}` exist; override with `HTTPS=0` or custom `SSL_CERT`/`SSL_KEY`)
- `npm run build` outputs `dist/`
- `npm run tests` runs unit tests and a production build smoke check

The app reuses the existing PeerCompute relay setup via `relay-config.json` (copied from `peercompute/public`), so run the PeerCompute relay as you normally would.
