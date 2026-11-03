import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');
          if (normalized.includes('node_modules/three')) {
            return 'three-vendor';
          }
          if (normalized.includes('node_modules/@react-three')) {
            return 'r3f-vendor';
          }
          if (
            normalized.includes('node_modules/react') ||
            normalized.includes('node_modules/react-dom') ||
            normalized.includes('node_modules/react-router-dom')
          ) {
            return 'react-vendor';
          }
          if (
            normalized.includes('node_modules/gsap') ||
            normalized.includes('node_modules/lenis') ||
            normalized.includes('node_modules/framer-motion')
          ) {
            return 'motion-vendor';
          }
          if (normalized.includes('node_modules/lucide-react')) {
            return 'icons-vendor';
          }
        }
      }
    }
  }
})

