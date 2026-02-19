import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/motif.js/' : '/',
  plugins: [svelte()],
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      '$lib': path.resolve(__dirname, './src/lib'),
      'motif.js': path.resolve(__dirname, '../src/index.ts'),
    },
  },
  build: {
    outDir: '../dist-demo',
    target: 'ES2020',
  },
});
