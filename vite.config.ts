import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/YetAnotherTodo/', // Set base path to match the repository name
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
