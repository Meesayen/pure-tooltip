import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: resolve(import.meta.dirname, 'demo'),
  base: '/pure-tooltip/',
  plugins: [vue(), react(), svelte(), tailwindcss()],
  build: {
    outDir: resolve(import.meta.dirname, 'docs'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'demo/index.html'),
        react: resolve(import.meta.dirname, 'demo/react.html'),
        svelte: resolve(import.meta.dirname, 'demo/svelte.html'),
        ce: resolve(import.meta.dirname, 'demo/ce.html'),
      },
    },
  },
})
