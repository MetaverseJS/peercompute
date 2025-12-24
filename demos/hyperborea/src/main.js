import { Game } from './game/Game.js';

window.addEventListener('error', (e) => {
  console.error('Global error:', e.message, e.filename, e.lineno, e.colno, e.error);
});

window.addEventListener('load', () => {
  new Game();
});
