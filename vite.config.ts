import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5174,
    strictPort: true,
    watch: {
      ignored: [
        '**/release/**',
        '**/dist/**',
        '**/electron-dist/**',
        '**/.git/**',
        '**/*.exe',
        '**/*.7z',
        '**/*.blockmap'
      ]
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'pdf-lib',
      'jspdf',
      'jszip',
      'mammoth',
      'xlsx',
      'dxf-parser'
    ]
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 3000
  }
});
