/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    react(),
    svelte(),
    tailwindcss(),
    dts({
      bundleTypes: true,
      include: ['src'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        vue: resolve(import.meta.dirname, 'src/vue/index.ts'),
        react: resolve(import.meta.dirname, 'src/react/index.tsx'),
        svelte: resolve(import.meta.dirname, 'src/svelte/index.ts'),
        ce: resolve(import.meta.dirname, 'src/ce/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue', 'react', 'react-dom', 'react/jsx-runtime', 'svelte'],
      output: {
        globals: {
          vue: 'Vue',
          react: 'React',
          'react-dom': 'ReactDOM',
          svelte: 'Svelte',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    globals: true,
  },
})
