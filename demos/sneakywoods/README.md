# SneakyWoods Demo

A lightweight multiplayer arena that syncs player state over PeerCompute and renders a simple 3D scene with Three.js. Includes desktop + mobile controls, name/color customization, and simple attack interactions.

## Controls
- WASD / arrow keys: Move
- Mouse or arrow keys: Look
- Space / click: Attack
- Mobile: twin sticks + attack button

## Getting Started
1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Open the demo and share the URL with another client to test multiplayer.

## Notes
- The demo expects a PeerCompute relay. Update `public/relay-config.json` if your relay bootstrap peer changes.
