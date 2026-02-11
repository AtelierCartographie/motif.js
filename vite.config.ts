import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Motif',
      formats: ['es', 'umd'],
      fileName: (format) => `motif.${format === 'es' ? 'mjs' : 'js'}`
    },
    minify: false,
    target: 'ES2020'
  }
})
