import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { contentIndex } from './scripts/content-index';

export default defineConfig({
  plugins: [react(), contentIndex(__dirname)],
  server: { port: 5173, proxy: { '/api': 'http://localhost:8787' } },
  worker: { format: 'es' },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react';
          // Parsers are shared by static code blocks (initial load) and the editor (lazy).
          if (/node_modules\/@lezer\/(common|lr|highlight)\//.test(id)) return 'lezer';
          if (id.includes('@codemirror/view') || id.includes('@codemirror/commands') || id.includes('@codemirror/autocomplete') || id.includes('@codemirror/search')) return 'editor';
        },
      },
    },
  },
});
