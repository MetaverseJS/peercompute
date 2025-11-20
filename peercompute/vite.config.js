import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

/**
 * Vite configuration for PeerCompute
 * 
 * This configuration is designed to address bundling issues with libp2p v3
 * in a browser environment. The primary goal is to prevent the build process
 * from stripping necessary properties from libp2p modules (e.g., the 'protocol'
 * property from the noise() encrypter).
 */
export default defineConfig({
  plugins: [
    // Provides polyfills for Node.js core modules that are not available in the browser.
    // This is crucial for libraries like libp2p that have Node.js dependencies.
    nodePolyfills({
      // Options to include/exclude specific polyfills if needed
      protocolImports: true,
    }),
  ],

  // Explicitly define global variables to mimic a Node.js environment
  define: {
    'global': 'globalThis',
  },

  // Server configuration for local development
  server: {
    port: 5173,
    strictPort: true,
  },

  // Build-specific configuration
  build: {
    // Target modern browsers that support top-level await and other ES2022 features
    target: 'es2022',
    
    // During debugging, it can be helpful to disable minification to inspect the bundle
    minify: false,
  },

  // Optimize dependencies
  optimizeDeps: {
    esbuildOptions: {
      // Define global for esbuild as well
      define: {
        global: 'globalThis',
      },
      target: 'es2022',
    },
    // Force include CJS dependencies that are used by excluded ESM packages
    include: [
      'netmask',
      'eventemitter3',
      'hashlru',
      'protons-runtime',
      'uint8arrays',
      'denque',
      'debug'
    ],
    // We exclude libp2p modules from optimization to ensure they are served as native ESM
    // This often prevents issues where properties like 'protocol' are stripped during CJS conversion
    exclude: [
      'libp2p',
      '@libp2p/plaintext',
      '@libp2p/noise',
      '@libp2p/yamux',
      '@chainsafe/libp2p-gossipsub',
      '@libp2p/bootstrap',
      '@libp2p/kad-dht',
      '@libp2p/webrtc',
      '@libp2p/websockets',
      '@libp2p/circuit-relay-v2',
      '@libp2p/identify',
      '@libp2p/ping',
      '@libp2p/pubsub-peer-discovery'
    ],
  },
});
