# Cyberborea / Hyperborea

Standalone build of the original `cb.html` demo, now bundled with webpack and ES modules.

## Run
- `npm run dev` (serves on `http(s)://localhost:5180`; enable HTTPS by exporting `HTTPS=1 SSL_CERT=... SSL_KEY=...` to reuse the PeerCompute certs)
- `npm run build` outputs `dist/`
- `npm run tests` runs unit tests and a production build smoke check

The app reuses the existing PeerCompute relay/signal setup via `peer-config.json` (copied from `peercompute/public`), so run the PeerCompute relay as you normally would.
