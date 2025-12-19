import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 4466,
    strictPort: true,
    host: 'localhost'
  },
  preview: {
    port: 4466
  }
});
