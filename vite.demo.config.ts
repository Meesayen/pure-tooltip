import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: resolve(import.meta.dirname, 'demo'),
  base: '/pure-tooltip/',
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: resolve(import.meta.dirname, 'docs'),
    emptyOutDir: true,
  },
})
