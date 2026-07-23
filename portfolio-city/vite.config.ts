import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  // Deploying to `https://<user>.github.io/` (a user site) => keep '/'.
  // Deploying to a project page (`/<repo>/`) => set VITE_BASE=/<repo>/ at build time.
  base: process.env.VITE_BASE ?? '/',
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithms: ['brotliCompress', 'gzip'], exclude: [/\.(br|gz)$/] }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Keep the 3D engine out of the critical path so the shell + hero paint fast.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('three') && !id.includes('@react-three')) return 'three'
          if (id.includes('@react-three') || id.includes('postprocessing') || id.includes('maath')) return 'r3f'
          if (id.includes('framer-motion') || id.includes('gsap')) return 'motion'
          if (id.includes('react-router')) return 'router'
          return 'vendor'
        },
      },
    },
  },
  server: { port: 5173, open: false },
  preview: { port: 4173 },
})
