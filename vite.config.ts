import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vite-react-typescript-starter/', // Replace 'vite-react-typescript-starter' with your repo name if different
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
