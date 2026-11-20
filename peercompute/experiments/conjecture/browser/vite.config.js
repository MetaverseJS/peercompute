import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const peercomputeRoot = path.resolve(here, '../../..');

// Dev server for the browser experiment only. Plain HTTP on localhost is a
// secure context, which WebRTC needs.
export default defineConfig({
  root: here,
  publicDir: process.env.CONJECTURE_PUBLIC_DIR || false,
  worker: { format: 'es' },
  server: { host: '127.0.0.1', port: Number(process.env.CONJECTURE_PORT || 5391), strictPort: true,
    fs: { allow: [peercomputeRoot] } }
});
