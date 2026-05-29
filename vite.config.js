import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/my_portofolio/",
  server: {
    port: 5173,
    strictPort: true,
    host: true
  }
})