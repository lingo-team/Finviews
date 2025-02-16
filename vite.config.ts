import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [react()],
  // build: {
  //   outDir: 'build',  // Change the default 'dist' directory to 'build' .. now it is on dist
  // },
  // optimizeDeps: {
  //   exclude: ['lucide-react'],
  // },
});
