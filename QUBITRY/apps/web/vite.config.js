import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const p = d => path.resolve(import.meta.dirname, d);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@qubitry/quantum-core': p('../../packages/quantum-core/src/index.js'),
      '@qubitry/quantum-algorithms': p('../../packages/quantum-algorithms/src/index.js')
    }
  }
});
