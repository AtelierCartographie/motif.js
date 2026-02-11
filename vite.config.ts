import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

export default defineConfig(({ command, mode }) => {
  // Determine if we're building the library or serving the demo
  const isLib = !process.argv.includes('demo') && command === 'build'

  if (isLib) {
    // Library build configuration
    return {
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
    }
  } else {
    // Demo app configuration (pnpm dev)
    return {
      root: 'demo',
      server: {
        port: 5173,
        open: true
      },
      build: {
        outDir: '../dist-demo',
        target: 'ES2020'
      }
    }
  }
})




