import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: './', // Use relative paths for assets
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 5174 // Avoid conflict with main project
  }
});
