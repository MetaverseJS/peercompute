import './styles.css';
import { NodeKernel } from '@peercompute/index.js';
import { Game } from './game.js';

// Expose for debugging parity with the original cb.html global.
window.NodeKernel = NodeKernel;

// Log uncaught errors with more detail (helps avoid opaque "Script error." overlays)
window.addEventListener('error', (e) => {
  console.error('Global error:', e.message, e.filename, e.lineno, e.colno, e.error);
});

const start = () => new Game();

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
