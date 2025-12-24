import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { ensureDevHttpsCert } from '../../scripts/https.mjs';

export default defineConfig(({ mode, command }) => {
    const env = loadEnv(mode, '.', '');
    const peercomputeRoot = path.resolve(__dirname, '../../peercompute');
    const docsRoot = path.resolve(__dirname, '../../docs');
    return {
      base: './',
      build: {
        outDir: path.resolve(docsRoot, 'universes'),
        emptyOutDir: true,
      },
      server: {
        port: 5178,
        host: '0.0.0.0',
        https: command === 'serve' ? ensureDevHttpsCert() : undefined,
        fs: {
          allow: [__dirname, peercomputeRoot]
        }
      },
      plugins: [],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@peercompute': path.resolve(peercomputeRoot, 'src/peercompute/index.js')
        }
      }
    };
});
