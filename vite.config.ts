import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@components': path.resolve(__dirname, './src/components'),
      '@types': path.resolve(__dirname, './src/types'),
      '@constants': path.resolve(__dirname, './src/constants'),
      // Add aliases for baseUrl imports (relative to src) - Vite handles subpaths automatically
      'hooks': path.resolve(__dirname, './src/hooks'),
      'Components': path.resolve(__dirname, './src/Components'),
      'utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    // Increase chunk size warning limit for large dependencies like ArcGIS
    chunkSizeWarningLimit: 1000,
  },
  // Exclude ArcGIS from optimization as it has complex package structure
  optimizeDeps: {
    exclude: ['@arcgis/core'],
  },
});

