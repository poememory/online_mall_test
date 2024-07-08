import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host:'0.0.0.0',
  },
   optimizeDeps: {
    exclude: [
      'zrender/lib/core/LRU.js',
      'zrender/lib/core/vector.js',
      'zrender/lib/core/BoundingRect.js',
      // Add other problematic paths similarly if needed
    ],
  },
});
