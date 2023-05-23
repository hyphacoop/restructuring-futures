import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

export default defineConfig({
  base: '',
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
  ],
  build: {
    rollupOptions: {
      external: ['fsevents'],
      output: {
        manualChunks: {
          'svelte': ['svelte', '@sveltejs/vite-plugin-svelte']
        }
      }
    }
  }
})
