import { defineConfig } from 'vite'
import { viteMockServe } from "vite-plugin-mock";
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    viteMockServe({
      mockPath: "mock",
      localEnabled: true,
    }),
  ],
  css: {
    postcss: './postcss.config.js'
  }
})
